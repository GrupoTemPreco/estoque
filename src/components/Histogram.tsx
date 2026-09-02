interface HistogramProps {
  buckets: { label: string; count: number }[];
}

export default function Histogram({ buckets }: HistogramProps) {
  const max = Math.max(1, ...buckets.map((b) => b.count));

  return (
    <div className="flex flex-col gap-2">
      {buckets.map((b) => {
        const pct = (b.count / max) * 100;
        return (
          <div key={b.label} className="flex items-center gap-3">
            <span className="text-xs text-gray-500 dark:text-gray-400 w-20 shrink-0 text-right">
              {b.label}
            </span>
            <div className="flex-1 h-7 rounded-control bg-gray-100 dark:bg-gray-800 overflow-hidden relative">
              <div
                className="h-full bg-brand-500/80 dark:bg-brand-400/80 rounded-control transition-all duration-500 ease-out"
                style={{ width: `${pct}%` }}
              />
              <span className="absolute inset-0 flex items-center justify-end pr-2.5 text-xs font-medium text-gray-700 dark:text-gray-200">
                {b.count}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}


