import { useEffect } from 'react';
import { useLatestEvent } from './hooks';
import { useTimerStore } from '@/lib/stores/timer-store';

/**
 * Keeps the timer store in sync with the latest clock event from the API.
 * Mount this once in the tabs layout — it fetches on startup, refetches
 * on pull-to-refresh (via query invalidation), and on app resume.
 */
export function useSyncClock() {
  const { data } = useLatestEvent();
  const setLatestEvent = useTimerStore((s) => s.setLatestEvent);

  useEffect(() => {
    setLatestEvent(data ?? null);
  }, [data, setLatestEvent]);
}
