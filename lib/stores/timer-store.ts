import { create } from 'zustand';
import { ClockEventsTypeOptions } from '@/lib/api/types';
import type { ClockEventsResponse } from '@/lib/api/types';

/**
 * Derived clock status. Maps to the backend's Status type in
 * internal/modules/clock/constants.go.
 */
type ClockStatus = 'clocked_out' | 'clocked_in' | 'on_break';

/**
 * Maps each event type to the status it produces.
 * This is the frontend mirror of ValidTransitions in the backend —
 * the event type determines what state the user is now in.
 */
const STATUS_BY_EVENT: Record<ClockEventsTypeOptions, ClockStatus> = {
  [ClockEventsTypeOptions.clock_in]: 'clocked_in',
  [ClockEventsTypeOptions.clock_out]: 'clocked_out',
  [ClockEventsTypeOptions.break_start]: 'on_break',
  [ClockEventsTypeOptions.break_end]: 'clocked_in',
};

type TimerState = {
  /** The most recent clock event from the API. */
  latestEvent: ClockEventsResponse | null;
  /** Derived clock status — updated whenever latestEvent changes. */
  status: ClockStatus;
  /** Derived clock-in timestamp — updated whenever latestEvent changes. */
  clockInTime: string | null;

  setLatestEvent: (event: ClockEventsResponse | null) => void;
};

function deriveStatus(event: ClockEventsResponse | null): ClockStatus {
  if (!event) return 'clocked_out';
  return STATUS_BY_EVENT[event.type];
}

function deriveClockInTime(event: ClockEventsResponse | null, status: ClockStatus): string | null {
  if (!event || status === 'clocked_out') return null;
  return event.timestamp;
}

export const useTimerStore = create<TimerState>((set) => ({
  latestEvent: null,
  status: 'clocked_out',
  clockInTime: null,

  setLatestEvent: (event) => {
    const status = deriveStatus(event);
    const clockInTime = deriveClockInTime(event, status);
    set({ latestEvent: event, status, clockInTime });
  },
}));

export type { ClockStatus };
