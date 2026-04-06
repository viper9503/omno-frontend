import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { ChevronRightIcon } from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';

type SettingsRowProps = {
  /** Leading icon */
  icon?: LucideIcon;
  /** Icon background color (iOS-style colored square) */
  iconColor?: string;
  /** Row label */
  label: string;
  /** Secondary text on the right side */
  value?: string;
  /** Custom right-side element (e.g. Switch) */
  right?: ReactNode;
  /** Show chevron indicator (for navigation rows) */
  chevron?: boolean;
  /** Press handler */
  onPress?: () => void;
  /** Destructive style (red text) */
  destructive?: boolean;
  /** Whether this is the last row in its group (hides bottom separator) */
  last?: boolean;
};

export function SettingsRow({
  icon,
  iconColor,
  label,
  value,
  right,
  chevron,
  onPress,
  destructive,
  last,
}: SettingsRowProps) {
  const content = (
    <View className="flex-row items-center px-4 py-3">
      {icon ? (
        <View
          className="mr-3 h-7 w-7 items-center justify-center rounded-md"
          style={{ backgroundColor: iconColor ?? '#8e8e93' }}
        >
          <Icon as={icon} className="text-white" size={16} />
        </View>
      ) : null}
      <View className="flex-1">
        <Text
          className={`text-base ${destructive ? 'text-destructive' : 'text-foreground'}`}
        >
          {label}
        </Text>
      </View>
      {value ? (
        <Text className="mr-1 text-base text-muted-foreground">{value}</Text>
      ) : null}
      {right}
      {chevron ? (
        <Icon as={ChevronRightIcon} className="ml-1 text-muted-foreground" size={16} />
      ) : null}
    </View>
  );

  return (
    <View>
      {onPress ? (
        <Pressable
          onPress={onPress}
          className="active:bg-accent/60"
        >
          {content}
        </Pressable>
      ) : (
        content
      )}
      {!last ? (
        <View className="h-px bg-border" />
      ) : null}
    </View>
  );
}
