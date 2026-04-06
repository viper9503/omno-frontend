import { Text } from '@/components/ui/text';
import type { ReactNode } from 'react';
import { View } from 'react-native';

type SettingsGroupProps = {
  /** Uppercase section header like iOS Settings */
  title?: string;
  /** Footer text below the group */
  footer?: string;
  children: ReactNode;
};

export function SettingsGroup({ title, footer, children }: SettingsGroupProps) {
  return (
    <View className="gap-1.5">
      {title ? (
        <Text className="px-4 text-xs font-normal uppercase tracking-wide text-muted-foreground">
          {title}
        </Text>
      ) : null}
      <View className="overflow-hidden rounded-xl border border-border bg-card shadow-sm shadow-black/5">{children}</View>
      {footer ? (
        <Text className="px-4 text-xs text-muted-foreground">{footer}</Text>
      ) : null}
    </View>
  );
}
