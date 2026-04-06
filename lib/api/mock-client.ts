import type { ClockApi, MyTeamResult } from './client';
import { Collections } from './types';
import { TeamMembersRoleOptions } from './types';
import type {
  ClockEventsResponse,
  ClockEventsTypeOptions,
  TeamSettingsResponse,
  TeamWorkZonesResponse,
  TeamsResponse,
} from './types';

export type ApiClient = ClockApi & {
  /** The raw PocketBase instance (null for mock). */
  pb: unknown;
};

function makeId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function makeBaseFields() {
  return {
    id: makeId(),
    collectionId: makeId(),
    collectionName: Collections.ClockEvents,
  };
}

/**
 * In-memory mock that implements the same ClockApi interface.
 * Simulates a ~200ms network delay on each call.
 */
export function createMockClient(): ApiClient {
  const events: ClockEventsResponse[] = [];
  const mockUserId = 'mock_user';
  let mockTeamId: string | null = 'mock_team';
  let mockTeamName = 'My Team';
  let mockMembershipId = makeId();
  let mockSettingsId = makeId();
  let mockRequireWorkZone = false;
  let mockTrackClockLocation = true;
  const mockZones: TeamWorkZonesResponse[] = [];

  const delay = () => new Promise<void>((r) => setTimeout(r, 200));

  return {
    pb: null,

    async getLatestEvent() {
      await delay();
      return events[0] ?? null;
    },

    async createEvent(type: ClockEventsTypeOptions, options?) {
      await delay();

      const event: ClockEventsResponse = {
        ...makeBaseFields(),
        user: mockUserId,
        type,
        timestamp: new Date().toISOString(),
        note: options?.note ?? '',
        break_type: options?.breakType ?? '',
        corrected_by: '',
        original: null,
        latitude: 0,
        longitude: 0,
        expand: undefined as unknown,
      };

      events.unshift(event);
      return event;
    },

    async getEvents(options?) {
      await delay();
      if (options?.limit) {
        return events.slice(0, options.limit);
      }
      return [...events];
    },

    async getMyTeam(): Promise<MyTeamResult | null> {
      await delay();
      if (!mockTeamId) return null;
      const team: TeamsResponse = {
        id: mockTeamId,
        collectionId: makeId(),
        collectionName: Collections.Teams,
        name: mockTeamName,
        owner: mockUserId,
        expand: undefined as unknown,
      };
      return {
        membership: {
          id: mockMembershipId,
          collectionId: makeId(),
          collectionName: Collections.TeamMembers,
          team: mockTeamId,
          user: mockUserId,
          role: TeamMembersRoleOptions.manager,
          expand: { team },
        },
        team,
      };
    },

    async updateTeamName(teamId, name) {
      await delay();
      mockTeamName = name;
      return {
        id: teamId,
        collectionId: makeId(),
        collectionName: Collections.Teams,
        name,
        owner: mockUserId,
        expand: undefined as unknown,
      };
    },

    async createTeam(name) {
      await delay();
      mockTeamId = makeId();
      mockTeamName = name;
      mockMembershipId = makeId();
      return {
        id: mockTeamId,
        collectionId: makeId(),
        collectionName: Collections.Teams,
        name,
        owner: mockUserId,
        expand: undefined as unknown,
      };
    },

    async leaveTeam() {
      await delay();
      mockTeamId = null;
      mockTeamName = '';
      mockMembershipId = '';
    },

    async getTeamSettings(): Promise<TeamSettingsResponse | null> {
      await delay();
      if (!mockTeamId) return null;
      return {
        id: mockSettingsId,
        collectionId: makeId(),
        collectionName: Collections.TeamSettings,
        team: mockTeamId,
        require_work_zone: mockRequireWorkZone,
        track_clock_location: mockTrackClockLocation,
        expand: undefined as unknown,
      };
    },

    async updateTeamSettings(_settingsId, data) {
      await delay();
      if (data.require_work_zone !== undefined) mockRequireWorkZone = data.require_work_zone;
      if (data.track_clock_location !== undefined) mockTrackClockLocation = data.track_clock_location;
      return {
        id: mockSettingsId,
        collectionId: makeId(),
        collectionName: Collections.TeamSettings,
        team: mockTeamId!,
        require_work_zone: mockRequireWorkZone,
        track_clock_location: mockTrackClockLocation,
        expand: undefined as unknown,
      };
    },

    async getWorkZones() {
      await delay();
      return [...mockZones];
    },

    async createWorkZone(data) {
      await delay();
      const zone: TeamWorkZonesResponse = {
        id: makeId(),
        collectionId: makeId(),
        collectionName: Collections.TeamWorkZones,
        ...data,
        created_by: mockUserId,
        expand: undefined as unknown,
      };
      mockZones.push(zone);
      return zone;
    },

    async updateWorkZone(zoneId, data) {
      await delay();
      const zone = mockZones.find((z) => z.id === zoneId);
      if (!zone) throw new Error('Zone not found');
      Object.assign(zone, data);
      return { ...zone };
    },

    async deleteWorkZone(zoneId) {
      await delay();
      const idx = mockZones.findIndex((z) => z.id === zoneId);
      if (idx >= 0) mockZones.splice(idx, 1);
    },
  };
}
