import { DEV_BYPASS_AUTH } from './config';
import { createMockClient, type ApiClient } from './mock-client';
import { useAuthStore } from './auth-store';
import type {
  ClockEventsResponse,
  ClockEventsTypeOptions,
  TeamMembersResponse,
  TeamSettingsResponse,
  TeamWorkZonesResponse,
  TeamsResponse,
} from './types';

export type { ApiClient };

/**
 * The API client interface that both the real PocketBase client
 * and the mock client implement. This is the contract that hooks
 * and features program against.
 *
 * The backend uses an event-stream model: every clock action
 * (clock_in, clock_out, break_start, break_end) is a separate
 * record in the `clock_events` collection.
 */
/** The user's team membership with the expanded team record. */
export type MyTeamResult = {
  membership: TeamMembersResponse<{ team: TeamsResponse }>;
  team: TeamsResponse;
};

export type ClockApi = {
  /** Get the user's most recent clock event, or null if none exist. */
  getLatestEvent: () => Promise<ClockEventsResponse | null>;

  /** Create a new clock event. */
  createEvent: (
    type: ClockEventsTypeOptions,
    options?: { note?: string; breakType?: string }
  ) => Promise<ClockEventsResponse>;

  /** Get clock events for the authenticated user, most recent first. */
  getEvents: (options?: { limit?: number }) => Promise<ClockEventsResponse[]>;

  /** Get the current user's team membership and team, or null if not in a team. */
  getMyTeam: () => Promise<MyTeamResult | null>;

  /** Update a team's name. Only the team owner can do this. */
  updateTeamName: (teamId: string, name: string) => Promise<TeamsResponse>;

  /** Create a new team. The authenticated user becomes the owner. */
  createTeam: (name: string) => Promise<TeamsResponse>;

  /** Leave the current team by deleting the user's membership record. */
  leaveTeam: (membershipId: string) => Promise<void>;

  /** Get the settings for a team. */
  getTeamSettings: (teamId: string) => Promise<TeamSettingsResponse | null>;

  /** Update team settings (partial). */
  updateTeamSettings: (
    settingsId: string,
    data: { require_work_zone?: boolean; track_clock_location?: boolean }
  ) => Promise<TeamSettingsResponse>;

  /** Get all work zones for a team. */
  getWorkZones: (teamId: string) => Promise<TeamWorkZonesResponse[]>;

  /** Create a new work zone. */
  createWorkZone: (data: {
    team: string;
    name: string;
    latitude: number;
    longitude: number;
    radius: number;
    color: string;
  }) => Promise<TeamWorkZonesResponse>;

  /** Update a work zone. */
  updateWorkZone: (
    zoneId: string,
    data: { name?: string; latitude?: number; longitude?: number; radius?: number; color?: string }
  ) => Promise<TeamWorkZonesResponse>;

  /** Delete a work zone. */
  deleteWorkZone: (zoneId: string) => Promise<void>;
};

function createPocketBaseClient(): ApiClient {
  const pb = useAuthStore.getState().pb;
  if (!pb) {
    throw new Error('PocketBase instance not available — is auth initialized?');
  }

  const userId = () => pb.authStore.record?.id ?? '';

  return {
    pb,

    async getLatestEvent() {
      try {
        return await pb
          .collection('clock_events')
          .getFirstListItem<ClockEventsResponse>(
            `user = "${userId()}"`,
            { sort: '-timestamp' }
          );
      } catch {
        return null;
      }
    },

    async createEvent(type, options) {
      return await pb
        .collection('clock_events')
        .create<ClockEventsResponse>({
          user: userId(),
          type,
          timestamp: new Date().toISOString(),
          note: options?.note ?? '',
          break_type: options?.breakType ?? '',
        });
    },

    async getEvents(options) {
      return await pb
        .collection('clock_events')
        .getFullList<ClockEventsResponse>({
          filter: `user = "${userId()}"`,
          sort: '-timestamp',
          ...(options?.limit ? { perPage: options.limit } : {}),
        });
    },

    async getMyTeam() {
      try {
        const membership = await pb
          .collection('team_members')
          .getFirstListItem<TeamMembersResponse<{ team: TeamsResponse }>>(
            `user = "${userId()}"`,
            { expand: 'team' }
          );
        const team = membership.expand!.team;
        return { membership, team };
      } catch {
        return null;
      }
    },

    async updateTeamName(teamId, name) {
      return await pb
        .collection('teams')
        .update<TeamsResponse>(teamId, { name });
    },

    async createTeam(name) {
      return await pb
        .collection('teams')
        .create<TeamsResponse>({ name });
    },

    async leaveTeam(membershipId) {
      await pb.collection('team_members').delete(membershipId);
    },

    async getTeamSettings(teamId) {
      try {
        return await pb
          .collection('team_settings')
          .getFirstListItem<TeamSettingsResponse>(`team = "${teamId}"`);
      } catch {
        return null;
      }
    },

    async updateTeamSettings(settingsId, data) {
      return await pb
        .collection('team_settings')
        .update<TeamSettingsResponse>(settingsId, data);
    },

    async getWorkZones(teamId) {
      return await pb
        .collection('team_work_zones')
        .getFullList<TeamWorkZonesResponse>({
          filter: `team = "${teamId}"`,
          sort: 'name',
        });
    },

    async createWorkZone(data) {
      return await pb
        .collection('team_work_zones')
        .create<TeamWorkZonesResponse>(data);
    },

    async updateWorkZone(zoneId, data) {
      return await pb
        .collection('team_work_zones')
        .update<TeamWorkZonesResponse>(zoneId, data);
    },

    async deleteWorkZone(zoneId) {
      await pb.collection('team_work_zones').delete(zoneId);
    },
  };
}

/**
 * Creates the appropriate API client based on the DEV_BYPASS_AUTH flag.
 */
export function createApiClient(): ApiClient {
  if (DEV_BYPASS_AUTH) {
    return createMockClient();
  }
  return createPocketBaseClient();
}
