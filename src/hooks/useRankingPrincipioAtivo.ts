import { useCallback } from 'react';
import type { DashboardEstoqueParams, RankingPrincipioAtivoResponse } from '@/types';
import { P_LINHAS } from '@/constants';
import { callEstoqueRpc } from '@/lib/rpc';
import { useRpcQuery } from './useRpcQuery';

export function useRankingPrincipioAtivo(options: {
  params: DashboardEstoqueParams;
  enabled: boolean;
  snapshot?: RankingPrincipioAtivoResponse;
}) {
  const { params, enabled, snapshot } = options;
  const fetcher = useCallback(
    () =>
      callEstoqueRpc<RankingPrincipioAtivoResponse>('ranking_principio_ativo', {
        p_janela: params.janela,
        p_loja: params.loja,
        p_classe: params.classe,
        p_curva: params.curva,
        p_linhas: P_LINHAS,
      }),
    [params.janela, params.loja, params.classe, params.curva]
  );

  return useRpcQuery<RankingPrincipioAtivoResponse>({
    enabled,
    snapshot,
    fetcher,
  });
}
