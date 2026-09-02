import { useDashboard } from '@/context/DashboardContext';
import { useModalStack } from '@/context/ModalStack';
import Top5Modal from './Top5Modal';
import StoreRankingModal from './StoreRankingModal';
import ProductDetailModal from './ProductDetailModal';
import PrincipioAtivoModal from './PrincipioAtivoModal';
import PaRankingModal from './PaRankingModal';

export default function ModalHost() {
  const { top, stack, close, back, push } = useModalStack();
  const { data, modo } = useDashboard();

  if (!top) return null;

  if (top.kind === 'top5') {
    return (
      <Top5Modal
        open
        onClose={close}
        onBack={stack.length > 1 ? back : undefined}
        items={data?.top_sem_venda ?? []}
        modo={modo}
        onProductClick={(produtoid, loja) => push({ kind: 'product', produtoid, lojaDestaque: loja })}
      />
    );
  }

  if (top.kind === 'store') return <StoreRankingModal frame={top} />;
  if (top.kind === 'product') return <ProductDetailModal frame={top} />;
  if (top.kind === 'pa-ranking') {
    return (
      <PaRankingModal
        open
        onClose={close}
        onBack={stack.length > 1 ? back : undefined}
        items={top.snapshot?.itens ?? []}
        modo={modo}
      />
    );
  }
  return <PrincipioAtivoModal frame={top} />;
}
