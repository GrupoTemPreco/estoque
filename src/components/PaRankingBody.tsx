import type { RankingPaItem, ValorModo } from '@/types';
import { formatBRL, formatInt, pickValor, splitPaItens } from '@/utils';
import Accordion from './Accordion';
import CurveBadge from './CurveBadge';

export function PaRankingRow({
  item,
  modo,
  onClick,
}: {
  item: RankingPaItem;
  modo: ValorModo;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-3 text-sm text-left w-full hover:bg-gray-50 dark:hover:bg-gray-800/40 rounded-control px-1 py-1.5 -mx-1"
    >
      <div className="flex-1 min-w-0">
        <div className="font-medium truncate">{item.principio_ativo}</div>
        <div className="text-[11px] text-gray-500 flex items-center gap-2 mt-0.5">
          <span>
            {item.produtos} prod. · {item.lojas} lojas
          </span>
          <CurveBadge curva={item.curva_qtd} />
        </div>
      </div>
      <div className="text-right shrink-0">
        <div className="text-sm font-semibold text-red-600 dark:text-red-400 tabular-nums">
          {item.dias_sem_venda == null ? 'sem venda' : `${item.dias_sem_venda}d`}
        </div>
        <div className="text-[11px] tabular-nums text-gray-500">
          {formatBRL(pickValor(item.valor_custo, item.valor_venda, modo))}
        </div>
      </div>
    </button>
  );
}

export function PaRankingBody({
  items,
  modo,
  limit,
  onSelect,
}: {
  items: RankingPaItem[];
  modo: ValorModo;
  limit?: number;
  onSelect: (principioAtivo: string) => void;
}) {
  const { nunca, resto } = splitPaItens(items);
  const shown = limit != null ? resto.slice(0, limit) : resto;
  const nuncaValor = nunca.reduce((s, i) => s + pickValor(i.valor_custo, i.valor_venda, modo), 0);

  return (
    <div className="flex flex-col">
      {nunca.length > 0 && (
        <Accordion
          embedded
          title="Nunca venderam"
          badge={`${formatInt(nunca.length)} grupos · ${formatBRL(nuncaValor)}`}
        >
          <div className="flex flex-col gap-1">
            {nunca.map((item) => (
              <PaRankingRow
                key={item.principio_ativo}
                item={item}
                modo={modo}
                onClick={() => onSelect(item.principio_ativo)}
              />
            ))}
          </div>
        </Accordion>
      )}
      <div className="flex flex-col gap-1.5 px-4 py-3">
        {shown.map((item) => (
          <PaRankingRow
            key={item.principio_ativo}
            item={item}
            modo={modo}
            onClick={() => onSelect(item.principio_ativo)}
          />
        ))}
        {shown.length === 0 && nunca.length === 0 && (
          <p className="text-sm text-gray-400 py-4 text-center">Nenhum grupo encontrado.</p>
        )}
      </div>
    </div>
  );
}
