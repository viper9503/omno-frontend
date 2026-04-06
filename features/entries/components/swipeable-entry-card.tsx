import { Text } from '@/components/ui/text';
import { useEntriesStore } from '@/lib/stores/entries-store';
import type { TimeEntry } from '@/features/types';
import * as Haptics from 'expo-haptics';
import { TrashIcon } from 'lucide-react-native';
import { useRef } from 'react';
import { Animated, Alert, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { EntryCard } from './entry-card';

type SwipeableEntryCardProps = {
  entry: TimeEntry;
};

export function SwipeableEntryCard({ entry }: SwipeableEntryCardProps) {
  const deleteEntry = useEntriesStore((s) => s.deleteEntry);
  const swipeableRef = useRef<Swipeable>(null);

  const handleDelete = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    Alert.alert('Delete Entry', 'Delete this time entry?', [
      {
        text: 'Cancel',
        style: 'cancel',
        onPress: () => swipeableRef.current?.close(),
      },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteEntry(entry.id),
      },
    ]);
  };

  const renderRightActions = (
    _progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>
  ) => {
    const scale = dragX.interpolate({
      inputRange: [-80, 0],
      outputRange: [1, 0.5],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View
        style={{ transform: [{ scale }] }}
        className="w-20 items-center justify-center rounded-r-xl bg-destructive"
      >
        <TrashIcon size={20} color="white" />
        <Text className="mt-1 text-xs font-medium text-white">Delete</Text>
      </Animated.View>
    );
  };

  return (
    <Swipeable
      ref={swipeableRef}
      renderRightActions={renderRightActions}
      onSwipeableOpen={handleDelete}
      overshootRight={false}
      friction={2}
    >
      <EntryCard entry={entry} />
    </Swipeable>
  );
}
