import { useEffect, useRef, useState } from 'react';
import type { BuscarProdutosResponse, DashboardEstoqueParams } from '@/types';
import { P_LIMITE_DIAS, P_LINHAS } from '@/constants';
import { callEstoqueRpc } from '@/lib/rpc';

const DEBOUNCE_MS = 400;
const MIN_CHARS = 3;

export function useBuscarProdutos(termo: string, params: DashboardEstoqueParams) {
  const [data, setData] = useState<BuscarProdutosResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const requestId = useRef(0);
  const trimmed = termo.trim();
  const active = trimmed.length >= MIN_CHARS;

  useEffect(() => {
    if (!active) {
      requestId.current += 1;
      setData(null);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    const timer = window.setTimeout(() => {
      const id = ++requestId.current;
      void (async () => {
        try {
          const next = await callEstoqueRpc<BuscarProdutosResponse>('buscar_produtos', {
            p_termo: trimmed,
            p_janela: params.janela,
            p_loja: params.loja,
            p_classe: params.classe,
            p_curva: params.curva,
            p_limite_dias: P_LIMITE_DIAS,
            p_linhas: P_LINHAS,
          });
          if (id !== requestId.current) return;
          setData(next);
          setError(null);
        } catch (e) {
          if (id !== requestId.current) return;
          setError(e instanceof Error ? e.message : 'Falha na busca.');
        } finally {
          if (id === requestId.current) setLoading(false);
        }
      })();
    }, DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timer);
      requestId.current += 1;
    };
  }, [active, trimmed, params.janela, params.loja, params.classe, params.curva]);

  return { data, loading: active && loading, error, active };
}
