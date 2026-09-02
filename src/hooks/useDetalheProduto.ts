import { useCallback } from 'react';
import type { DetalheProdutoResponse } from '@/types';
import { P_LIMITE_DIAS } from '@/constants';
import { callEstoqueRpc } from '@/lib/rpc';
import { useRpcQuery } from './useRpcQuery';

export function useDetalheProduto(options: {
  produtoid: number | string | null;
  lojaDestaque: string | null;
  janela: number;
  enabled: boolean;
  snapshot?: DetalheProdutoResponse;
}) {
  const { produtoid, lojaDestaque, janela, enabled, snapshot } = options;
  const fetcher = useCallback(
    () =>
      callEstoqueRpc<DetalheProdutoResponse>('detalhe_produto', {
        p_produtoid: produtoid,
        p_loja_destaque: lojaDestaque,
        p_janela: janela,
        p_limite_dias: P_LIMITE_DIAS,
      }),
    [produtoid, lojaDestaque, janela]
  );

  return useRpcQuery<DetalheProdutoResponse>({
    enabled: enabled && produtoid != null,
    snapshot,
    fetcher,
  });
}
