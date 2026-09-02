import { useEffect, useState } from 'react';
import type { TopSemVendaItem, ValorModo } from '@/types';
import { formatBRL, formatIsoDate, pickValor } from '@/utils';
import Modal from './Modal';
import { ChevronDown } from 'lucide-react';

interface Top5ModalProps {
  open: boolean;
  onClose: () => void;
  onBack?: () => void;
  items: TopSemVendaItem[];
  modo: ValorModo;
  onProductClick: (produtoid: number | string, loja: string) => void;
}

export default function Top5Modal({
  open,
  onClose,
  onBack,
  items,
  modo,
  onProductClick,
}: Top5ModalProps) {
  const [visible, setVisible] = useState(10);

  useEffect(() => {
    if (open) setVisible(10);
  }, [open]);

  const shown = items.slice(0, visible);

  return (
    <Modal open={open} onClose={onClose} onBack={onBack} title="Ranking — mais tempo sem venda">
      <div className="flex flex-col gap-1">
        {shown.map((item, idx) => (
          <button
            key={`${item.loja_codigo}-${item.produtoid}`}
            type="button"
            onClick={() => onProductClick(item.produtoid, item.loja_codigo)}
            className="flex items-center gap-3 px-3 py-3 rounded-control hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors text-left"
          >
            <span className="w-7 h-7 shrink-0 rounded-full bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 flex items-center justify-center text-xs font-semibold">
              {idx + 1}
            </span>
            <div className="flex-1 min-w-0">
              <span className="font-medium text-sm truncate block">{item.produto_descricao}</span>
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                <span>{item.loja_nome}</span>
                <span className="text-gray-300 dark:text-gray-600">·</span>
                <span>{item.classe_principal}</span>
                <span className="text-gray-300 dark:text-gray-600">·</span>
                <span>Últ. venda: {formatIsoDate(item.ultima_venda)}</span>
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-lg font-semibold text-red-600 dark:text-red-400 tabular-nums">
                {item.dias_sem_venda}d
              </div>
              <div className="text-xs text-gray-400 tabular-nums">
                {formatBRL(pickValor(item.valor_custo, item.valor_venda, modo))}
              </div>
            </div>
          </button>
        ))}
        {shown.length === 0 && (
          <p className="text-center text-sm text-gray-400 py-8">Nenhum item encontrado.</p>
        )}
      </div>

      {visible < items.length && (
        <div className="flex justify-center mt-4">
          <button
            type="button"
            onClick={() => setVisible((v) => v + 10)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm rounded-control hairline hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
          >
            Carregar mais
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      )}
    </Modal>
  );
}
