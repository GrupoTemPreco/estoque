import { formatUltimaAtualizacao } from '@/utils';

export default function AtualizadoEm({ em }: { em: string | null | undefined }) {
  if (!em) return null;
  const label = formatUltimaAtualizacao(em);
  if (!label) return null;

  return (
    <span className="text-[11px] text-gray-500 dark:text-gray-400 hidden sm:inline tabular-nums">{label}</span>
  );
}
