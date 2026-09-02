import { useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import type { ModalFrame } from '@/types';
import { useDashboard } from '@/context/DashboardContext';
import { useModalStack } from '@/context/ModalStack';
import { useProdutosPrincipioAtivo } from '@/hooks/useProdutosPrincipioAtivo';
import {
  formatBRL,
  formatEstoqueDias,
  formatInt,
  formatIsoDate,
  formatMediaMensal,
  pickValor,
  rowKey,
  SEVERIDADE_CLASSES,
} from '@/utils';
import Modal from './Modal';
import ModalStatus from './ModalStatus';
import CurveBadge from './CurveBadge';

export default function PrincipioAtivoModal({
  frame,
}: {
  frame: Extract<ModalFrame, { kind: 'pa' }>;
}) {
  const { modo, rpcParams } = useDashboard();
  const { close, back, stack, updateTopSnapshot, push } = useModalStack();
  const { data, loading, error, refetch } = useProdutosPrincipioAtivo({
    principioAtivo: frame.principioAtivo,
    params: rpcParams,
    enabled: true,
    snapshot: frame.snapshot,
  });

  useEffect(() => {
    if (data && !frame.snapshot) updateTopSnapshot(data);
  }, [data, frame.snapshot, updateTopSnapshot]);

  return (
    <Modal
      open
      size="lg"
      onClose={close}
      onBack={stack.length > 1 ? back : undefined}
      title={data?.principio_ativo ?? frame.principioAtivo}
    >
      <ModalStatus loading={loading && !data} error={data ? null : error} onRetry={refetch} />
      {data && (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <Stat label="Produtos" value={formatInt(data.grupo.produtos)} />
            <Stat label="Lojas" value={formatInt(data.grupo.lojas)} />
            <Stat label="Estoque" value={formatInt(data.grupo.estoque_total)} />
            <Stat
              label="Valor parado"
              value={formatBRL(pickValor(data.grupo.valor_custo, data.grupo.valor_venda, modo))}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            {data.itens.map((item) => (
              <button
                key={rowKey(item.loja_codigo, item.produtoid)}
                type="button"
                onClick={() =>
                  push({ kind: 'product', produtoid: item.produtoid, lojaDestaque: item.loja_codigo })
                }
                className={`flex items-center gap-3 px-3 py-2.5 rounded-card border text-left transition-colors hover:brightness-95 ${
                  SEVERIDADE_CLASSES[item.severidade] ?? ''
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium truncate">{item.produto_descricao}</span>
                    {item.puxou_data && (
                      <span
                        className="inline-flex items-center gap-0.5 text-[10px] font-medium text-brand-600 dark:text-brand-400 shrink-0"
                        title="Venda mais recente do grupo — definiu a data do Princípio Ativo"
                      >
                        <Sparkles className="w-3 h-3" />
                        Data do grupo
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                    <span>
                      {item.loja_codigo} — {item.loja_nome}
                    </span>
                    <CurveBadge curva={item.curva_qtd} />
                    <span>Últ. venda: {formatIsoDate(item.ultima_venda)}</span>
                  </div>
                </div>
                <div className="text-right shrink-0 text-xs">
                  <div className="font-medium">{formatEstoqueDias(item.est_dias)}</div>
                  <div className="tabular-nums text-gray-500">{formatMediaMensal(item.media_mensal)} méd/mês</div>
                  <div className="tabular-nums font-medium">
                    {formatBRL(pickValor(item.valor_custo, item.valor_venda, modo))}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </Modal>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="card px-3 py-2">
      <div className="text-[11px] text-gray-500 dark:text-gray-400">{label}</div>
      <div className="text-sm font-semibold tabular-nums mt-0.5">{value}</div>
    </div>
  );
}
