export type Project = {
  id: string;
  name: string;
  color: string;
  createdAt: number;
};

export type TimeEntry = {
  id: string;
  projectId: string | null;
  note: string;
  startTime: number;
  endTime: number;
  duration: number; // in milliseconds
};

export const PROJECT_COLORS: string[] = [
  '#ef4444', // red
  '#f97316', // orange
  '#eab308', // yellow
  '#22c55e', // green
  '#06b6d4', // cyan
  '#3b82f6', // blue
  '#8b5cf6', // violet
  '#ec4899', // pink
];
