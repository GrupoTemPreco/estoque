import { useEffect, useState, type ReactNode } from 'react';
import type { TabelaItem, ValorModo } from '@/types';
import {
  formatBRL,
  formatEstoqueDias,
  formatMediaMensal,
  formatIsoDate,
  formatInt,
  estoqueDiasLevel,
  estoqueDiasBadgeClasses,
  pickValor,
  rowKey,
} from '@/utils';
import { Search, ChevronDown } from 'lucide-react';
import CurveBadge from './CurveBadge';

interface DataTableProps {
  items: TabelaItem[];
  total: number;
  modo: ValorModo;
  limiteDias: number;
  query: string;
  onQueryChange: (q: string) => void;
  searchActive?: boolean;
  encontrados?: number;
  exibidos?: number;
  searchLoading?: boolean;
  searchError?: string | null;
  onProductClick: (produtoid: number | string, loja: string) => void;
  pageSize?: number;
  headerExtra?: ReactNode;
}

export default function DataTable({
  items,
  total,
  modo,
  limiteDias,
  query,
  onQueryChange,
  searchActive = false,
  encontrados,
  exibidos,
  searchLoading = false,
  searchError = null,
  onProductClick,
  pageSize = 15,
  headerExtra,
}: DataTableProps) {
  const [visible, setVisible] = useState(pageSize);

  useEffect(() => {
    setVisible(pageSize);
  }, [items, pageSize]);

  const shown = items.slice(0, visible);
  const subtitle = searchActive
    ? `Mostrando ${formatInt(exibidos ?? items.length)} de ${formatInt(encontrados ?? items.length)} encontrados`
    : `Mostrando ${formatInt(items.length)} de ${formatInt(total)} itens`;

  return (
    <div className="card overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-gray-200 dark:border-gray-800">
        <div>
          <h3 className="text-sm font-semibold">
            {searchActive ? 'Resultados da busca' : 'Itens ranqueados por estoque_dias'}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{subtitle}</p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Buscar produto (mín. 3 letras)..."
            className="control w-full pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400/40"
          />
        </div>
      </div>

      {searchError && (
        <p className="px-5 py-2 text-xs text-red-500 border-b border-gray-200 dark:border-gray-800">{searchError}</p>
      )}
      {searchLoading && (
        <p className="px-5 py-2 text-xs text-gray-400 border-b border-gray-200 dark:border-gray-800">Buscando…</p>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800">
              <th className="font-medium px-5 py-2.5">Produto</th>
              <th className="font-medium px-3 py-2.5">Loja</th>
              <th className="font-medium px-3 py-2.5">Classe</th>
              <th className="font-medium px-3 py-2.5">Curva</th>
              <th className="font-medium px-3 py-2.5 text-right">Est. dias</th>
              <th className="font-medium px-3 py-2.5 text-right">Méd/mês</th>
              <th className="font-medium px-3 py-2.5 text-right">Últ. venda</th>
              <th className="font-medium px-3 py-2.5 text-right">Últ. compra</th>
              <th className="font-medium px-5 py-2.5 text-right">Parado</th>
            </tr>
          </thead>
          {!searchActive && headerExtra && (
            <tbody>
              <tr>
                <td colSpan={9} className="p-0">
                  {headerExtra}
                </td>
              </tr>
            </tbody>
          )}
          <tbody>
            {shown.map((item) => {
              const level = estoqueDiasLevel(item.est_dias, limiteDias);
              return (
                <tr
                  key={rowKey(item.loja_codigo, item.produtoid)}
                  onClick={() => onProductClick(item.produtoid, item.loja_codigo)}
                  className="border-b border-gray-100 dark:border-gray-800/60 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors cursor-pointer"
                >
                  <td className="px-5 py-2.5">
                    <div className="font-medium text-gray-800 dark:text-gray-100">{item.produto_descricao}</div>
                    <div className="text-[11px] text-gray-400 dark:text-gray-500 tabular-nums">
                      {item.produto_codigo}
                    </div>
                  </td>
                  <td className="px-3 py-2.5 text-gray-500 dark:text-gray-400 tabular-nums">{item.loja_codigo}</td>
                  <td className="px-3 py-2.5 text-gray-600 dark:text-gray-300">{item.classe_principal}</td>
                  <td className="px-3 py-2.5">
                    <CurveBadge curva={item.curva_qtd} />
                  </td>
                  <td className="px-3 py-2.5 text-right">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${estoqueDiasBadgeClasses[level]}`}
                    >
                      {formatEstoqueDias(item.est_dias)}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-right tabular-nums text-gray-600 dark:text-gray-300">
                    {formatMediaMensal(item.media_mensal)}
                  </td>
                  <td className="px-3 py-2.5 text-right tabular-nums text-gray-500 dark:text-gray-400">
                    {formatIsoDate(item.ultima_venda)}
                  </td>
                  <td className="px-3 py-2.5 text-right tabular-nums text-gray-500 dark:text-gray-400">
                    {formatIsoDate(item.ultima_compra)}
                  </td>
                  <td className="px-5 py-2.5 text-right tabular-nums font-medium text-gray-700 dark:text-gray-200">
                    {formatBRL(pickValor(item.valor_custo, item.valor_venda, modo))}
                  </td>
                </tr>
              );
            })}
            {shown.length === 0 && (
              <tr>
                <td colSpan={9} className="px-5 py-10 text-center text-sm text-gray-400">
                  {searchActive ? 'Nenhum produto encontrado.' : 'Nenhum item encontrado.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {visible < items.length && (
        <div className="flex justify-center py-3 border-t border-gray-200 dark:border-gray-800">
          <button
            type="button"
            onClick={() => setVisible((v) => v + pageSize)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm rounded-control hairline hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
          >
            Carregar mais
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
