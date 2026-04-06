import { PageView } from '@/components/ui/page-view';
import { useTheme } from '@react-navigation/native';
import { Stack } from 'expo-router';
import type { ReactNode } from 'react';

type SettingsPageProps = {
  /** The title shown in the navigation header. */
  title: string;
  /** The back button label. Defaults to "Settings". */
  backTitle?: string;
  /** Pull-to-refresh callback. */
  onRefresh?: () => void | Promise<void>;
  children: ReactNode;
};

/**
 * Shared wrapper for nested settings screens.
 * Configures the native stack header and provides the standard
 * grouped PageView layout used across all settings sub-pages.
 */
export function SettingsPage({ title, backTitle = 'Settings', onRefresh, children }: SettingsPageProps) {
  const { colors } = useTheme();

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title,
          headerBackTitle: backTitle,
          headerTintColor: '#007AFF',
          headerTitleStyle: { color: colors.text },
        }}
      />
      <PageView hasHeader contentClassName="gap-8 pt-8" onRefresh={onRefresh}>
        {children}
      </PageView>
    </>
  );
}
