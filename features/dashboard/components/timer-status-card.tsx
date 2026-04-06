import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import type { ClockStatus } from '@/lib/stores/timer-store';
import { formatDurationShort, formatTime } from '@/lib/format';
import { View } from 'react-native';

type TimerStatusCardProps = {
  status: ClockStatus;
  clockInTime: string | null;
  elapsed: number;
};

const STATUS_LABELS: Record<ClockStatus, string> = {
  clocked_in: 'Working',
  on_break: 'On Break',
  clocked_out: 'Clocked Out',
};

export function TimerStatusCard({ status, clockInTime, elapsed }: TimerStatusCardProps) {
  const active = status !== 'clocked_out';

  return (
    <Card className={active ? 'border-green-500/30 bg-green-50 dark:bg-green-950/20' : ''}>
      <CardContent className="gap-3 px-4 py-3">
        <View className="flex-row items-center justify-between">
          <View className="gap-1">
            <View className="flex-row items-center gap-2">
              <View
                className={`h-2.5 w-2.5 rounded-full ${active ? 'bg-green-500' : 'bg-red-500'}`}
              />
              <Text className="text-sm font-medium text-muted-foreground">Status</Text>
            </View>
            <Text className={`text-lg font-bold ${active ? '' : 'text-red-500'}`}>
              {STATUS_LABELS[status]}
            </Text>
          </View>
          <Badge variant={active ? 'default' : 'destructive'}>
            <Text>{active ? 'Active' : 'Inactive'}</Text>
          </Badge>
        </View>

        <View className="flex-row items-center justify-between">
          <View className="gap-0.5">
            <Text className="text-sm text-muted-foreground">Started at</Text>
            <Text className="text-base font-semibold text-blue-500">
              {clockInTime ? formatTime(new Date(clockInTime).getTime()) : '—'}
            </Text>
          </View>
          <View className="items-end gap-0.5">
            <Text className="text-sm text-muted-foreground">Elapsed</Text>
            <Text className="font-mono text-base font-semibold text-blue-500">
              {active ? formatDurationShort(elapsed) : '0m'}
            </Text>
          </View>
        </View>
      </CardContent>
    </Card>
  );
}
