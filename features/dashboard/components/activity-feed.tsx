import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Text } from '@/components/ui/text';
import {
  ACTIVITY_TYPES,
  PLACEHOLDER_ACTIVITIES,
  type ActivityItem,
} from '@/features/dashboard/constants';
import { View } from 'react-native';

/**
 * Displays a color-coded timeline of recent job activity.
 * Strictly presentational — all data is placeholder.
 */
export function ActivityFeed() {
  return (
    <Card>
      <CardHeader className="px-4 pb-0 pt-3">
        <Text className="text-base font-semibold">Job Activity</Text>
      </CardHeader>
      <CardContent className="px-4 pb-3 pt-0">
        <View className="gap-0">
          {PLACEHOLDER_ACTIVITIES.map((item, index) => (
            <ActivityRow
              key={item.id}
              item={item}
              isLast={index === PLACEHOLDER_ACTIVITIES.length - 1}
            />
          ))}
        </View>
      </CardContent>
    </Card>
  );
}

function ActivityRow({ item, isLast }: { item: ActivityItem; isLast: boolean }) {
  const typeInfo = ACTIVITY_TYPES[item.type];

  return (
    <View>
      <View className="flex-row items-center gap-3 py-3">
        <View className="items-center gap-1">
          <View
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: typeInfo.color }}
          />
        </View>
        <View className="flex-1">
          <Text className="text-sm font-medium">{item.activity}</Text>
          <Text className="text-xs text-muted-foreground">{typeInfo.label}</Text>
        </View>
        <Text className="font-mono text-sm text-blue-500">{item.time}</Text>
      </View>
      {!isLast && <Separator />}
    </View>
  );
}
