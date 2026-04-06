import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Text } from '@/components/ui/text';
import { UserIcon } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';
import { View } from 'react-native';

type DashboardHeaderProps = {
  name: string;
};

export function DashboardHeader({ name }: DashboardHeaderProps) {
  return (
    <View className="flex-row items-center justify-between">
      <View className="flex-1 gap-0">
        <Text className="text-lg text-muted-foreground">Good morning</Text>
        <Text className="text-3xl font-bold">{name}</Text>
      </View>
      <Avatar alt="User avatar" className="size-12">
        <AvatarFallback>
          <Icon as={UserIcon} className="text-muted-foreground" size={24} />
        </AvatarFallback>
      </Avatar>
    </View>
  );
}
