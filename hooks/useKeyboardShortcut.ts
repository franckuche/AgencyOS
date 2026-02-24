import { useEffect } from 'react';

/**
 * Registers a global keyboard shortcut.
 * `key` is compared case-insensitively. `meta` means Cmd (Mac) or Ctrl.
 */
export function useKeyboardShortcut(
  key: string,
  handler: (e: KeyboardEvent) => void,
  opts: { meta?: boolean; enabled?: boolean } = {},
) {
  const { meta = false, enabled = true } = opts;

  useEffect(() => {
    if (!enabled) return;
    function onKeyDown(e: KeyboardEvent) {
      if (meta && !(e.metaKey || e.ctrlKey)) return;
      if (e.key.toLowerCase() !== key.toLowerCase()) return;
      e.preventDefault();
      handler(e);
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [key, handler, meta, enabled]);
}
