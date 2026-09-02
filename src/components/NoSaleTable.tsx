import { useEffect, useState } from 'react';
import type { SemVendaItem, ValorModo } from '@/types';
import { formatBRL, formatIsoDate, pickValor, rowKey } from '@/utils';
import { ChevronDown } from 'lucide-react';
import CurveBadge from './CurveBadge';

interface NoSaleTableProps {
  items: SemVendaItem[];
  modo: ValorModo;
  pageSize?: number;
  onProductClick: (produtoid: number | string, loja: string) => void;
}

export default function NoSaleTable({ items, modo, pageSize = 10, onProductClick }: NoSaleTableProps) {
  const [visible, setVisible] = useState(pageSize);

  useEffect(() => {
    setVisible(pageSize);
  }, [items, pageSize]);

  const shown = items.slice(0, visible);

  return (
    <div className="mt-4">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800">
              <th className="font-medium px-2 py-2.5">Produto</th>
              <th className="font-medium px-2 py-2.5">Loja</th>
              <th className="font-medium px-2 py-2.5">Classe</th>
              <th className="font-medium px-2 py-2.5">Curva</th>
              <th className="font-medium px-2 py-2.5 text-right">Últ. compra</th>
              <th className="font-medium px-2 py-2.5 text-right">Parado</th>
            </tr>
          </thead>
          <tbody>
            {shown.map((item) => (
              <tr
                key={rowKey(item.loja_codigo, item.produtoid)}
                onClick={() => onProductClick(item.produtoid, item.loja_codigo)}
                className="border-b border-gray-100 dark:border-gray-800/60 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors cursor-pointer"
              >
                <td className="px-2 py-2.5">
                  <div className="font-medium text-gray-800 dark:text-gray-100">{item.produto_descricao}</div>
                  <div className="text-[11px] text-gray-400 dark:text-gray-500 tabular-nums">
                    {item.produto_codigo}
                  </div>
                </td>
                <td className="px-2 py-2.5 text-gray-500 dark:text-gray-400 tabular-nums">{item.loja_codigo}</td>
                <td className="px-2 py-2.5 text-gray-600 dark:text-gray-300">{item.classe_principal}</td>
                <td className="px-2 py-2.5">
                  <CurveBadge curva={item.curva_qtd} />
                </td>
                <td className="px-2 py-2.5 text-right tabular-nums text-gray-500 dark:text-gray-400">
                  {formatIsoDate(item.ultima_compra)}
                </td>
                <td className="px-2 py-2.5 text-right tabular-nums font-medium text-gray-700 dark:text-gray-200">
                  {formatBRL(pickValor(item.valor_custo, item.valor_venda, modo))}
                </td>
              </tr>
            ))}
            {shown.length === 0 && (
              <tr>
                <td colSpan={6} className="px-2 py-8 text-center text-sm text-gray-400">
                  Nenhum item sem venda no período.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {visible < items.length && (
        <div className="flex justify-center py-3">
          <button
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
