import { useEffect } from 'react';

export default function useDismiss(ref, active, onDismiss, ignoreSelector = null) {
  useEffect(() => {
    if (!active) return undefined;

    const handlePointer = (event) => {
      if (ignoreSelector && event.target.closest?.(ignoreSelector)) return;
      if (ref.current && !ref.current.contains(event.target)) onDismiss();
    };
    const handleKey = (event) => {
      if (event.key === 'Escape' && !event.defaultPrevented) onDismiss();
    };

    document.addEventListener('pointerdown', handlePointer);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('pointerdown', handlePointer);
      document.removeEventListener('keydown', handleKey);
    };
  }, [ref, active, onDismiss, ignoreSelector]);
}