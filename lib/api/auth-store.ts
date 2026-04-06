import { create } from 'zustand';
import PocketBase, { AsyncAuthStore } from 'pocketbase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { POCKETBASE_URL, DEV_BYPASS_AUTH } from './config';

const AUTH_STORAGE_KEY = 'pb_auth';

type AuthState = {
  /** The shared PocketBase instance (null when using dev bypass). */
  pb: PocketBase | null;
  /** Whether the user is authenticated (always true in dev bypass mode). */
  isAuthenticated: boolean;
  /** Whether auth state is still being resolved. */
  isLoading: boolean;
  /** Last auth error message. */
  error: string | null;

  /** Initialize auth — restores saved session or sets dev bypass. */
  init: () => Promise<void>;
  /** Sign in with email and password. */
  signIn: (email: string, password: string) => Promise<void>;
  /** Sign out and clear the session. */
  signOut: () => void;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  pb: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  async init() {
    if (DEV_BYPASS_AUTH) {
      set({ isAuthenticated: true, isLoading: false, pb: null });
      return;
    }

    // Load persisted auth data from AsyncStorage before creating PocketBase.
    const initial = await AsyncStorage.getItem(AUTH_STORAGE_KEY);

    const store = new AsyncAuthStore({
      save: async (serialized) => {
        await AsyncStorage.setItem(AUTH_STORAGE_KEY, serialized);
      },
      clear: async () => {
        await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
      },
      initial: initial ?? '',
    });

    const pb = new PocketBase(POCKETBASE_URL, store);
    const isAuthenticated = pb.authStore.isValid;
    set({ pb, isAuthenticated, isLoading: false });

    // Listen for auth state changes (e.g. token expiry).
    pb.authStore.onChange(() => {
      set({ isAuthenticated: pb.authStore.isValid });
    });
  },

  async signIn(email: string, password: string) {
    const { pb } = get();
    if (!pb) return;

    set({ error: null, isLoading: true });
    try {
      await pb.collection('users').authWithPassword(email, password);
      set({ isAuthenticated: true, isLoading: false });
    } catch (e) {
      set({
        error: (e as Error).message || 'Sign in failed',
        isLoading: false,
      });
      throw e;
    }
  },

  signOut() {
    const { pb } = get();
    pb?.authStore.clear();
    set({ isAuthenticated: false, error: null });
  },
}));
