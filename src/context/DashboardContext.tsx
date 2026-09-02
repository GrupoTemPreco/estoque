/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type {
  DashboardEstoqueParams,
  DashboardEstoqueResponse,
  Filters,
  JanelaDias,
  ValorModo,
} from '@/types';
import { DEFAULT_JANELA } from '@/constants';
import { useDashboardEstoque } from '@/hooks/useDashboardEstoque';
import { toRpcValue } from '@/utils';

interface DashboardContextValue {
  data: DashboardEstoqueResponse | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
  filters: Filters;
  setFilters: (f: Filters) => void;
  janela: JanelaDias;
  setJanela: (j: JanelaDias) => void;
  modo: ValorModo;
  setModo: (m: ValorModo) => void;
  rpcParams: DashboardEstoqueParams;
}

const DashboardContext = createContext<DashboardContextValue | null>(null);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<Filters>({ loja: 'all', classe: 'all', curva: 'all' });
  const [janela, setJanela] = useState<JanelaDias>(DEFAULT_JANELA);
  const [modo, setModo] = useState<ValorModo>('custo');

  const rpcParams = useMemo<DashboardEstoqueParams>(
    () => ({
      janela,
      loja: toRpcValue(filters.loja),
      classe: toRpcValue(filters.classe),
      curva: toRpcValue(filters.curva),
    }),
    [janela, filters]
  );

  const { data, loading, error, refetch } = useDashboardEstoque(rpcParams);

  const value = useMemo(
    () => ({
      data,
      loading,
      error,
      refetch,
      filters,
      setFilters,
      janela,
      setJanela,
      modo,
      setModo,
      rpcParams,
    }),
    [data, loading, error, refetch, filters, janela, modo, rpcParams]
  );

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
}

export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error('useDashboard precisa de DashboardProvider');
  return ctx;
}
