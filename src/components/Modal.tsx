import { useEffect, type ReactNode } from 'react';
import { ArrowLeft, X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  onBack?: () => void;
  title: string;
  size?: 'md' | 'lg';
  children: ReactNode;
}

export default function Modal({ open, onClose, onBack, title, size = 'md', children }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  const width = size === 'lg' ? 'max-w-4xl' : 'max-w-2xl';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className={`card relative w-full ${width} max-h-[85vh] flex flex-col shadow-xl`}>
        <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-200 dark:border-gray-800">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="p-1.5 rounded-control hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Voltar"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <h2 className="text-base font-semibold flex-1 min-w-0 truncate">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-control hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="overflow-y-auto p-5">{children}</div>
      </div>
    </div>
  );
}
