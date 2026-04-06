import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import * as Haptics from 'expo-haptics';
import { LogInIcon, LogOutIcon } from 'lucide-react-native';
import { useEffect } from 'react';
import { Pressable, View } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';

type ClockActionsProps = {
  isClockedIn: boolean;
  loading: boolean;
  onClockIn: () => void;
  onClockOut: () => void;
};

const CLOCK_IN_BG = '#22c55e'; // green-500
const CLOCK_OUT_BG = '#ef4444'; // red-500

const TIMING_CONFIG = { duration: 350 };

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function ClockActions({ isClockedIn, loading, onClockIn, onClockOut }: ClockActionsProps) {
  const progress = useSharedValue(isClockedIn ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(isClockedIn ? 1 : 0, TIMING_CONFIG);
  }, [isClockedIn]);

  const handleToggle = () => {
    if (isClockedIn) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onClockOut();
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onClockIn();
    }
  };

  const buttonStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(progress.value, [0, 1], [CLOCK_IN_BG, CLOCK_OUT_BG]),
    height: 56,
    borderRadius: 12,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    gap: 8,
    opacity: loading ? 0.5 : 1,
  }));

  const label = loading ? 'Loading…' : isClockedIn ? 'Clock Out' : 'Clock In';

  return (
    <View className="gap-3">
      <AnimatedPressable
        style={buttonStyle}
        onPress={handleToggle}
        disabled={loading}
      >
        {isClockedIn ? (
          <Animated.View key="out" entering={FadeIn.duration(250)} exiting={FadeOut.duration(150)}>
            <Icon as={LogOutIcon} className="text-white" size={20} />
          </Animated.View>
        ) : (
          <Animated.View key="in" entering={FadeIn.duration(250)} exiting={FadeOut.duration(150)}>
            <Icon as={LogInIcon} className="text-white" size={20} />
          </Animated.View>
        )}
        <Text className="text-lg font-semibold text-white">{label}</Text>
      </AnimatedPressable>
    </View>
  );
}
