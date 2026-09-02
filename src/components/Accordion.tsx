import { useState } from 'react';
import { ChevronDown, AlertTriangle } from 'lucide-react';

interface AccordionProps {
  title: string;
  badge?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  /** Quando true, renderiza como linha integrada à tabela (sem card externo). */
  embedded?: boolean;
}

export default function Accordion({ title, badge, icon, children, embedded = false }: AccordionProps) {
  const [open, setOpen] = useState(false);
  const wrapperClass = embedded ? 'w-full' : 'card overflow-hidden';
  const btnClass = embedded
    ? 'w-full flex items-center gap-3 px-5 py-2.5 text-left bg-amber-50/60 dark:bg-amber-950/20 hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-colors border-b border-gray-200 dark:border-gray-800'
    : 'w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors';
  const contentClass = embedded
    ? 'px-5 py-4 bg-gray-50/50 dark:bg-gray-900/40 border-b border-gray-200 dark:border-gray-800'
    : 'px-5 pb-5 border-t border-gray-200 dark:border-gray-800';
  return (
    <div className={wrapperClass}>
      <button onClick={() => setOpen((o) => !o)} className={btnClass}>
        {icon ?? <AlertTriangle className="w-4 h-4 text-amber-500 dark:text-amber-400 shrink-0" />}
        <span className="font-medium text-sm flex-1">{title}</span>
        {badge && (
          <span className="text-xs text-gray-500 dark:text-gray-400 tabular-nums">{badge}</span>
        )}
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && <div className={contentClass}>{children}</div>}
    </div>
  );
}
