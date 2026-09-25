import { normalizarTexto } from '../utils/format';

const BASE_URL = 'https://parallelum.com.br/fipe/api/v1/carros';

const TIMEOUT_MS = 8000;

async function fetchComTimeout(url: string): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: controller.signal });
    return res;
  } finally {
    clearTimeout(timer);
  }
}

const CODIGOS_MARCAS: Record<string, string> = {
  'Ford': '22',
  'Toyota': '56',
  'Volkswagen': '59',
  'Chevrolet': '23',
  'Honda': '25',
  'Hyundai': '26',
  'Nissan': '43',
  'Mitsubishi': '41',
  'Jeep': '29',
  'RAM': '185',
  'Renault': '48',
  'Fiat': '21',
  'Mercedes-Benz': '39',
  'Land Rover': '33',
};

const ELETRIFICADO = new Set(['eletrico', 'hibrido', 'ev', 'phev', 'hev', 'tech']);
const MODERNO_COMUM = new Set(['flex', 'flexone']);
const MODERNO_TURBO = new Set(['turbo', 'tb', 'tsi', 'tce', 'gdi', 'tgdi']);

interface ModeloFipe {
  codigo: number;
  nome: string;
}

interface AnoFipe {
  codigo: string;
  nome: string;
}

interface PrecoFipe {
  Valor: string;
  MesReferencia: string;
}

const cacheModelos = new Map<string, ModeloFipe[]>();

function palavras(s: string): string[] {
  const texto = normalizarTexto(s);
  const simples = texto.split(/[^a-z0-9]+/).filter(Boolean);
  const coladas = (texto.match(/[a-z0-9]+(?:-[a-z0-9]+)+/g) ?? []).map((p) => p.replace(/-/g, ''));
  return [...simples, ...coladas];
}

function frequencias(modelos: ModeloFipe[]): Map<string, number> {
  const freq = new Map<string, number>();
  for (const item of modelos) {
    for (const p of new Set(palavras(item.nome))) freq.set(p, (freq.get(p) ?? 0) + 1);
  }
  return freq;
}

function equivalentes(alvo: string, candidata: string): boolean {
  return alvo === candidata || (candidata.length >= 4 && alvo.startsWith(candidata));
}

function contem(lista: string[], alvo: string): boolean {
  return lista.some((c) => equivalentes(alvo, c));
}

function unidades(texto: string): Array<{ junta: string; partes: string[] }> {
  return normalizarTexto(texto)
    .split(/\s+/)
    .filter(Boolean)
    .map((u) => ({
      junta: u.replace(/[^a-z0-9]/g, ''),
      partes: u.split(/[^a-z0-9]+/).filter(Boolean),
    }))
    .filter((u) => u.junta.length > 0);
}

function escolherModelo(
  modelos: ModeloFipe[],
  modelo: string,
  versao: string,
): ModeloFipe | null {
  const alvo = unidades(modelo);
  if (alvo.length === 0) return null;

  const extras = palavras(versao);
  const freq = frequencias(modelos);
  const peso = (p: string) => 1 / (freq.get(p) ?? 1);
  const pedeEletrico = [...alvo.flatMap((u) => u.partes), ...extras].some((p) => ELETRIFICADO.has(p));

  let melhor: ModeloFipe | null = null;
  let melhorScore = -Infinity;

  for (const item of modelos) {
    const candidata = palavras(item.nome);
    const acertos = alvo.filter(
      (u) => contem(candidata, u.junta) || u.partes.every((p) => contem(candidata, p)),
    ).length;
    const cobertura = acertos / alvo.length;
    if (cobertura <= 0.5) continue;

    const ancorada = normalizarTexto(item.nome).replace(/[^a-z0-9]/g, '').startsWith(alvo[0].junta) ? 300 : 0;
    const bonusVersao = extras.filter((p) => contem(candidata, p)).reduce((soma, p) => soma + peso(p), 0) * 150;
    const penalidade = !pedeEletrico && candidata.some((p) => ELETRIFICADO.has(p)) ? 500 : 0;
    const moderno = candidata.some((p) => MODERNO_COMUM.has(p))
      ? 80
      : candidata.some((p) => MODERNO_TURBO.has(p))
        ? 50
        : 0;
    const score = cobertura * 1000 + ancorada + bonusVersao + moderno - penalidade - candidata.length;

    if (score > melhorScore) {
      melhorScore = score;
      melhor = item;
    }
  }

  return melhor;
}

async function carregarModelos(codigoMarca: string): Promise<ModeloFipe[] | null> {
  const emCache = cacheModelos.get(codigoMarca);
  if (emCache) return emCache;

  const res = await fetchComTimeout(`${BASE_URL}/marcas/${codigoMarca}/modelos`);
  if (!res.ok) return null;
  const data = await res.json() as { modelos: ModeloFipe[] };

  cacheModelos.set(codigoMarca, data.modelos);
  return data.modelos;
}

async function buscarCodigoAno(
  codigoMarca: string,
  codigoModelo: number,
  ano?: number,
): Promise<string | null> {
  const res = await fetchComTimeout(
    `${BASE_URL}/marcas/${codigoMarca}/modelos/${codigoModelo}/anos`,
  );
  if (!res.ok) return null;
  const anos = await res.json() as AnoFipe[];

  const doAno = ano ? anos.find((a) => a.codigo.startsWith(`${ano}-`)) : undefined;
  return (doAno ?? anos[0])?.codigo ?? null;
}

async function buscarPreco(
  codigoMarca: string,
  codigoModelo: number,
  codigoAno: string,
): Promise<{ preco: number | null; mesReferencia: string | null }> {
  const res = await fetchComTimeout(
    `${BASE_URL}/marcas/${codigoMarca}/modelos/${codigoModelo}/anos/${codigoAno}`,
  );
  if (!res.ok) return { preco: null, mesReferencia: null };
  const data = await res.json() as PrecoFipe;

  const num = Number(
    data.Valor.replace('R$', '').replace(/\./g, '').replace(',', '.').trim(),
  );
  const preco = isNaN(num) ? null : Math.round(num);
  return { preco, mesReferencia: data.MesReferencia ?? null };
}

export async function encontrarVeiculo(
  marca: string,
  modelo: string,
  versao = '',
  ano?: number,
): Promise<{ preco: number | null; referencia: string | null }> {
  const codigoMarca = CODIGOS_MARCAS[marca];
  if (!codigoMarca) return { preco: null, referencia: null };

  const modelos = await carregarModelos(codigoMarca);
  if (!modelos) return { preco: null, referencia: null };

  const escolhido = escolherModelo(modelos, modelo, versao);
  if (!escolhido) return { preco: null, referencia: null };

  const codigoAno = await buscarCodigoAno(codigoMarca, escolhido.codigo, ano);
  if (!codigoAno) return { preco: null, referencia: null };

  const { preco, mesReferencia } = await buscarPreco(codigoMarca, escolhido.codigo, codigoAno);
  return { preco, referencia: mesReferencia };
}
