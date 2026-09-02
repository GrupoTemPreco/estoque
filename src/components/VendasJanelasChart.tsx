import { useState } from 'react';
import type { VendasJanelas } from '@/types';
import { formatNumber } from '@/utils';

const ABSOLUTO: { key: keyof VendasJanelas; label: string }[] = [
  { key: 'd180', label: '180d' },
  { key: 'd120', label: '120d' },
  { key: 'd90', label: '90d' },
  { key: 'd60', label: '60d' },
  { key: 'd30', label: '30d' },
  { key: 'd15', label: '15d' },
  { key: 'd7', label: '7d' },
];

/** Passado distante → recente. Média diária (janelas cumulativas). */
const TENDENCIA: { key: keyof VendasJanelas; dias: number; label: string }[] = [
  { key: 'd180', dias: 180, label: '180d' },
  { key: 'd120', dias: 120, label: '120d' },
  { key: 'd90', dias: 90, label: '90d' },
  { key: 'd60', dias: 60, label: '60d' },
  { key: 'd30', dias: 30, label: '30d' },
  { key: 'd15', dias: 15, label: '15d' },
  { key: 'd7', dias: 7, label: '7d' },
];

export default function VendasJanelasChart({ janelas }: { janelas: VendasJanelas }) {
  const [tendencia, setTendencia] = useState(false);

  return (
    <button
      type="button"
      onClick={() => setTendencia((v) => !v)}
      className="w-full text-left rounded-control hover:bg-gray-50 dark:hover:bg-gray-800/40 p-1 -m-1 transition-colors"
    >
      {tendencia ? <LinhaTendencia janelas={janelas} /> : <BarrasAbsolutas janelas={janelas} />}
      <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-2">
        {tendencia
          ? 'Eixo Y: média de unidades vendidas por dia em cada janela. Clique para ver totais.'
          : 'Valores absolutos por janela (cumulativos). Clique para ver a tendência.'}
      </p>
    </button>
  );
}

function BarrasAbsolutas({ janelas }: { janelas: VendasJanelas }) {
  const max = Math.max(1, ...ABSOLUTO.map((s) => janelas[s.key] ?? 0));

  return (
    <div className="flex items-end gap-2 h-28">
      {ABSOLUTO.map((s) => {
        const value = janelas[s.key] ?? 0;
        const pct = (value / max) * 100;
        return (
          <div key={s.key} className="flex-1 min-w-0 flex flex-col items-center gap-1 h-full">
            <span className="text-[10px] tabular-nums text-gray-500 dark:text-gray-400">{value}</span>
            <div className="flex-1 w-full flex items-end rounded-control bg-gray-100 dark:bg-gray-800 overflow-hidden">
              <div
                className="w-full bg-brand-500/80 dark:bg-brand-400/80 rounded-control"
                style={{ height: `${pct}%` }}
              />
            </div>
            <span className="text-[10px] text-gray-500 dark:text-gray-400">{s.label}</span>
          </div>
        );
      })}
    </div>
  );
}

function LinhaTendencia({ janelas }: { janelas: VendasJanelas }) {
  const avgs = TENDENCIA.map((s) => (janelas[s.key] ?? 0) / s.dias);
  const max = Math.max(1e-9, ...avgs);
  const n = avgs.length;
  const padX = 2;
  const padT = 22;
  const padB = 6;
  const plotH = 100 - padT - padB;

  const pts = avgs.map((v, i) => {
    const x = n === 1 ? 50 : padX + (i / (n - 1)) * (100 - 2 * padX);
    const y = padT + plotH - (v / max) * plotH;
    return { x, y, v, label: TENDENCIA[i].label };
  });
  const d = pts.map((p) => `${p.x},${p.y}`).join(' ');

  return (
    <div className="w-full h-28 flex flex-col" role="img" aria-label="Tendência de média diária">
      <div className="relative flex-1 min-h-0">
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full overflow-visible"
        >
          <polyline
            className="fill-none stroke-brand-500 dark:stroke-brand-400"
            strokeWidth="3.5"
            strokeLinejoin="round"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            points={d}
          />
        </svg>
        {pts.map((p) => (
          <div
            key={p.label}
            className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
          >
            <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 text-[11px] tabular-nums whitespace-nowrap text-gray-500 dark:text-gray-400">
              {formatNumber(p.v)}
            </span>
            <span className="block w-2.5 h-2.5 rounded-full bg-brand-600 dark:bg-brand-400" />
          </div>
        ))}
      </div>
      <div className="flex justify-between pt-1">
        {pts.map((p) => (
          <span key={p.label} className="text-[11px] text-gray-500 dark:text-gray-400">
            {p.label}
          </span>
        ))}
      </div>
    </div>
  );
}
