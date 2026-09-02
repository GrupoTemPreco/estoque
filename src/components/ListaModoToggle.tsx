import type { ListaModo } from '@/types';

export default function ListaModoToggle({
  modo,
  onChange,
}: {
  modo: ListaModo;
  onChange: (m: ListaModo) => void;
}) {
  return (
    <div className="inline-flex hairline rounded-control overflow-hidden self-start">
      <button
        type="button"
        onClick={() => onChange('produto')}
        className={`px-3 py-1.5 text-xs font-medium ${
          modo === 'produto' ? 'bg-brand-600 text-white' : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300'
        }`}
      >
        Produto
      </button>
      <button
        type="button"
        onClick={() => onChange('principio-ativo')}
        className={`px-3 py-1.5 text-xs font-medium ${
          modo === 'principio-ativo'
            ? 'bg-brand-600 text-white'
            : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300'
        }`}
      >
        Princípio Ativo
      </button>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-4 animate-pulse" aria-busy="true" aria-label="Carregando dashboard">
      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-4">
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="card h-20 bg-gray-100 dark:bg-gray-800" />
            ))}
          </div>
          <div className="card h-48 bg-gray-100 dark:bg-gray-800" />
        </div>
        <div className="card h-72 bg-gray-100 dark:bg-gray-800" />
      </div>
      <div className="card h-64 bg-gray-100 dark:bg-gray-800" />
    </div>
  );
}
