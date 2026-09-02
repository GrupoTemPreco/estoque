import { useMemo, useState } from 'react';
import type { ListaModo, TabelaItem } from '@/types';
import { useDashboard } from '@/context/DashboardContext';
import { useModalStack } from '@/context/ModalStack';
import { useBuscarProdutos } from '@/hooks/useBuscarProdutos';
import { useRankingPrincipioAtivo } from '@/hooks/useRankingPrincipioAtivo';
import { formatBRL, formatInt, formatPercentParado, pickValor } from '@/utils';
import FiltersBar from '@/components/Filters';
import VmdConfig from '@/components/VmdConfig';
import KpiCard from '@/components/KpiCard';
import RankingBar from '@/components/RankingBar';
import ClassificacaoCurvaRow from '@/components/ClassificacaoCurvaRow';
import Histogram from '@/components/Histogram';
import DataTable from '@/components/DataTable';
import Accordion from '@/components/Accordion';
import NoSaleTable from '@/components/NoSaleTable';
import ListaModoToggle, { DashboardSkeleton } from '@/components/ListaModoToggle';
import { PaRankingBody } from '@/components/PaRankingBody';

export default function DashboardEstoque() {
  const { data, loading, error, refetch, filters, setFilters, janela, setJanela, modo, setModo, rpcParams } =
    useDashboard();
  const { push } = useModalStack();
  const [query, setQuery] = useState('');
  const [listaModo, setListaModo] = useState<ListaModo>('produto');

  const search = useBuscarProdutos(query, rpcParams);
  const rankingPa = useRankingPrincipioAtivo({ params: rpcParams, enabled: listaModo === 'principio-ativo' });

  const rankingMax = data
    ? Math.max(0, ...data.por_loja.map((r) => pickValor(r.valor_custo, r.valor_venda, modo)))
    : 0;
  const topSemVenda = data?.top_sem_venda ?? [];
  const limiteDias = data?.parametros.limite_dias ?? 150;
  const histogram = useMemo(
    () =>
      (data?.tempo_sem_venda ?? [])
        .slice()
        .sort((a, b) => a.ordem - b.ordem)
        .map((b) => ({ label: b.faixa, count: b.itens })),
    [data]
  );

  const openProduct = (produtoid: number | string, loja: string | null) => {
    push({ kind: 'product', produtoid, lojaDestaque: loja });
  };

  return (
    <div className="flex flex-col gap-4">
      <FiltersBar filters={filters} onChange={setFilters} modo={modo} onModoChange={setModo} />
      <VmdConfig janela={janela} onChange={setJanela} />

      {error && (
        <div className="card px-4 py-3 flex flex-wrap items-center justify-between gap-3 border-red-200 dark:border-red-900/50">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          <button
            type="button"
            onClick={refetch}
            className="px-3 py-1.5 text-xs rounded-control hairline hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            Tentar novamente
          </button>
        </div>
      )}

      {!data && loading && <DashboardSkeleton />}

      {data && (
        <div className={loading ? 'opacity-60 pointer-events-none transition-opacity' : 'transition-opacity'}>
          <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-4 items-start">
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <KpiCard
                  label="Itens em alerta"
                  value={formatInt(data.resumo.itens_acima_limite)}
                  sub={`estoque_dias > ${limiteDias}`}
                  icon="alert"
                  accent="warning"
                  className="px-4 py-3.5 gap-1.5"
                />
                <KpiCard
                  label="% do estoque parado"
                  value={formatPercentParado(
                    pickValor(data.resumo.valor_parado_custo, data.resumo.valor_parado_venda, modo),
                    pickValor(data.estoque_total.valor_custo, data.estoque_total.valor_venda, modo)
                  )}
                  sub={formatBRL(
                    pickValor(data.resumo.valor_parado_custo, data.resumo.valor_parado_venda, modo)
                  )}
                  icon="percent"
                  accent="danger"
                  className="px-4 py-3.5 gap-1.5"
                />
                <KpiCard
                  label="Valor parado"
                  value={formatBRL(
                    pickValor(data.resumo.valor_parado_custo, data.resumo.valor_parado_venda, modo)
                  )}
                  sub={`${formatInt(data.resumo.itens_parados)} itens`}
                  icon="dias"
                  className="px-4 py-3.5 gap-1.5"
                />
              </div>

              <div className="card p-4">
                <h3 className="text-sm font-semibold mb-1">Itens em alerta por loja</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                  Ranking de lojas com mais itens parados
                </p>
                <div className="flex flex-col gap-2">
                  {data.por_loja.length > 0 ? (
                    data.por_loja.map((r) => {
                      const valor = pickValor(r.valor_custo, r.valor_venda, modo);
                      return (
                        <RankingBar
                          key={r.loja_codigo}
                          label={`${r.loja_codigo} - ${r.loja_nome}`}
                          value={valor}
                          max={rankingMax}
                          display={`${r.itens} · ${formatBRL(valor)}`}
                          level={valor === rankingMax ? 'danger' : 'warning'}
                          onClick={() => push({ kind: 'store', loja: r.loja_codigo })}
                        />
                      );
                    })
                  ) : (
                    <p className="text-sm text-gray-400 py-4 text-center">Nenhuma loja com itens em alerta.</p>
                  )}
                </div>
              </div>

              <ClassificacaoCurvaRow
                porClassificacao={data.por_classificacao}
                porCurva={data.por_curva}
                modo={modo}
              />
            </div>

            <div className="rounded-card border border-brand-200/60 dark:border-brand-800/40 bg-brand-50/40 dark:bg-brand-950/20 p-3 flex flex-col gap-3">
              <div className="flex items-center gap-2 px-1">
                <span className="w-1 h-4 rounded-full bg-brand-500" />
                <h2 className="text-xs font-semibold tracking-wide uppercase text-brand-600 dark:text-brand-400">
                  Análise de itens sem venda
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <KpiCard
                  label="Nunca venderam"
                  value={formatInt(data.sem_venda_kpis.itens_nunca)}
                  sub={formatBRL(data.sem_venda_kpis.valor_nunca)}
                  icon="nunca"
                />
                <KpiCard
                  label="Sem venda +180d"
                  value={formatInt(data.sem_venda_kpis.itens_mais_180d)}
                  icon="semVenda180"
                  accent="warning"
                />
                <KpiCard
                  label="Sem venda há mais tempo"
                  value={formatInt(data.sem_venda_kpis.max_dias) + 'd'}
                  sub={topSemVenda[0]?.produto_descricao ?? 'Ver ranking'}
                  icon="semVendaMax"
                  accent="danger"
                  onClick={() => push({ kind: 'top5' })}
                />
              </div>

              <ListaModoToggle modo={listaModo} onChange={setListaModo} />

              {listaModo === 'produto' ? (
                <div className="card p-4">
                  <div className="flex items-center justify-between mb-2.5">
                    <h3 className="text-sm font-semibold">Top 5 — há mais tempo sem venda</h3>
                    <button
                      type="button"
                      onClick={() => push({ kind: 'top5' })}
                      className="text-xs text-brand-600 dark:text-brand-400 hover:underline"
                    >
                      Ver ranking →
                    </button>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    {topSemVenda.slice(0, 5).map((item, idx) => (
                      <button
                        key={`${item.loja_codigo}-${item.produtoid}`}
                        type="button"
                        onClick={() => openProduct(item.produtoid, item.loja_codigo)}
                        className="flex items-center gap-3 text-sm text-left hover:bg-gray-50 dark:hover:bg-gray-800/40 rounded-control px-1 py-0.5 -mx-1"
                      >
                        <span className="w-5 h-5 shrink-0 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 flex items-center justify-center text-xs font-medium">
                          {idx + 1}
                        </span>
                        <span className="flex-1 truncate">{item.produto_descricao}</span>
                        <span className="text-xs text-gray-400 truncate hidden sm:block">{item.loja_nome}</span>
                        <span className="text-sm font-semibold text-red-600 dark:text-red-400 tabular-nums shrink-0">
                          {item.dias_sem_venda}d
                        </span>
                      </button>
                    ))}
                    {topSemVenda.length === 0 && (
                      <p className="text-sm text-gray-400 py-4 text-center">Nenhum item encontrado.</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="card overflow-hidden">
                  <div className="flex items-center justify-between px-4 pt-4 pb-2.5">
                    <h3 className="text-sm font-semibold">Top 5 — Princípio Ativo</h3>
                    <button
                      type="button"
                      onClick={() =>
                        rankingPa.data && push({ kind: 'pa-ranking', snapshot: rankingPa.data })
                      }
                      className="text-xs text-brand-600 dark:text-brand-400 hover:underline disabled:opacity-40"
                      disabled={!rankingPa.data}
                    >
                      Ver ranking →
                    </button>
                  </div>
                  {rankingPa.loading && !rankingPa.data && (
                    <p className="text-xs text-gray-400 py-4 text-center">Carregando…</p>
                  )}
                  {rankingPa.error && !rankingPa.data && (
                    <p className="text-xs text-red-500 px-4 py-4">{rankingPa.error}</p>
                  )}
                  {rankingPa.data && (
                    <PaRankingBody
                      items={rankingPa.data.itens}
                      modo={modo}
                      limit={5}
                      onSelect={(principioAtivo) => push({ kind: 'pa', principioAtivo })}
                    />
                  )}
                </div>
              )}

              <div className="card p-4">
                <h3 className="text-sm font-semibold mb-1">Faixas de dias sem venda</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Apenas itens com estoque positivo</p>
                <Histogram buckets={histogram} />
              </div>
            </div>
          </div>

          <div className="mt-4">
            <DataTable
              items={
                (search.active && search.data ? search.data.itens : data.tabela) as TabelaItem[]
              }
              total={data.totais.itens_na_tabela}
              modo={modo}
              limiteDias={limiteDias}
              query={query}
              onQueryChange={setQuery}
              searchActive={search.active}
              encontrados={search.data?.totais.encontrados}
              exibidos={search.data?.totais.exibidos}
              searchLoading={search.loading}
              searchError={search.error}
              onProductClick={openProduct}
              headerExtra={
                <Accordion
                  embedded
                  title="Sem vendas no período"
                  badge={`${formatInt(data.totais.itens_sem_vendas)} itens · ${formatBRL(
                    pickValor(data.resumo.valor_sem_venda_custo, data.resumo.valor_sem_venda_venda, modo)
                  )}`}
                >
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    Itens sem nenhuma venda no período — ordenados por maior valor parado
                  </p>
                  <NoSaleTable items={data.sem_vendas} modo={modo} onProductClick={openProduct} />
                </Accordion>
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}
