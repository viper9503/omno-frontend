import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

const STORAGE_KEY = 'clock-reminder';

export type Reminder = {
  enabled: boolean;
  /** Hour in 24h format (0-23) */
  hour: number;
  /** Minute (0-59) */
  minute: number;
  /** Days of the week (0=Sun, 1=Mon, ..., 6=Sat) */
  days: number[];
};

const DEFAULT_REMINDER: Reminder = {
  enabled: false,
  hour: 9,
  minute: 0,
  days: [1, 2, 3, 4, 5], // Mon-Fri
};

type ReminderState = {
  reminder: Reminder;
  loaded: boolean;
  load: () => Promise<void>;
  update: (partial: Partial<Reminder>) => Promise<void>;
};

export const useReminderStore = create<ReminderState>((set, get) => ({
  reminder: DEFAULT_REMINDER,
  loaded: false,

  load: async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Reminder;
        set({ reminder: { ...DEFAULT_REMINDER, ...parsed }, loaded: true });
      } else {
        set({ loaded: true });
      }
    } catch {
      set({ loaded: true });
    }
  },

  update: async (partial) => {
    const next = { ...get().reminder, ...partial };
    set({ reminder: next });
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  },
}));
