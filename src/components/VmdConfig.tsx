import type { JanelaDias } from '@/types';
import { JANELAS } from '@/constants';
import { Settings2 } from 'lucide-react';

interface VmdConfigProps {
  janela: JanelaDias;
  onChange: (j: JanelaDias) => void;
}

export default function VmdConfig({ janela, onChange }: VmdConfigProps) {
  return (
    <div className="card px-4 py-3">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <Settings2 className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
          <span className="text-xs font-medium">Janela de vendas</span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {JANELAS.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => onChange(d)}
              className={`px-2.5 py-1 text-xs rounded-control transition-colors ${
                janela === d
                  ? 'bg-brand-600 text-white'
                  : 'hairline hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300'
              }`}
            >
              {d}d
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
