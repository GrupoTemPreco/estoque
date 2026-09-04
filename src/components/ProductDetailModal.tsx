import { useEffect, useMemo } from 'react';
import type { ModalFrame, ProdutoEmbalagem } from '@/types';
import { useDashboard } from '@/context/DashboardContext';
import { useModalStack } from '@/context/ModalStack';
import { useDetalheProduto } from '@/hooks/useDetalheProduto';
import {
  formatBRL,
  formatEstoqueDias,
  formatInt,
  formatIsoDate,
  formatMediaMensal,
  pickValor,
  SEVERIDADE_CLASSES,
} from '@/utils';
import Modal from './Modal';
import ModalStatus from './ModalStatus';
import VendasJanelasChart from './VendasJanelasChart';
import CurveBadge from './CurveBadge';
import Accordion from './Accordion';

export default function ProductDetailModal({
  frame,
}: {
  frame: Extract<ModalFrame, { kind: 'product' }>;
}) {
  const { modo, rpcParams } = useDashboard();
  const { close, back, stack, updateTopSnapshot } = useModalStack();
  const { data, loading, error, refetch } = useDetalheProduto({
    produtoid: frame.produtoid,
    lojaDestaque: frame.lojaDestaque,
    janela: rpcParams.janela,
    enabled: true,
    snapshot: frame.snapshot,
  });

  useEffect(() => {
    if (data && !frame.snapshot) updateTopSnapshot(data);
  }, [data, frame.snapshot, updateTopSnapshot]);

  const lojas = useMemo(
    () => [...(data?.por_loja ?? [])].sort((a, b) => Number(b.destaque) - Number(a.destaque)),
    [data]
  );
  const embalagensPorLoja = useMemo(() => groupEmbalagens(data?.embalagens ?? []), [data]);

  return (
    <Modal
      open
      size="lg"
      onClose={close}
      onBack={stack.length > 1 ? back : undefined}
      title={data?.geral.produto_descricao ?? 'Produto'}
    >
      <ModalStatus loading={loading && !data} error={data ? null : error} onRetry={refetch} />
      {data && (
        <div className="flex flex-col gap-5">
          <section className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-2 text-xs">
            <Field label="Código" value={data.geral.produto_codigo} />
            <Field label="Cód. barras" value={data.geral.codigo_barras ?? '—'} />
            <Field label="Fabricante" value={data.geral.fabricante ?? '—'} />
            <Field label="Princípio Ativo" value={data.geral.principio_ativo ?? '—'} />
            <Field label="Fornecedor" value={data.geral.fornecedor ?? '—'} />
            <Field label="Classe" value={data.geral.classe_principal} />
            <Field label="Classificação" value={data.geral.classificacao ?? '—'} />
            <div>
              <div className="text-[11px] text-gray-500 dark:text-gray-400">Curva (melhor rede)</div>
              <CurveBadge curva={data.geral.curva_qtd} />
            </div>
            <Field label="Preço unitário" value={formatBRL(data.geral.preco_venda)} />
            <Field label="Custo médio" value={formatBRL(data.geral.custo_medio)} />
          </section>

          <section>
            <h3 className="text-sm font-semibold mb-2">Resumo da rede</h3>
            <div className="flex flex-col gap-2">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <Stat label="Estoque total" value={formatInt(data.geral.estoque_total)} />
                <Stat
                  label="Valor parado"
                  value={formatBRL(
                    pickValor(data.geral.valor_custo_total, data.geral.valor_venda_total, modo)
                  )}
                />
                <Stat label="Méd/mês" value={formatMediaMensal(data.geral.media_mensal_rede)} />
                <Stat label="Est. dias" value={formatEstoqueDias(data.geral.est_dias_rede)} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <Stat label="Últ. venda" value={formatIsoDate(data.geral.ultima_venda_rede)} />
                <Stat label="Últ. compra" value={formatIsoDate(data.geral.ultima_compra_rede)} />
                <Stat label="Lojas com estoque" value={formatInt(data.geral.lojas_com_estoque)} />
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-sm font-semibold mb-2">Vendas por janela</h3>
            <VendasJanelasChart janelas={data.vendas_janelas} />
          </section>

          <section>
            <h3 className="text-sm font-semibold mb-2">Por loja</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {lojas.map((loja) => (
                <div
                  key={loja.loja_codigo}
                  className={`rounded-card border p-3 ${SEVERIDADE_CLASSES[loja.severidade] ?? SEVERIDADE_CLASSES.ok} ${
                    loja.destaque ? 'ring-2 ring-brand-500' : ''
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-sm font-semibold truncate">
                      {loja.loja_codigo} — {loja.loja_nome}
                    </span>
                    <CurveBadge curva={loja.curva_qtd} />
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 text-xs">
                    <span>Estoque: {formatInt(loja.estoque_atual)}</span>
                    <span>Méd/mês: {formatMediaMensal(loja.media_mensal)}</span>
                    <span>Est. dias: {formatEstoqueDias(loja.est_dias)}</span>
                    <span>Parado: {formatBRL(pickValor(loja.valor_custo, loja.valor_venda, modo))}</span>
                    <span>Últ. venda: {formatIsoDate(loja.ultima_venda)}</span>
                    <span>Últ. compra: {formatIsoDate(loja.ultima_compra)}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="card overflow-hidden">
            <Accordion embedded title={`Embalagens (${data.embalagens.length})`}>
              <div className="flex flex-col gap-3">
                {embalagensPorLoja.map(([loja, rows]) => (
                  <div key={loja}>
                    <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                      {rows[0].loja_codigo} — {rows[0].loja_nome}
                    </h4>
                    <div className="flex flex-col gap-1.5">
                      {rows.map((e) => (
                        <div
                          key={String(e.embalagemid)}
                          className="card px-3 py-2 text-xs flex flex-wrap gap-x-4 gap-y-1"
                        >
                          <span className="font-medium">{e.etiqueta ?? 'Embalagem'}</span>
                          <span className="tabular-nums text-gray-500">{e.codigo_barras ?? '—'}</span>
                          <span>{formatInt(e.quantidadeporembalagem)} un/emb</span>
                          <span>{formatBRL(e.preco_venda)}</span>
                          <span className="ml-auto tabular-nums font-medium">
                            {formatInt(e.estoque_em_unidades)} un
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                {embalagensPorLoja.length === 0 && (
                  <p className="text-sm text-gray-400">Nenhuma embalagem encontrada.</p>
                )}
              </div>
            </Accordion>
          </div>
        </div>
      )}
    </Modal>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[11px] text-gray-500 dark:text-gray-400">{label}</div>
      <div className="text-xs font-medium break-words">{value}</div>
    </div>
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

function groupEmbalagens(rows: ProdutoEmbalagem[]) {
  const map = new Map<string, ProdutoEmbalagem[]>();
  for (const row of rows) {
    const list = map.get(row.loja_codigo) ?? [];
    list.push(row);
    map.set(row.loja_codigo, list);
  }
  return Array.from(map.entries());
}
