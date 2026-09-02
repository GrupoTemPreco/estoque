/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import type { ModalFrame } from '@/types';

interface ModalStackValue {
  stack: ModalFrame[];
  top: ModalFrame | null;
  push: (frame: ModalFrame) => void;
  back: () => void;
  close: () => void;
  updateTopSnapshot: (snapshot: unknown) => void;
}

const ModalStackContext = createContext<ModalStackValue | null>(null);

export function ModalStackProvider({ children }: { children: ReactNode }) {
  const [stack, setStack] = useState<ModalFrame[]>([]);

  const push = useCallback((frame: ModalFrame) => {
    setStack((s) => [...s, frame]);
  }, []);

  const back = useCallback(() => {
    setStack((s) => s.slice(0, -1));
  }, []);

  const close = useCallback(() => {
    setStack([]);
  }, []);

  const updateTopSnapshot = useCallback((snapshot: unknown) => {
    setStack((s) => {
      if (s.length === 0) return s;
      const top = s[s.length - 1];
      if (top.snapshot === snapshot) return s;
      return [...s.slice(0, -1), { ...top, snapshot } as ModalFrame];
    });
  }, []);

  const top = stack[stack.length - 1] ?? null;

  const value = useMemo(
    () => ({ stack, top, push, back, close, updateTopSnapshot }),
    [stack, top, push, back, close, updateTopSnapshot]
  );

  return <ModalStackContext.Provider value={value}>{children}</ModalStackContext.Provider>;
}

export function useModalStack() {
  const ctx = useContext(ModalStackContext);
  if (!ctx) throw new Error('useModalStack precisa de ModalStackProvider');
  return ctx;
}
