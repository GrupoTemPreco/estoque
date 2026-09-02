import type { ValorModo } from './types';
import { ESTOQUE_DIAS_WARNING } from './constants';

const BRL = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const NUM2 = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const NUM_INT = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 });

export const formatBRL = (v: number): string => BRL.format(v);

export const formatNumber = (v: number): string => NUM2.format(v);

export const formatInt = (v: number): string => NUM_INT.format(v);

/**
 * Média/mês conforme regra de negócio:
 * - 0 se realmente zero
 * - 0,25 se fracionário (entre 0 e 1)
 * - 3,4 se < 10 (uma casa decimal)
 * - senão inteiro
 * Nunca arredonda pra zero um valor > 0.
 */
export function formatMediaMensal(mediaMensal: number): string {
  if (mediaMensal === 0) return '0';
  if (mediaMensal > 0 && mediaMensal < 1) return NUM2.format(mediaMensal);
  if (mediaMensal < 10) return NUM2.format(mediaMensal);
  return NUM_INT.format(Math.round(mediaMensal));
}

export function formatEstoqueDias(d: number | null): string {
  if (d === null) return 'sem venda';
  return NUM_INT.format(Math.round(d));
}

const PCT1 = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

export function formatPercent1(v: number): string {
  return `${PCT1.format(v)}%`;
}

export function formatPercentParado(parado: number, total: number): string {
  if (total <= 0) return '—';
  return formatPercent1((parado / total) * 100);
}

export function formatRelativeFrom(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return '';
  const mins = Math.max(0, Math.floor((Date.now() - then) / 60_000));
  if (mins < 1) return 'Atualizado agora';
  if (mins < 60) return `Atualizado há ${mins}min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `Atualizado há ${hours}h`;
  const days = Math.floor(hours / 24);
  return `Atualizado há ${days}d`;
}

export function formatUltimaAtualizacao(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return `Última atualização: ${dd}/${mm}/${yyyy} às ${hh}:${min}`;
}

/** YYYY-MM-DD (ou ISO) → dd/mm/aaaa. Evita Date() para não deslocar fuso. */
export function formatIsoDate(iso: string | null | undefined): string {
  if (!iso) return '—';
  const day = iso.slice(0, 10);
  const [y, m, d] = day.split('-');
  if (!y || !m || !d) return iso;
  return `${d}/${m}/${y}`;
}

export function pickValor(custo: number, venda: number, modo: ValorModo): number {
  return modo === 'venda' ? venda : custo;
}

export type EstoqueDiasLevel = 'normal' | 'warning' | 'danger' | 'no-sale';

export function estoqueDiasLevel(estDias: number | null, limiteDias: number): EstoqueDiasLevel {
  if (estDias === null) return 'no-sale';
  if (estDias > limiteDias) return 'danger';
  if (estDias > ESTOQUE_DIAS_WARNING) return 'warning';
  return 'normal';
}

export const estoqueDiasBadgeClasses: Record<EstoqueDiasLevel, string> = {
  normal: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300',
  warning: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  danger: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  'no-sale': 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
};

export function rowKey(loja: string, produtoid: number | string): string {
  return `${loja}-${produtoid}`;
}

export function toRpcValue(value: string): string | null {
  return value === 'all' ? null : value;
}

export const SEVERIDADE_CLASSES: Record<string, string> = {
  sem_estoque: 'border-gray-300 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-800/40',
  sem_venda: 'border-red-300 dark:border-red-800/70 bg-red-50/70 dark:bg-red-950/20',
  critico: 'border-red-400 dark:border-red-700 bg-red-50/80 dark:bg-red-950/30',
  atencao: 'border-amber-300 dark:border-amber-800/70 bg-amber-50/70 dark:bg-amber-950/20',
  ok: 'border-emerald-300 dark:border-emerald-800/60 bg-emerald-50/50 dark:bg-emerald-950/20',
};

export function splitPaItens<T extends { nunca_vendeu: boolean }>(items: T[]) {
  const nunca = items.filter((i) => i.nunca_vendeu);
  const resto = items.filter((i) => !i.nunca_vendeu);
  return { nunca, resto };
}

