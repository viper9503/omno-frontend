import { PageView } from '@/components/ui/page-view';
import { PLACEHOLDER_ACTIVITIES } from '@/features/dashboard/constants';
import { ClockActions } from '@/features/timer/components/clock-actions';
import { MapBackground } from '@/features/timer/components/map-background';
import { StatusCard } from '@/features/timer/components/status-card';
import { Timeline } from '@/features/timer/components/timeline';
import { useElapsedTime } from '@/features/timer/hooks/use-elapsed-time';
import { EXPERIMENTAL_MAP_CLOCK_BG } from '@/lib/api/config';
import { useTimerStore } from '@/lib/stores/timer-store';
import { useCreateEvent } from '@/lib/api';
import { useRefresh } from '@/lib/api/use-refresh';
import { ClockEventsTypeOptions } from '@/lib/api/types';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TAB_BAR_HEIGHT = 52;

export default function ClockScreen() {
  const refresh = useRefresh();
  const status = useTimerStore((s) => s.status);
  const clockInTime = useTimerStore((s) => s.clockInTime);
  const elapsed = useElapsedTime();
  const insets = useSafeAreaInsets();

  const createEvent = useCreateEvent();

  const handleClockIn = () => {
    createEvent.mutate({
      type: ClockEventsTypeOptions.clock_in,
    });
  };

  const handleClockOut = () => {
    createEvent.mutate({
      type: ClockEventsTypeOptions.clock_out,
    });
  };

  const isClockedIn = status !== 'clocked_out';

  if (EXPERIMENTAL_MAP_CLOCK_BG) {
    const footerOffset = insets.bottom + TAB_BAR_HEIGHT;

    return (
      <MapBackground>
        <View
          className="flex-1 justify-between p-4"
          style={{ paddingTop: insets.top, paddingBottom: footerOffset + 28 }}
        >
          <StatusCard status={status} clockInTime={clockInTime} elapsed={elapsed} opaque />
          <ClockActions
            isClockedIn={isClockedIn}
            loading={createEvent.isPending}
            onClockIn={handleClockIn}
            onClockOut={handleClockOut}
          />
        </View>
      </MapBackground>
    );
  }

  return (
    <PageView
      footer={
        <ClockActions
          isClockedIn={isClockedIn}
          loading={createEvent.isPending}
          onClockIn={handleClockIn}
          onClockOut={handleClockOut}
        />
      }
      onRefresh={refresh}
    >
      <StatusCard status={status} clockInTime={clockInTime} elapsed={elapsed} />
      <Timeline events={PLACEHOLDER_ACTIVITIES} />
    </PageView>
  );
}
