import type { Filters as FiltersType, StoreCode, Classification, Curve, ValorModo } from '@/types';
import { STORES, CLASSIFICATIONS, CURVES } from '@/constants';
import { Store, Tag, BarChart3 } from 'lucide-react';

interface FiltersProps {
  filters: FiltersType;
  onChange: (f: FiltersType) => void;
  modo: ValorModo;
  onModoChange: (m: ValorModo) => void;
}

const selectClass =
  'control px-2.5 py-1.5 text-xs appearance-none pr-7 cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-400/40 bg-no-repeat';

export default function Filters({ filters, onChange, modo, onModoChange }: FiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative">
        <Store className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400/70 pointer-events-none" />
        <select
          className={`${selectClass} pl-8`}
          value={filters.loja}
          onChange={(e) => onChange({ ...filters, loja: e.target.value as StoreCode | 'all' })}
        >
          <option value="all">Todas as lojas</option>
          {STORES.map((s) => (
            <option key={s.code} value={s.code}>
              {s.code} - {s.name}
            </option>
          ))}
        </select>
        <Chevron />
      </div>

      <div className="relative">
        <Tag className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400/70 pointer-events-none" />
        <select
          className={`${selectClass} pl-8`}
          value={filters.classe}
          onChange={(e) => onChange({ ...filters, classe: e.target.value as Classification | 'all' })}
        >
          <option value="all">Todas as classificações</option>
          {CLASSIFICATIONS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <Chevron />
      </div>

      <div className="relative">
        <BarChart3 className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400/70 pointer-events-none" />
        <select
          className={`${selectClass} pl-8`}
          value={filters.curva}
          onChange={(e) => onChange({ ...filters, curva: e.target.value as Curve | 'all' })}
        >
          <option value="all">Todas as curvas</option>
          {CURVES.map((c) => (
            <option key={c} value={c}>
              {c === 'Sem Curva' ? 'Sem curva' : `Curva ${c}`}
            </option>
          ))}
        </select>
        <Chevron />
      </div>

      <div className="inline-flex hairline rounded-control overflow-hidden ml-auto">
        <button
          type="button"
          onClick={() => onModoChange('custo')}
          className={`px-3 py-1.5 text-xs font-medium transition-colors ${
            modo === 'custo'
              ? 'bg-brand-600 text-white'
              : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
          }`}
        >
          Custo
        </button>
        <button
          type="button"
          onClick={() => onModoChange('venda')}
          className={`px-3 py-1.5 text-xs font-medium transition-colors ${
            modo === 'venda'
              ? 'bg-brand-600 text-white'
              : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
          }`}
        >
          Venda
        </button>
      </div>
    </div>
  );
}

function Chevron() {
  return (
    <svg
      className="w-3.5 h-3.5 absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
