import { Icon } from '@/components/ui/icon';
import { Separator } from '@/components/ui/separator';
import { Text } from '@/components/ui/text';
import { ClockIcon } from 'lucide-react-native';
import { View } from 'react-native';

export function TimelinePlaceholder() {
  return (
    <View className="flex-1 gap-4">
      <View className="flex-row items-center gap-3">
        <Separator className="flex-1" />
        <Text className="text-sm text-muted-foreground">My Timeline</Text>
        <Separator className="flex-1" />
      </View>

      <View className="flex-1 items-center justify-center gap-3 py-8">
        <Icon as={ClockIcon} className="text-muted-foreground/40" size={48} />
        <Text className="text-base font-medium text-muted-foreground">Timeline coming soon</Text>
        <Text className="text-center text-sm text-muted-foreground/60">
          Your activity timeline will appear here
        </Text>
      </View>
    </View>
  );
}
