import { useCallback } from 'react';
import type { DashboardEstoqueParams, ProdutosPrincipioAtivoResponse } from '@/types';
import { P_LIMITE_DIAS } from '@/constants';
import { callEstoqueRpc } from '@/lib/rpc';
import { useRpcQuery } from './useRpcQuery';

export function useProdutosPrincipioAtivo(options: {
  principioAtivo: string | null;
  params: DashboardEstoqueParams;
  enabled: boolean;
  snapshot?: ProdutosPrincipioAtivoResponse;
}) {
  const { principioAtivo, params, enabled, snapshot } = options;
  const fetcher = useCallback(
    () =>
      callEstoqueRpc<ProdutosPrincipioAtivoResponse>('produtos_principio_ativo', {
        p_principio_ativo: principioAtivo,
        p_janela: params.janela,
        p_loja: params.loja,
        p_classe: params.classe,
        p_curva: params.curva,
        p_limite_dias: P_LIMITE_DIAS,
      }),
    [principioAtivo, params.janela, params.loja, params.classe, params.curva]
  );

  return useRpcQuery<ProdutosPrincipioAtivoResponse>({
    enabled: enabled && Boolean(principioAtivo),
    snapshot,
    fetcher,
  });
}
