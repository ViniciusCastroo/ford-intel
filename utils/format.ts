import type { SpecValue } from '../types/vehicle';

// Formata qualquer SpecValue para exibição — NUNCA retorna string vazia
export function formatarValor(valor: SpecValue): string {
  if (valor === null || valor === undefined || valor === '') {
    return 'Não disponível';
  }
  if (typeof valor === 'number') {
    return valor.toLocaleString('pt-BR');
  }
  return String(valor);
}

// Formata preço em reais
export function formatarPreco(valor: SpecValue): string {
  if (valor === null || valor === undefined) return 'Não disponível';
  const num = typeof valor === 'number' ? valor : Number(valor);
  if (isNaN(num)) return 'Não disponível';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
  }).format(num);
}

// Formata data ISO para pt-BR
export function formatarData(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}
