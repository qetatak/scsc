'use client';

type HapticKind = 'tap' | 'success' | 'error';

export function triggerHaptic(kind: HapticKind = 'tap') {
  if (typeof navigator === 'undefined' || typeof navigator.vibrate !== 'function') {
    return;
  }
  try {
    if (kind === 'success') {
      navigator.vibrate([12, 30, 18]);
    } else if (kind === 'error') {
      navigator.vibrate([22, 40, 22]);
    } else {
      navigator.vibrate(10);
    }
  } catch {
    // Ignore unsupported or blocked vibration calls
  }
}
