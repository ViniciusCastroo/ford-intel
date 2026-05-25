// Serviço FIPE — API pública https://parallelum.com.br/fipe/api/v1/carros
const BASE_URL = 'https://parallelum.com.br/fipe/api/v1/carros';

// Timeout de 8s por request — evita travar em redes lentas
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

// Códigos de marca na API FIPE (fonte: GET /marcas)
const CODIGOS_MARCAS: Record<string, string> = {
  'Ford': '22',
  'Toyota': '59',
  'Volkswagen': '39',
  'Chevrolet': '23',
  'Honda': '25',
  'Hyundai': '97',
  'Nissan': '30',
  'Mitsubishi': '29',
  'Jeep': '138',
  'RAM': '116',
  'Renault': '44',
  'Fiat': '21',
  'Mercedes-Benz': '26',
  'Land Rover': '118',
};

interface ModeloFipe {
  codigo: number;
  nome: string;
}

interface PrecoFipe {
  Valor: string;
  MesReferencia: string;
}

// Normaliza string para comparação: minúsculas, sem acento
function normalizar(s: string): string {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

// Busca código do modelo pelo nome (match parcial, case+acento insensitive)
async function buscarCodigoModelo(
  codigoMarca: string,
  nomeModelo: string,
): Promise<number | null> {
  const res = await fetchComTimeout(`${BASE_URL}/marcas/${codigoMarca}/modelos`);
  if (!res.ok) return null;
  const data = await res.json() as { modelos: ModeloFipe[] };

  const alvo = normalizar(nomeModelo);
  const palavrasAlvo = alvo.split(/\s+/).filter((p) => p.length > 2);

  // 1. Match exato do nome completo (melhor match)
  let encontrado = data.modelos.find((m) => normalizar(m.nome).includes(alvo));

  // 2. Fallback: qualquer palavra do modelo bate com o nome da API
  if (!encontrado) {
    encontrado = data.modelos.find((m) => {
      const nomeApi = normalizar(m.nome);
      return palavrasAlvo.some((p) => nomeApi.includes(p));
    });
  }

  return encontrado?.codigo ?? null;
}

// Busca o ano mais recente disponível para o modelo
async function buscarAnoRecente(codigoMarca: string, codigoModelo: number): Promise<string | null> {
  const res = await fetchComTimeout(
    `${BASE_URL}/marcas/${codigoMarca}/modelos/${codigoModelo}/anos`,
  );
  if (!res.ok) return null;
  const anos = await res.json() as Array<{ codigo: string; nome: string }>;
  // A API retorna anos em ordem decrescente — primeiro = mais recente
  return anos[0]?.codigo ?? null;
}

// Busca preço e mês de referência da FIPE
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

  // Valor vem como "R$ 340.000,00" → converte para número inteiro
  const num = Number(
    data.Valor.replace('R$', '').replace(/\./g, '').replace(',', '.').trim(),
  );
  const preco = isNaN(num) ? null : Math.round(num);
  return { preco, mesReferencia: data.MesReferencia ?? null };
}

// Função principal — retorna preço real da FIPE e mês de referência
// Retorna { preco: null, referencia: null } se marca não mapeada ou API falhar
export async function encontrarVeiculo(
  marca: string,
  modelo: string,
): Promise<{ preco: number | null; referencia: string | null }> {
  const codigoMarca = CODIGOS_MARCAS[marca];
  if (!codigoMarca) return { preco: null, referencia: null };

  const codigoModelo = await buscarCodigoModelo(codigoMarca, modelo);
  if (codigoModelo === null) return { preco: null, referencia: null };

  const codigoAno = await buscarAnoRecente(codigoMarca, codigoModelo);
  if (!codigoAno) return { preco: null, referencia: null };

  const { preco, mesReferencia } = await buscarPreco(codigoMarca, codigoModelo, codigoAno);
  return { preco, referencia: mesReferencia };
}
