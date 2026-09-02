export default function CurveBadge({ curva }: { curva: string }) {
  return (
    <span className="inline-flex items-center justify-center min-w-6 h-6 px-1.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 whitespace-nowrap">
      {curva}
    </span>
  );
}
