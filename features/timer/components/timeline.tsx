import { Icon } from '@/components/ui/icon';
import { Separator } from '@/components/ui/separator';
import { Text } from '@/components/ui/text';
import {
  ACTIVITY_TYPES,
  type ActivityItem,
  type ActivityType,
} from '@/features/dashboard/constants';
import {
  LogInIcon,
  LogOutIcon,
  CoffeeIcon,
  FlagIcon,
  type LucideIcon,
} from 'lucide-react-native';
import { View } from 'react-native';

const EVENT_ICONS: Record<ActivityType, LucideIcon> = {
  clockedIn: LogInIcon,
  clockedOut: LogOutIcon,
  break: CoffeeIcon,
  event: FlagIcon,
};

type TimelineProps = {
  events: ActivityItem[];
};

/**
 * A modular vertical timeline that renders a list of activity events.
 * Each row is self-contained via `TimelineRow` — the connecting line,
 * dot, and content are all driven by the event data.
 *
 * Designed for easy future animation: each row can be wrapped with
 * Animated.View + entering/layout transitions from react-native-reanimated.
 */
export function Timeline({ events }: TimelineProps) {
  if (events.length === 0) {
    return (
      <View className="items-center justify-center py-8">
        <Text className="text-sm text-muted-foreground">No activity yet</Text>
      </View>
    );
  }

  return (
    <View>
      <View className="flex-row items-center gap-3 pb-4">
        <Separator className="flex-1" />
        <Text className="text-sm text-muted-foreground">My Timeline</Text>
        <Separator className="flex-1" />
      </View>
      <View>
        {events.map((event, index) => (
          <TimelineRow
            key={event.id}
            event={event}
            isFirst={index === 0}
            isLast={index === events.length - 1}
          />
        ))}
      </View>
    </View>
  );
}

type TimelineRowProps = {
  event: ActivityItem;
  isFirst: boolean;
  isLast: boolean;
};

/**
 * A single row in the timeline. Renders:
 * - Time label (left)
 * - Dot with connecting line (center)
 * - Activity description (right)
 */
function TimelineRow({ event, isFirst, isLast }: TimelineRowProps) {
  const typeInfo = ACTIVITY_TYPES[event.type];
  const EventIcon = EVENT_ICONS[event.type];

  return (
    <View className="flex-row">
      {/* Time column */}
      <View className="w-20 items-end justify-center pr-3">
        <Text className="font-mono text-sm text-blue-500">{event.time}</Text>
      </View>

      {/* Dot + line column */}
      <View className="w-8 items-center">
        {/* Line above dot */}
        <View
          className={`w-px flex-1 ${isFirst ? 'bg-transparent' : 'bg-border'}`}
        />
        {/* Dot */}
        <View
          className="h-8 w-8 items-center justify-center rounded-full"
          style={{ backgroundColor: typeInfo.color + '20' }}
        >
          <EventIcon size={14} color={typeInfo.color} />
        </View>
        {/* Line below dot */}
        <View
          className={`w-px flex-1 ${isLast ? 'bg-transparent' : 'bg-border'}`}
        />
      </View>

      {/* Content column */}
      <View className="flex-1 justify-center py-4 pl-3">
        <Text className="text-sm font-medium">{event.activity}</Text>
        <Text className="text-xs text-muted-foreground">{typeInfo.label}</Text>
      </View>
    </View>
  );
}

export { TimelineRow };
