import type { PorClassificacao, PorCurva, ValorModo } from '@/types';
import { CLASSIFICATIONS, CURVES, DONUT_COLORS } from '@/constants';
import { formatBRL, formatInt, pickValor } from '@/utils';
import DonutChart from '@/components/DonutChart';
import RankingBar from '@/components/RankingBar';

interface ClassificacaoCurvaRowProps {
  porClassificacao: PorClassificacao[];
  porCurva: PorCurva[];
  modo: ValorModo;
}

export default function ClassificacaoCurvaRow({
  porClassificacao,
  porCurva,
  modo,
}: ClassificacaoCurvaRowProps) {
  const donutTotal = porClassificacao.reduce((s, r) => s + r.itens, 0);
  const curvaMax = Math.max(
    0,
    ...porCurva.map((r) => pickValor(r.valor_custo, r.valor_venda, modo))
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 min-w-0">
      <div className="card p-4 min-w-0">
        <h3 className="text-sm font-semibold mb-1">Por classificação</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Itens em alerta por classe</p>
        <DonutChart
          size="lg"
          slices={CLASSIFICATIONS.map((c) => {
            const row = porClassificacao.find((r) => r.classe === c);
            const itens = row?.itens ?? 0;
            const valor = pickValor(row?.valor_custo ?? 0, row?.valor_venda ?? 0, modo);
            return { label: c, value: itens, color: DONUT_COLORS[c], display: formatBRL(valor) };
          })}
          centerLabel="itens"
          centerValue={formatInt(donutTotal)}
        />
      </div>
      <div className="card p-4 min-w-0">
        <h3 className="text-sm font-semibold mb-1">Valor parado por curva ABC</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
          Produtos curva A parados indicam anomalia de compra ou queda de demanda
        </p>
        <div className="flex flex-col gap-2 min-w-0">
          {CURVES.map((curva) => {
            const row = porCurva.find((r) => r.curva === curva);
            const valor = pickValor(row?.valor_custo ?? 0, row?.valor_venda ?? 0, modo);
            const itens = row?.itens ?? 0;
            const label = curva === 'Sem Curva' ? 'S/C' : curva;
            return (
              <RankingBar
                key={curva}
                label={label}
                labelTitle={curva}
                value={valor}
                max={curvaMax}
                display={formatBRL(valor)}
                secondary={`${formatInt(itens)} itens`}
                variant="compact"
                level={curva === 'A' && valor > 0 ? 'danger' : 'normal'}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
