import { cn } from '@/lib/utils';
import { useCallback, useState } from 'react';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { RefreshControl, ScrollView, View } from 'react-native';

const TAB_BAR_HEIGHT = 52;

type PageViewProps = {
  /** Use scrollable page (default: true) */
  scroll?: boolean;
  /** Additional className for the scroll content container */
  contentClassName?: string;
  /** Additional className for the outer container */
  className?: string;
  /** Content pinned above the tab bar, outside the scroll area */
  footer?: React.ReactNode;
  /** Pull-to-refresh callback. When provided, enables native pull-to-refresh. */
  onRefresh?: () => void | Promise<void>;
  /** Skip the top safe area inset (use when a native header already provides it). */
  hasHeader?: boolean;
  children: React.ReactNode;
};

/**
 * Shared page wrapper for all screens. Provides consistent padding,
 * background color, safe area insets, and scroll behavior across the app.
 */
export function PageView({
  scroll = true,
  contentClassName,
  className,
  footer,
  onRefresh,
  hasHeader = false,
  children,
}: PageViewProps) {
  const bg = 'bg-background';
  const insets = useSafeAreaInsets();
  const safeEdges = hasHeader ? [] : (['top'] as const);
  const footerOffset = insets.bottom + TAB_BAR_HEIGHT;

  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    if (!onRefresh) return;
    setRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setRefreshing(false);
    }
  }, [onRefresh]);

  if (!scroll) {
    return (
      <SafeAreaView className={cn('flex-1', bg, className)} edges={safeEdges}>
        <View className={cn('flex-1 p-4', className)}>
          {children}
        </View>
        {footer && (
          <View
            className="absolute bottom-0 left-0 right-0 px-4 pb-2"
            style={{ marginBottom: footerOffset }}
          >
            {footer}
          </View>
        )}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className={cn('flex-1', bg)} edges={safeEdges}>
      <ScrollView
        className={cn('flex-1', className)}
        contentContainerClassName={cn(
          'gap-6 p-4 pb-8',
          footer ? 'pb-24' : '',
          contentClassName
        )}
        refreshControl={
          onRefresh ? (
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          ) : undefined
        }
      >
        {children}
      </ScrollView>
      {footer && (
        <View
          className="absolute bottom-0 left-0 right-0 px-4 pb-2"
          style={{ marginBottom: footerOffset }}
        >
          {footer}
        </View>
      )}
    </SafeAreaView>
  );
}
