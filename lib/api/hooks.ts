import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi } from './provider';
import type { ClockEventsTypeOptions } from './types';

export const queryKeys = {
  clockEvents: ['clock-events'] as const,
  latestEvent: ['clock-events', 'latest'] as const,
  eventHistory: (limit?: number) => ['clock-events', 'history', limit] as const,
  myTeam: ['my-team'] as const,
  teamSettings: (teamId: string) => ['team-settings', teamId] as const,
  workZones: (teamId: string) => ['work-zones', teamId] as const,
};

/**
 * Fetches the user's most recent clock event.
 */
export function useLatestEvent() {
  const api = useApi();
  return useQuery({
    queryKey: queryKeys.latestEvent,
    queryFn: () => api.getLatestEvent(),
  });
}

/**
 * Mutation to create a new clock event.
 * Automatically invalidates all clock-event queries on success.
 */
export function useCreateEvent() {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vars: {
      type: ClockEventsTypeOptions;
      options?: { note?: string; breakType?: string };
    }) => api.createEvent(vars.type, vars.options),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.clockEvents });
    },
  });
}

/**
 * Fetches the user's clock event history.
 */
export function useEventHistory(limit?: number) {
  const api = useApi();
  return useQuery({
    queryKey: queryKeys.eventHistory(limit),
    queryFn: () => api.getEvents(limit ? { limit } : undefined),
  });
}

/**
 * Fetches the current user's team membership and team info.
 * Returns null if the user is not in a team.
 */
export function useMyTeam() {
  const api = useApi();
  return useQuery({
    queryKey: queryKeys.myTeam,
    queryFn: () => api.getMyTeam(),
  });
}

/**
 * Mutation to update a team's name.
 * Invalidates the myTeam query on success.
 */
export function useUpdateTeamName() {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vars: { teamId: string; name: string }) =>
      api.updateTeamName(vars.teamId, vars.name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.myTeam });
    },
  });
}

/**
 * Mutation to create a new team.
 * Invalidates the myTeam query on success.
 */
export function useCreateTeam() {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (name: string) => api.createTeam(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.myTeam });
    },
  });
}

/**
 * Fetches the settings for a team.
 */
export function useTeamSettings(teamId: string | undefined) {
  const api = useApi();
  return useQuery({
    queryKey: queryKeys.teamSettings(teamId ?? ''),
    queryFn: () => api.getTeamSettings(teamId!),
    enabled: !!teamId,
  });
}

/**
 * Mutation to update team settings.
 * Invalidates the teamSettings query on success.
 */
export function useUpdateTeamSettings(teamId: string | undefined) {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vars: {
      settingsId: string;
      data: { require_work_zone?: boolean; track_clock_location?: boolean };
    }) => api.updateTeamSettings(vars.settingsId, vars.data),
    onSuccess: () => {
      if (teamId) {
        queryClient.invalidateQueries({ queryKey: queryKeys.teamSettings(teamId) });
      }
    },
  });
}

/**
 * Fetches all work zones for a team.
 */
export function useWorkZones(teamId: string | undefined) {
  const api = useApi();
  return useQuery({
    queryKey: queryKeys.workZones(teamId ?? ''),
    queryFn: () => api.getWorkZones(teamId!),
    enabled: !!teamId,
  });
}

/**
 * Mutation to create a work zone.
 */
export function useCreateWorkZone(teamId: string | undefined) {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      team: string;
      name: string;
      latitude: number;
      longitude: number;
      radius: number;
      color: string;
    }) => api.createWorkZone(data),
    onSuccess: () => {
      if (teamId) {
        queryClient.invalidateQueries({ queryKey: queryKeys.workZones(teamId) });
      }
    },
  });
}

/**
 * Mutation to update a work zone.
 */
export function useUpdateWorkZone(teamId: string | undefined) {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vars: {
      zoneId: string;
      data: { name?: string; latitude?: number; longitude?: number; radius?: number; color?: string };
    }) => api.updateWorkZone(vars.zoneId, vars.data),
    onSuccess: () => {
      if (teamId) {
        queryClient.invalidateQueries({ queryKey: queryKeys.workZones(teamId) });
      }
    },
  });
}

/**
 * Mutation to delete a work zone.
 */
export function useDeleteWorkZone(teamId: string | undefined) {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (zoneId: string) => api.deleteWorkZone(zoneId),
    onSuccess: () => {
      if (teamId) {
        queryClient.invalidateQueries({ queryKey: queryKeys.workZones(teamId) });
      }
    },
  });
}

/**
 * Mutation to leave the current team.
 * Invalidates the myTeam query on success.
 */
export function useLeaveTeam() {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (membershipId: string) => api.leaveTeam(membershipId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.myTeam });
    },
  });
}
