import { TODOS_OS_MOCKS } from '../constants/mockData';
import * as fipeService from './fipeService';
import type { BuscaVeiculo, TechSpecSheet, VehicleCategory } from '../types/vehicle';
import { normalizarTexto } from '../utils/format';

function parecido(a: string, b: string): boolean {
  return normalizarTexto(a).includes(normalizarTexto(b)) || normalizarTexto(b).includes(normalizarTexto(a));
}

function inferirCategoria(modelo: string): VehicleCategory {
  const m = modelo.toLowerCase();
  if (['ranger', 'hilux', 'amarok', 'l200', 's10', 'frontier', 'ram', 'maverick', 'triton'].some((x) => m.includes(x))) return 'pickup';
  if (['suv', 'tucson', 'compass', 'cr-v', 'tiguan', 'bronco', 'cross', 'sw4', 'defender', 'evoque', 'equinox', 'trailblazer'].some((x) => m.includes(x))) return 'suv';
  if (['corolla', 'civic', 'sentra', 'jetta', 'classe c'].some((x) => m.includes(x))) return 'sedan';
  if (['hb20', 'kwid', 'fit', 'clio', 'polo'].some((x) => m.includes(x))) return 'hatch';
  return 'outro';
}

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

async function consultarFipe(
  marca: string,
  modelo: string,
  versao: string,
  ano?: number,
): Promise<{ preco: number | null; referencia: string | null }> {
  try {
    return await fipeService.encontrarVeiculo(marca, modelo, versao, ano);
  } catch {
    return { preco: null, referencia: null };
  }
}

export async function gerarFicha(input: BuscaVeiculo): Promise<TechSpecSheet> {
  const id = `${Date.now()}`;
  const agora = new Date().toISOString();

  const mock = TODOS_OS_MOCKS.find(
    (m) => parecido(m.veiculo.marca, input.marca) && parecido(m.veiculo.modelo, input.modelo),
  );

  if (mock) {
    const fipe = await consultarFipe(
      mock.veiculo.marca,
      mock.veiculo.modelo,
      input.versao || mock.veiculo.versao,
      input.ano ?? mock.veiculo.ano ?? undefined,
    );
    const precoAtual = fipe.preco ? { fipe: fipe.preco, referencia: fipe.referencia } : mock.preco;
    const fontePreco = fipe.preco ? 'fipe' : mock.metadata.fonte;

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

  const { preco, referencia } = await consultarFipe(
    input.marca,
    input.modelo,
    input.versao,
    input.ano,
  );

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
