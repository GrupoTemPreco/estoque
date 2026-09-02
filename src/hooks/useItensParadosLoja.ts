import { useCallback } from 'react';
import type { ItensParadosLojaResponse } from '@/types';
import { P_LIMITE_DIAS, P_LINHAS } from '@/constants';
import { callEstoqueRpc } from '@/lib/rpc';
import { useRpcQuery } from './useRpcQuery';

export function useItensParadosLoja(options: {
  loja: string | null;
  janela: number;
  classe: string | null;
  curva: string | null;
  enabled: boolean;
  snapshot?: ItensParadosLojaResponse;
}) {
  const { loja, janela, classe, curva, enabled, snapshot } = options;
  const fetcher = useCallback(
    () =>
      callEstoqueRpc<ItensParadosLojaResponse>('itens_parados_loja', {
        p_loja: loja,
        p_janela: janela,
        p_classe: classe,
        p_curva: curva,
        p_limite_dias: P_LIMITE_DIAS,
        p_linhas: P_LINHAS,
      }),
    [loja, janela, classe, curva]
  );

  return useRpcQuery<ItensParadosLojaResponse>({
    enabled: enabled && Boolean(loja),
    snapshot,
    fetcher,
  });
}
