import { useAuthStore } from './auth-store';
import { DEV_BYPASS_AUTH } from './config';

type CurrentUser = {
  name: string;
};

const DEV_USER: CurrentUser = { name: 'Dev' };

/**
 * Returns the currently authenticated user's profile info.
 * In dev bypass mode, returns a stub user.
 */
export function useCurrentUser(): CurrentUser | null {
  const pb = useAuthStore((s) => s.pb);

  if (DEV_BYPASS_AUTH) return DEV_USER;

  const record = pb?.authStore.record;
  if (!record) return null;

  return { name: record.name || record.email?.split('@')[0] || '' };
}
