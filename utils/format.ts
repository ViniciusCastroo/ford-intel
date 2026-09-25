import type { SpecValue } from '../types/vehicle';

export function formatarValor(valor: SpecValue): string {
  if (valor === null || valor === undefined || valor === '') {
    return 'Não disponível';
  }
  if (typeof valor === 'number') {
    return valor.toLocaleString('pt-BR');
  }
  return String(valor);
}

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

export function formatarData(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function normalizarTexto(texto: string): string {
  return texto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}
