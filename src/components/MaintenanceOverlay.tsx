import { useState, type ReactNode } from 'react';

interface MaintenanceOverlayProps {
  children: ReactNode;
}

export default function MaintenanceOverlay({ children }: MaintenanceOverlayProps) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="relative">
      {children}
      {!revealed && (
        <div className="absolute inset-0 z-10 rounded-card overflow-hidden flex items-center justify-center bg-white/70 dark:bg-gray-950/75 backdrop-blur-md">
          <div className="flex flex-col items-center gap-3 px-4 text-center">
            <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
              Card em manutenção, informações erradas
            </p>
            <button
              type="button"
              onClick={() => setRevealed(true)}
              className="control px-3 py-1.5 text-xs font-medium hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Ver mesmo assim
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
