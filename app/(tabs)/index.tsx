import { PageView } from '@/components/ui/page-view';
import {
  ActivityFeed,
  DashboardHeader,
  HoursProgress,
  ReminderCard,
  TimerStatusCard,
} from '@/features/dashboard/components';
import { DailySummary } from '@/features/reports/components/daily-summary';
import { useElapsedTime } from '@/features/timer/hooks/use-elapsed-time';
import { useTimerStore } from '@/lib/stores/timer-store';
import { useCurrentUser } from '@/lib/api';
import { useRefresh } from '@/lib/api/use-refresh';

export default function HomeScreen() {
  const user = useCurrentUser();
  const refresh = useRefresh();
  const status = useTimerStore((s) => s.status);
  const clockInTime = useTimerStore((s) => s.clockInTime);
  const elapsed = useElapsedTime();

  return (
    <PageView onRefresh={refresh}>
      <DashboardHeader name={user?.name ?? ''} />
      <TimerStatusCard status={status} clockInTime={clockInTime} elapsed={elapsed} />
      <HoursProgress />
      <ReminderCard />
      <DailySummary />
      <ActivityFeed />
    </PageView>
  );
}
