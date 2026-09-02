import { useState } from 'react';
import { Moon, Sun, Package } from 'lucide-react';
import { DashboardProvider, useDashboard } from '@/context/DashboardContext';
import { ModalStackProvider } from '@/context/ModalStack';
import DashboardEstoque from '@/components/DashboardEstoque';
import AtualizadoEm from '@/components/AtualizadoEm';
import ModalHost from '@/components/ModalHost';

export default function App() {
  return (
    <DashboardProvider>
      <ModalStackProvider>
        <AppShell />
        <ModalHost />
      </ModalStackProvider>
    </DashboardProvider>
  );
}

function AppShell() {
  const [dark, setDark] = useState(true);
  const { data } = useDashboard();

  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <header className="hairline border-x-0 border-t-0 bg-white dark:bg-gray-900 sticky top-0 z-30">
        <div className="max-w-[1400px] mx-auto px-6 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-control bg-brand-600 flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-semibold leading-tight">Controle de Estoque</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-tight">Rede de Drogarias · 12 lojas</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <AtualizadoEm em={data?.ultima_atualizacao.em} />
            <button
              onClick={toggleDark}
              className="control p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Alternar tema"
            >
              {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-6 py-4">
        <DashboardEstoque />
      </main>

      <footer className="text-xs text-gray-400 dark:text-gray-600 text-center py-4">
        Dashboard de controle de estoque
      </footer>
    </div>
  );
}
