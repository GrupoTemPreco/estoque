interface DonutSlice {
  label: string;
  value: number;
  color: string;
  display?: string;
}

interface DonutChartProps {
  slices: DonutSlice[];
  centerLabel: string;
  centerValue: string;
  size?: 'sm' | 'lg';
}

export default function DonutChart({ slices, centerLabel, centerValue, size = 'sm' }: DonutChartProps) {
  const total = slices.reduce((s, x) => s + x.value, 0);
  let acc = 0;
  const stops = slices
    .filter((s) => s.value > 0)
    .map((s) => {
      const start = (acc / total) * 360;
      acc += s.value;
      const end = (acc / total) * 360;
      return { ...s, start, end };
    });

  const gradient =
    stops.length > 0
      ? stops
          .map((s) => `${s.color} ${s.start}deg ${s.end}deg`)
          .join(', ')
      : `${'rgb(229 231 235)'} 0deg 360deg`;

  const ring = size === 'lg' ? 'w-36 h-36' : 'w-16 h-16';
  const hole = size === 'lg' ? 'inset-6' : 'inset-2.5';
  const valueCls = size === 'lg' ? 'text-xl' : 'text-sm';
  const labelCls = size === 'lg' ? 'text-[11px] mt-1' : 'text-[9px] mt-0.5';

  return (
    <div className={`flex items-center min-w-0 w-full overflow-hidden ${size === 'lg' ? 'gap-3' : 'gap-2'}`}>
      <div className={`${ring} rounded-full shrink-0 relative`} style={{ background: `conic-gradient(${gradient})` }}>
        <div
          className={`absolute ${hole} rounded-full bg-white dark:bg-gray-900 flex flex-col items-center justify-center`}
        >
          <span className={`${valueCls} font-semibold leading-none tabular-nums`}>{centerValue}</span>
          <span className={`${labelCls} text-gray-500 dark:text-gray-400 text-center leading-tight`}>
            {centerLabel}
          </span>
        </div>
      </div>
      <ul className={`flex flex-col flex-1 min-w-0 ${size === 'lg' ? 'gap-2' : 'gap-0.5'}`}>
        {slices.map((s) => (
          <li
            key={s.label}
            className="flex items-start gap-1.5 min-w-0"
            title={`${s.label}: ${s.display ?? s.value}`}
          >
            <span className="w-2 h-2 rounded-full shrink-0 mt-1" style={{ background: s.color }} />
            <div className="min-w-0 flex-1">
              <div className="text-xs text-gray-600 dark:text-gray-300 truncate">{s.label}</div>
              <div className="text-xs font-medium tabular-nums text-gray-800 dark:text-gray-100 truncate">
                {s.display ?? s.value}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
