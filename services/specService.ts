// Serviço de especificações — monta a TechSpecSheet completa
// 1. Verifica mock disponível → retorna dados completos
// 2. Tenta preço real na API FIPE
// 3. SEMPRE retorna todos os campos — null quando não sabe

import { TODOS_OS_MOCKS } from '../constants/mockData';
import * as fipeService from './fipeService';
import type { BuscaVeiculo, TechSpecSheet, VehicleCategory } from '../types/vehicle';

// Verifica se dois nomes são parecidos (ignora maiúsculas e acentos)
function parecido(a: string, b: string): boolean {
  const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  return norm(a).includes(norm(b)) || norm(b).includes(norm(a));
}

// Infere a categoria pelo nome do modelo
function inferirCategoria(modelo: string): VehicleCategory {
  const m = modelo.toLowerCase();
  if (['ranger', 'hilux', 'amarok', 'l200', 's10', 'frontier', 'ram', 'maverick', 'triton'].some((x) => m.includes(x))) return 'pickup';
  if (['suv', 'tucson', 'compass', 'cr-v', 'tiguan', 'bronco', 'cross', 'sw4', 'defender', 'evoque', 'equinox', 'trailblazer'].some((x) => m.includes(x))) return 'suv';
  if (['corolla', 'civic', 'sentra', 'jetta', 'classe c'].some((x) => m.includes(x))) return 'sedan';
  if (['hb20', 'kwid', 'fit', 'clio', 'polo'].some((x) => m.includes(x))) return 'hatch';
  return 'outro';
}

// Conta campos SpecValue preenchidos (não null)
function contarCampos(ficha: TechSpecSheet): { preenchidos: number; total: number } {
  const secoes = [ficha.motor, ficha.dimensoes, ficha.eficiencia, ficha.seguranca, ficha.tecnologia, ficha.preco];
  let total = 0;
  let preenchidos = 0;
  for (const secao of secoes) {
    for (const val of Object.values(secao)) {
      total++;
      if (val !== null && val !== undefined && val !== '') preenchidos++;
    }
  }
  return { preenchidos, total };
}

// Gera a ficha técnica completa para um veículo
export async function gerarFicha(input: BuscaVeiculo): Promise<TechSpecSheet> {
  const id = `${Date.now()}`;
  const agora = new Date().toISOString();

  // 1. Verifica se há mock para este veículo (match por marca + modelo)
  const mock = TODOS_OS_MOCKS.find(
    (m) => parecido(m.veiculo.marca, input.marca) && parecido(m.veiculo.modelo, input.modelo),
  );

  if (mock) {
    // Atualiza preço FIPE em tempo real (não bloqueia se API falhar)
    let precoAtual = mock.preco;
    let fontePreco = mock.metadata.fonte;
    try {
      const resultado = await fipeService.encontrarVeiculo(input.marca, input.modelo);
      if (resultado.preco) {
        precoAtual = { fipe: resultado.preco, referencia: resultado.referencia };
        fontePreco = 'fipe';
      }
    } catch {
      // Mantém preço do mock se API falhar
    }

    const ficha: TechSpecSheet = {
      ...mock,
      id,
      createdAt: agora,
      veiculo: {
        ...mock.veiculo,
        versao: input.versao || mock.veiculo.versao,
        ano: input.ano ?? mock.veiculo.ano,
      },
      preco: precoAtual,
      metadata: { ...mock.metadata, fonte: fontePreco },
    };
    const { preenchidos, total } = contarCampos(ficha);
    return { ...ficha, metadata: { ...ficha.metadata, campos_preenchidos: preenchidos, total_campos: total } };
  }

  // 2. Sem mock — busca preço na FIPE e monta ficha com campos null
  let preco = null;
  let referencia = null;
  try {
    const resultado = await fipeService.encontrarVeiculo(input.marca, input.modelo);
    preco = resultado.preco;
    referencia = resultado.referencia;
  } catch {
    // API indisponível — ficha parcial
  }

  const ficha: TechSpecSheet = {
    id,
    createdAt: agora,
    veiculo: {
      marca: input.marca,
      modelo: input.modelo,
      versao: input.versao,
      ano: input.ano ?? null,
      categoria: inferirCategoria(input.modelo),
    },
    motor: {
      cilindrada: null, tipo: null, potencia_cv: null,
      torque_nm: null, combustivel: null, transmissao: null, tracao: null,
    },
    dimensoes: {
      comprimento_mm: null, largura_mm: null, altura_mm: null,
      entre_eixos_mm: null, altura_livre_mm: null, peso_kg: null,
      capacidade_carga_kg: null, capacidade_reboque_kg: null,
    },
    eficiencia: {
      consumo_cidade: null, consumo_estrada: null,
      tanque_litros: null, autonomia_km: null,
    },
    seguranca: {
      airbags: null, abs: null, controle_estabilidade: null,
      controle_tracao: null, assistente_frenagem: null,
    },
    tecnologia: {
      central_multimidia: null, conectividade: null,
      camera_re: null, sensores_estacionamento: null, piloto_automatico: null,
    },
    preco: { fipe: preco, referencia },
    metadata: {
      fonte: preco ? 'fipe' : 'manual',
      campos_preenchidos: preco ? 2 : 0,
      total_campos: 29,
      is_simulado: true,
    },
  };

  const { preenchidos, total } = contarCampos(ficha);
  return { ...ficha, metadata: { ...ficha.metadata, campos_preenchidos: preenchidos, total_campos: total } };
}
