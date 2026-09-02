interface RankingBarProps {
  label: string;
  value: number;
  max: number;
  display: string;
  /** Texto do tooltip do rótulo (quando o label é abreviado). */
  labelTitle?: string;
  /** Segunda linha à direita (ex.: contagem de itens). */
  secondary?: string;
  variant?: 'default' | 'compact';
  level?: 'normal' | 'warning' | 'danger';
  onClick?: () => void;
}

const LEVEL_BAR = {
  normal: 'bg-brand-500',
  warning: 'bg-amber-500',
  danger: 'bg-red-500',
} as const;

export default function RankingBar({
  label,
  value,
  max,
  display,
  labelTitle,
  secondary,
  variant = 'default',
  level = 'normal',
  onClick,
}: RankingBarProps) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  const compact = variant === 'compact';

  const inner = (
    <>
      <span
        className={`text-xs text-gray-600 dark:text-gray-300 shrink-0 truncate ${
          compact ? 'w-8 text-center' : 'w-28 sm:w-32'
        }`}
        title={labelTitle ?? label}
      >
        {label}
      </span>
      <div className="flex-1 min-w-0 h-6 rounded-control bg-gray-100 dark:bg-gray-800 overflow-hidden">
        <div
          className={`h-full min-w-0 ${LEVEL_BAR[level]} rounded-control transition-all duration-500 ease-out`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {compact ? (
        <div className="w-[6.75rem] shrink-0 text-right min-w-0">
          <div className="text-[11px] font-medium tabular-nums text-gray-700 dark:text-gray-200 truncate">
            {display}
          </div>
          {secondary && (
            <div className="text-[10px] text-gray-500 dark:text-gray-400 tabular-nums leading-tight">
              {secondary}
            </div>
          )}
        </div>
      ) : (
        <span className="w-[11.5rem] shrink-0 text-right text-xs font-medium tabular-nums whitespace-nowrap text-gray-700 dark:text-gray-200">
          {display}
        </span>
      )}
    </>
  );

  const className = 'flex items-center gap-2 min-w-0 w-full text-left';

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={`${className} rounded-control hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors`}>
        {inner}
      </button>
    );
  }

  return <div className={className}>{inner}</div>;
}
