import { CardContent } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { formatDuration, formatTime } from '@/lib/format';
import { THEME } from '@/lib/theme';
import type { ClockStatus } from '@/lib/stores/timer-store';
import { useEffect } from 'react';
import { useColorScheme } from 'nativewind';
import { View } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

type StatusCardProps = {
  status: ClockStatus;
  clockInTime: string | null;
  elapsed: number;
  /** When true, uses a solid background instead of transparent when inactive. */
  opaque?: boolean;
};

const STATUS_LABELS: Record<ClockStatus, string> = {
  clocked_in: 'Working',
  on_break: 'On Break',
  clocked_out: 'Not Clocked In',
};

const ACTIVE_BG = '#22c55e'; // green-500
const INACTIVE_BG = 'transparent';
const ACTIVE_BORDER = 'rgba(34,197,94,0.3)';

const TIMING_CONFIG = { duration: 200 };

export function StatusCard({ status, clockInTime, elapsed, opaque }: StatusCardProps) {
  const { colorScheme } = useColorScheme();
  const inactiveBorder = colorScheme === 'dark' ? THEME.dark.border : THEME.light.border;
  const inactiveBg = opaque
    ? colorScheme === 'dark' ? '#000000' : '#ffffff'
    : INACTIVE_BG;
  const active = status !== 'clocked_out';
  const progress = useSharedValue(active ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(active ? 1 : 0, TIMING_CONFIG);
  }, [active]);

  const cardStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(progress.value, [0, 1], [inactiveBg, ACTIVE_BG]),
    borderColor: interpolateColor(progress.value, [0, 1], [inactiveBorder, ACTIVE_BORDER]),
    borderWidth: 1,
    borderRadius: 12,
  }));

  const activeTextStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
  }));

  const inactiveTextStyle = useAnimatedStyle(() => ({
    opacity: 1 - progress.value,
  }));

  return (
    <Animated.View style={cardStyle}>
      <CardContent className="gap-2 px-5 py-4">
        <View className="flex-row items-center justify-between">
          <Text
            className={`text-base font-semibold ${active ? 'text-white/80' : 'text-muted-foreground'}`}
          >
            {STATUS_LABELS[status]}
          </Text>
          <Animated.View style={activeTextStyle}>
            {active && clockInTime && (
              <Text className="text-sm text-white/60">
                Started: {formatTime(new Date(clockInTime).getTime())}
              </Text>
            )}
          </Animated.View>
        </View>

        <View>
          <Animated.View style={[{ position: 'absolute' }, inactiveTextStyle]}>
            <Text className="text-5xl font-bold tracking-tight text-muted-foreground/40">
              {formatDuration(0)}
            </Text>
          </Animated.View>
          <Animated.View style={activeTextStyle}>
            <Text className="text-5xl font-bold tracking-tight text-white">
              {formatDuration(elapsed)}
            </Text>
          </Animated.View>
        </View>
      </CardContent>
    </Animated.View>
  );
}
