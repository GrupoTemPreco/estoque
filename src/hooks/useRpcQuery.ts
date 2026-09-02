import { useCallback, useEffect, useRef, useState } from 'react';

export function useRpcQuery<T>(options: {
  enabled: boolean;
  snapshot?: T;
  fetcher: () => Promise<T>;
}) {
  const { enabled, snapshot, fetcher } = options;
  const [data, setData] = useState<T | null>(snapshot ?? null);
  const [loading, setLoading] = useState(enabled && !snapshot);
  const [error, setError] = useState<string | null>(null);
  const requestId = useRef(0);

  const load = useCallback(async () => {
    if (!enabled) return;
    if (snapshot) {
      setData(snapshot);
      setLoading(false);
      setError(null);
      return;
    }

    const id = ++requestId.current;
    setLoading(true);
    setError(null);
    try {
      const next = await fetcher();
      if (id !== requestId.current) return;
      setData(next);
    } catch (e) {
      if (id !== requestId.current) return;
      setError(e instanceof Error ? e.message : 'Falha ao carregar.');
    } finally {
      if (id === requestId.current) setLoading(false);
    }
  }, [enabled, snapshot, fetcher]);

  useEffect(() => {
    if (!enabled) {
      requestId.current += 1;
      return;
    }
    void load();
    return () => {
      requestId.current += 1;
    };
  }, [enabled, load]);

  return { data, loading, error, refetch: load };
}
