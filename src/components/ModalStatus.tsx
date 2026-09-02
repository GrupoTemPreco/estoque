interface ModalStatusProps {
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}

export default function ModalStatus({ loading, error, onRetry }: ModalStatusProps) {
  if (loading) {
    return (
      <div className="flex flex-col gap-3 animate-pulse" aria-busy="true">
        <div className="h-6 w-2/3 rounded-control bg-gray-100 dark:bg-gray-800" />
        <div className="h-24 rounded-control bg-gray-100 dark:bg-gray-800" />
        <div className="h-24 rounded-control bg-gray-100 dark:bg-gray-800" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-start gap-3">
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        <button
          type="button"
          onClick={onRetry}
          className="px-3 py-1.5 text-xs rounded-control hairline hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return null;
}
