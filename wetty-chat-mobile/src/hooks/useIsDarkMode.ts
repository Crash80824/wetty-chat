import { useEffect, useState } from 'react';

const DARK_MODE_QUERY = '(prefers-color-scheme: dark)';

export function useIsDarkMode(): boolean {
  const [isDarkMode, setIsDarkMode] = useState(() => window.matchMedia(DARK_MODE_QUERY).matches);

  useEffect(() => {
    const mq = window.matchMedia(DARK_MODE_QUERY);
    const handler = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return isDarkMode;
}
