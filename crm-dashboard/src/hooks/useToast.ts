import { useCallback, useRef, useState } from 'react';
import type { ToastMessage, ToastTone } from '@/types';

const DURATION_MS = 4500;

export function useToast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const seq = useRef(0);

  const dismiss = useCallback((id: number) => {
    setToasts((list) => list.filter((t) => t.id !== id));
  }, []);

  const notify = useCallback(
    (tone: ToastTone, title: string, description?: string) => {
      const id = ++seq.current;
      setToasts((list) => [...list, { id, tone, title, description }]);
      window.setTimeout(() => dismiss(id), DURATION_MS);
    },
    [dismiss],
  );

  return { toasts, notify, dismiss };
}

export type Notify = ReturnType<typeof useToast>['notify'];
