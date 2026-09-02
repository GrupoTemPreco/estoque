import { useEffect, useState } from 'react';
import type { RankingPaItem, ValorModo } from '@/types';
import { useModalStack } from '@/context/ModalStack';
import Modal from './Modal';
import { PaRankingBody } from './PaRankingBody';
import { splitPaItens } from '@/utils';
import { ChevronDown } from 'lucide-react';

interface PaRankingModalProps {
  open: boolean;
  onClose: () => void;
  onBack?: () => void;
  items: RankingPaItem[];
  modo: ValorModo;
}

export default function PaRankingModal({ open, onClose, onBack, items, modo }: PaRankingModalProps) {
  const { push } = useModalStack();
  const [visible, setVisible] = useState(20);

  useEffect(() => {
    if (open) setVisible(20);
  }, [open]);

  const { nunca, resto } = splitPaItens(items);
  const shown = [...nunca, ...resto.slice(0, visible)];

  return (
    <Modal open={open} onClose={onClose} onBack={onBack} title="Ranking — Princípio Ativo">
      <PaRankingBody
        items={shown}
        modo={modo}
        onSelect={(principioAtivo) => push({ kind: 'pa', principioAtivo })}
      />
      {visible < resto.length && (
        <div className="flex justify-center mt-4">
          <button
            type="button"
            onClick={() => setVisible((v) => v + 20)}
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
