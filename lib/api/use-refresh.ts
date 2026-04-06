import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';

/**
 * Returns a callback that invalidates all queries in the cache.
 * Pass directly to PageView's onRefresh for pull-to-refresh.
 */
export function useRefresh() {
  const queryClient = useQueryClient();

  return useCallback(async () => {
    await queryClient.invalidateQueries();
  }, [queryClient]);
}
