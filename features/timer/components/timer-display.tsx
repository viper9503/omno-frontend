import { Text } from '@/components/ui/text';
import { formatDuration } from '@/lib/format';
import { View } from 'react-native';

type TimerDisplayProps = {
  elapsed: number;
  active: boolean;
};

export function TimerDisplay({ elapsed, active }: TimerDisplayProps) {
  return (
    <View className="items-center py-12">
      <Text
        className={`font-mono text-6xl font-bold tracking-wider ${
          active ? 'text-blue-500' : 'text-blue-500/40'
        }`}
      >
        {formatDuration(elapsed)}
      </Text>
    </View>
  );
}
