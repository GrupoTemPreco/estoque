import { useCallback, useEffect, useRef, useState } from 'react';
import type { DashboardEstoqueParams, DashboardEstoqueResponse } from '@/types';
import { P_LIMITE_DIAS, P_LINHAS } from '@/constants';
import { callEstoqueRpc } from '@/lib/rpc';
import { isSupabaseConfigured, MISSING_ENV_MESSAGE } from '@/lib/supabase';

const DEBOUNCE_MS = 300;

const EMPTY_TOTAL: DashboardEstoqueResponse['estoque_total'] = {
  itens: 0,
  valor_custo: 0,
  valor_venda: 0,
};

function normalize(p: DashboardEstoqueResponse): DashboardEstoqueResponse {
  return {
    ...p,
    por_classificacao: p.por_classificacao ?? [],
    por_loja: p.por_loja ?? [],
    por_curva: p.por_curva ?? [],
    tempo_sem_venda: p.tempo_sem_venda ?? [],
    tabela: p.tabela ?? [],
    sem_vendas: p.sem_vendas ?? [],
    top_sem_venda: p.top_sem_venda ?? [],
    totais: p.totais ?? { itens_na_tabela: 0, itens_sem_vendas: 0 },
    estoque_total: p.estoque_total ?? EMPTY_TOTAL,
    ultima_atualizacao: p.ultima_atualizacao ?? { em: null, registros: 0 },
    sem_venda_kpis: {
      dias_medio: p.sem_venda_kpis.dias_medio,
      itens_mais_180d: p.sem_venda_kpis.itens_mais_180d,
      itens_nunca: p.sem_venda_kpis.itens_nunca,
      valor_nunca: p.sem_venda_kpis.valor_nunca ?? 0,
      max_dias: p.sem_venda_kpis.max_dias,
    },
  };
}

export function useDashboardEstoque(params: DashboardEstoqueParams) {
  const { janela, loja, classe, curva } = params;
  const [data, setData] = useState<DashboardEstoqueResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const requestId = useRef(0);
  const firstLoad = useRef(true);
  const paramsRef = useRef(params);
  paramsRef.current = params;

  const fetchDashboard = useCallback(async (next: DashboardEstoqueParams) => {
    const id = ++requestId.current;

    if (!isSupabaseConfigured()) {
      if (id !== requestId.current) return;
      setData(null);
      setError(MISSING_ENV_MESSAGE);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const raw = await callEstoqueRpc<DashboardEstoqueResponse>('dashboard_estoque', {
        p_janela: next.janela,
        p_loja: next.loja,
        p_classe: next.classe,
        p_curva: next.curva,
        p_limite_dias: P_LIMITE_DIAS,
        p_linhas: P_LINHAS,
      });
      if (id !== requestId.current) return;
      if (!raw.resumo || !raw.parametros || !raw.sem_venda_kpis) {
        setError('A RPC não devolveu um payload válido.');
        setLoading(false);
        return;
      }
      setData(normalize(raw));
    } catch (e) {
      if (id !== requestId.current) return;
      setError(e instanceof Error ? e.message : 'Falha ao carregar.');
    } finally {
      if (id === requestId.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const delay = firstLoad.current ? 0 : DEBOUNCE_MS;
    firstLoad.current = false;
    const timer = window.setTimeout(() => {
      void fetchDashboard({ janela, loja, classe, curva });
    }, delay);

    return () => {
      window.clearTimeout(timer);
      requestId.current += 1;
    };
  }, [janela, loja, classe, curva, fetchDashboard]);

  const refetch = useCallback(() => {
    void fetchDashboard(paramsRef.current);
  }, [fetchDashboard]);

  return { data, loading, error, refetch };
}
