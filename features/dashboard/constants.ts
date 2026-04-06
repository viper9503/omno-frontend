export const ACTIVITY_TYPES = {
  clockedIn: { label: 'Clocked In', color: '#22c55e' },
  clockedOut: { label: 'Clocked Out', color: '#ef4444' },
  break: { label: 'On Break', color: '#8b5cf6' },
  event: { label: 'Event', color: '#3b82f6' },
} as const;

export type ActivityType = keyof typeof ACTIVITY_TYPES;

export type ActivityItem = {
  id: string;
  time: string;
  activity: string;
  type: ActivityType;
};

/** Placeholder data — will be replaced with real store data later. */
export const PLACEHOLDER_ACTIVITIES: ActivityItem[] = [
  { id: '1', time: '7:45 AM', activity: 'Clocked in', type: 'clockedIn' },
  { id: '2', time: '10:15 AM', activity: 'Started break', type: 'break' },
  { id: '3', time: '10:30 AM', activity: 'Ended break', type: 'clockedIn' },
  { id: '4', time: '12:00 PM', activity: 'Lunch break', type: 'break' },
  { id: '5', time: '12:45 PM', activity: 'Resumed work', type: 'clockedIn' },
];

export const DAILY_HOURS_GOAL = 8;
