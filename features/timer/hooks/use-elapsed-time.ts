import { useEffect, useState } from 'react';
import { useTimerStore } from '@/lib/stores/timer-store';

/**
 * Returns a live-updating elapsed time in ms since the user clocked in.
 * Updates every 100ms while clocked in for smooth display.
 * Returns 0 when clocked out.
 */
export function useElapsedTime(): number {
  const status = useTimerStore((s) => s.status);
  const clockInTime = useTimerStore((s) => s.clockInTime);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (status === 'clocked_out' || !clockInTime) {
      setElapsed(0);
      return;
    }

    const calcElapsed = () => Date.now() - new Date(clockInTime).getTime();
    setElapsed(calcElapsed());

    const interval = setInterval(() => {
      setElapsed(calcElapsed());
    }, 100);

    return () => clearInterval(interval);
  }, [status, clockInTime]);

  return elapsed;
}
