import { TrendingDown, TrendingUp, AlertTriangle, Clock, PackageX, CalendarClock, Percent, Ban } from 'lucide-react';

interface KpiCardProps {
  label: string;
  value: string;
  sub?: string;
  icon?: 'alert' | 'parado' | 'dias' | 'semVendaMedia' | 'semVenda180' | 'semVendaMax' | 'percent' | 'nunca';
  accent?: 'default' | 'warning' | 'danger';
  onClick?: () => void;
  className?: string;
}

const ICONS = {
  alert: AlertTriangle,
  parado: TrendingDown,
  dias: TrendingUp,
  semVendaMedia: Clock,
  semVenda180: PackageX,
  semVendaMax: CalendarClock,
  percent: Percent,
  nunca: Ban,
} as const;

const ACCENTS = {
  default: 'text-brand-600 dark:text-brand-400',
  warning: 'text-amber-500 dark:text-amber-400',
  danger: 'text-red-500 dark:text-red-400',
} as const;

/** Escala o valor para caber até "R$ 12.345.678,90" sem ellipsis. */
function valueSizeClass(value: string): string {
  const len = value.length;
  if (len > 15) return 'text-[13px] sm:text-sm';
  if (len > 12) return 'text-base';
  return 'text-xl';
}

export default function KpiCard({
  label,
  value,
  sub,
  icon = 'alert',
  accent = 'default',
  onClick,
  className: extraClass,
}: KpiCardProps) {
  const Icon = ICONS[icon];
  const className = `card flex flex-col min-w-0 text-left overflow-visible ${extraClass ?? 'px-2.5 py-2.5 gap-1'}`;

  const inner = (
    <>
      <div className="flex items-start justify-between gap-1.5">
        <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400 leading-tight">
          {label}
        </span>
        <Icon className={`w-3.5 h-3.5 shrink-0 mt-px ${ACCENTS[accent]}`} strokeWidth={2} />
      </div>
      <span
        className={`font-semibold tracking-tight leading-snug tabular-nums ${valueSizeClass(value)}`}
      >
        {value}
      </span>
      {sub && (
        <span className="text-[11px] text-gray-500 dark:text-gray-400 leading-tight">{sub}</span>
      )}
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`${className} hover:border-brand-400 dark:hover:border-brand-500 transition-colors cursor-pointer`}
      >
        {inner}
      </button>
    );
  }

  return <div className={className}>{inner}</div>;
}

export type { KpiCardProps };
