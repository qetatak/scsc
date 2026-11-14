'use client';

import { useEffect, useState } from 'react';

/**
 * Tracks virtual software keyboard height using VisualViewport API
 * and scrolls focused inputs smoothly into view above the keyboard.
 */
export function useKeyboardOffset(autoScrollFocused = true) {
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const vv = window.visualViewport;

    const updateOffset = () => {
      if (!vv) {
        setKeyboardHeight(0);
        return;
      }
      const heightDiff = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
      setKeyboardHeight(heightDiff > 80 ? Math.round(heightDiff) : 0);
    };

    const handleFocusIn = (event: FocusEvent) => {
      if (!autoScrollFocused) return;
      const target = event.target as HTMLElement | null;
      if (!target) return;
      const tag = target.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') {
        window.setTimeout(() => {
          target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 140);
      }
    };

    updateOffset();
    vv?.addEventListener('resize', updateOffset);
    vv?.addEventListener('scroll', updateOffset);
    document.addEventListener('focusin', handleFocusIn);

    return () => {
      vv?.removeEventListener('resize', updateOffset);
      vv?.removeEventListener('scroll', updateOffset);
      document.removeEventListener('focusin', handleFocusIn);
    };
  }, [autoScrollFocused]);

  return {
    keyboardHeight,
    isKeyboardOpen: keyboardHeight > 0,
  };
}
