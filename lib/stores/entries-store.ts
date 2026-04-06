import { create } from 'zustand';
import type { TimeEntry } from '@/features/types';

type EntriesState = {
  entries: TimeEntry[];
  addEntry: (entry: Omit<TimeEntry, 'id'>) => void;
  deleteEntry: (id: string) => void;
  getEntriesByDate: (date: Date) => TimeEntry[];
  getEntriesByProject: (projectId: string) => TimeEntry[];
  getTotalDuration: (projectId?: string) => number;
  getTodayDuration: () => number;
};

function isSameDay(ts: number, date: Date): boolean {
  const d = new Date(ts);
  return (
    d.getFullYear() === date.getFullYear() &&
    d.getMonth() === date.getMonth() &&
    d.getDate() === date.getDate()
  );
}

export const useEntriesStore = create<EntriesState>((set, get) => ({
  entries: [],

  addEntry: (entry) => {
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
    set((state) => ({
      entries: [{ ...entry, id }, ...state.entries],
    }));
  },

  deleteEntry: (id) => {
    set((state) => ({
      entries: state.entries.filter((e) => e.id !== id),
    }));
  },

  getEntriesByDate: (date) => {
    return get().entries.filter((e) => isSameDay(e.startTime, date));
  },

  getEntriesByProject: (projectId) => {
    return get().entries.filter((e) => e.projectId === projectId);
  },

  getTotalDuration: (projectId) => {
    const entries = projectId
      ? get().entries.filter((e) => e.projectId === projectId)
      : get().entries;
    return entries.reduce((sum, e) => sum + e.duration, 0);
  },

  getTodayDuration: () => {
    const today = new Date();
    return get()
      .getEntriesByDate(today)
      .reduce((sum, e) => sum + e.duration, 0);
  },
}));
