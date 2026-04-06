import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import * as Haptics from 'expo-haptics';
import { LogInIcon, LogOutIcon } from 'lucide-react-native';
import { View } from 'react-native';

type TimerControlsProps = {
  isClockedIn: boolean;
  loading: boolean;
  onClockIn: () => void;
  onClockOut: () => void;
};

export function TimerControls({ isClockedIn, loading, onClockIn, onClockOut }: TimerControlsProps) {
  const handleToggle = () => {
    if (isClockedIn) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onClockOut();
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onClockIn();
    }
  };

  return (
    <View className="flex-row items-center justify-center gap-4">
      <Button
        size="lg"
        variant={isClockedIn ? 'destructive' : 'default'}
        onPress={handleToggle}
        disabled={loading}
        className="h-16 w-16 rounded-full"
      >
        <Icon
          as={isClockedIn ? LogOutIcon : LogInIcon}
          className={isClockedIn ? 'text-white' : 'text-primary-foreground'}
          size={28}
        />
      </Button>
    </View>
  );
}
