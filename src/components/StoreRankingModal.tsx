import { useEffect } from 'react';
import type { ItensParadosLojaResponse, ModalFrame } from '@/types';
import { useDashboard } from '@/context/DashboardContext';
import { useModalStack } from '@/context/ModalStack';
import { useItensParadosLoja } from '@/hooks/useItensParadosLoja';
import {
  formatBRL,
  formatEstoqueDias,
  formatInt,
  formatIsoDate,
  formatMediaMensal,
  pickValor,
  estoqueDiasLevel,
  estoqueDiasBadgeClasses,
} from '@/utils';
import Modal from './Modal';
import ModalStatus from './ModalStatus';
import CurveBadge from './CurveBadge';

export default function StoreRankingModal({ frame }: { frame: Extract<ModalFrame, { kind: 'store' }> }) {
  const { modo, rpcParams } = useDashboard();
  const { close, back, stack, updateTopSnapshot, push } = useModalStack();
  const { data, loading, error, refetch } = useItensParadosLoja({
    loja: frame.loja,
    janela: rpcParams.janela,
    classe: rpcParams.classe,
    curva: rpcParams.curva,
    enabled: true,
    snapshot: frame.snapshot,
  });

  useEffect(() => {
    if (data && !frame.snapshot) updateTopSnapshot(data);
  }, [data, frame.snapshot, updateTopSnapshot]);

  const payload = data as ItensParadosLojaResponse | null;
  const limiteDias = payload?.parametros.limite_dias ?? 150;

  return (
    <Modal
      open
      onClose={close}
      onBack={stack.length > 1 ? back : undefined}
      title={payload ? `${payload.loja_codigo} — ${payload.loja_nome}` : `Loja ${frame.loja}`}
    >
      <ModalStatus loading={loading && !payload} error={payload ? null : error} onRetry={refetch} />
      {payload && (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
            <Meta label="Itens" value={formatInt(payload.totais.itens)} />
            <Meta
              label="Valor"
              value={formatBRL(pickValor(payload.totais.valor_custo, payload.totais.valor_venda, modo))}
            />
            <Meta label="Sem venda" value={formatInt(payload.totais.itens_sem_venda)} />
          </div>
          <div className="flex flex-col gap-1">
            {payload.itens.map((item) => {
              const level = estoqueDiasLevel(item.est_dias, limiteDias);
              return (
                <button
                  key={String(item.produtoid)}
                  type="button"
                  onClick={() =>
                    push({ kind: 'product', produtoid: item.produtoid, lojaDestaque: payload.loja_codigo })
                  }
                  className="flex items-center gap-3 px-3 py-2.5 rounded-control text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{item.produto_descricao}</div>
                    <div className="flex items-center gap-2 text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                      <span className="tabular-nums">{item.produto_codigo}</span>
                      <CurveBadge curva={item.curva_qtd} />
                      <span>{formatIsoDate(item.ultima_venda)}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${estoqueDiasBadgeClasses[level]}`}
                    >
                      {formatEstoqueDias(item.est_dias)}
                    </span>
                    <div className="text-xs tabular-nums text-gray-500 mt-0.5">
                      {formatMediaMensal(item.media_mensal)} méd/mês
                    </div>
                    <div className="text-xs font-medium tabular-nums">
                      {formatBRL(pickValor(item.valor_custo, item.valor_venda, modo))}
                    </div>
                  </div>
                </button>
              );
            })}
            {payload.itens.length === 0 && (
              <p className="text-sm text-gray-400 py-8 text-center">Nenhum item parado nesta loja.</p>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="card px-3 py-2">
      <div className="text-[11px] text-gray-500 dark:text-gray-400">{label}</div>
      <div className="text-sm font-semibold tabular-nums mt-0.5">{value}</div>
    </div>
  );
}
