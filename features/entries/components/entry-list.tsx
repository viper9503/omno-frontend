import { Text } from '@/components/ui/text';
import { Separator } from '@/components/ui/separator';
import { useEntriesStore } from '@/lib/stores/entries-store';
import { formatDate, formatDurationShort } from '@/lib/format';
import { ClockIcon } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';
import { useMemo } from 'react';
import { View } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { SwipeableEntryCard } from './swipeable-entry-card';
import type { TimeEntry } from '@/features/types';

type DayGroup = {
  date: string;
  totalDuration: number;
  entries: TimeEntry[];
};

type ListItem =
  | { type: 'header'; date: string; totalDuration: number }
  | { type: 'entry'; entry: TimeEntry };

function groupEntriesByDay(entries: TimeEntry[]): DayGroup[] {
  const groups = new Map<string, DayGroup>();

  for (const entry of entries) {
    const date = formatDate(entry.startTime);
    const existing = groups.get(date);
    if (existing) {
      existing.entries.push(entry);
      existing.totalDuration += entry.duration;
    } else {
      groups.set(date, {
        date,
        totalDuration: entry.duration,
        entries: [entry],
      });
    }
  }

  return Array.from(groups.values());
}

function flattenGroups(groups: DayGroup[]): ListItem[] {
  const items: ListItem[] = [];
  for (const group of groups) {
    items.push({ type: 'header', date: group.date, totalDuration: group.totalDuration });
    for (const entry of group.entries) {
      items.push({ type: 'entry', entry });
    }
  }
  return items;
}

export function EntryList() {
  const entries = useEntriesStore((s) => s.entries);

  const listItems = useMemo(() => {
    const groups = groupEntriesByDay(entries);
    return flattenGroups(groups);
  }, [entries]);

  if (entries.length === 0) {
    return (
      <View className="flex-1 items-center justify-center gap-3 py-12">
        <Icon as={ClockIcon} className="text-muted-foreground" size={48} />
        <Text className="text-lg text-muted-foreground">No entries yet</Text>
        <Text className="text-sm text-muted-foreground">
          Start a timer to record your first entry
        </Text>
      </View>
    );
  }

  return (
    <FlashList
      data={listItems}
      contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
      getItemType={(item) => item.type}
      keyExtractor={(item) =>
        item.type === 'header' ? `header-${item.date}` : item.entry.id
      }
      renderItem={({ item }) => {
        if (item.type === 'header') {
          return (
            <View className="gap-2 pb-2 pt-4">
              <View className="flex-row items-center justify-between px-1">
                <Text className="text-sm font-semibold text-muted-foreground">{item.date}</Text>
                <Text className="font-mono text-sm text-blue-500">
                  {formatDurationShort(item.totalDuration)}
                </Text>
              </View>
              <Separator />
            </View>
          );
        }
        return (
          <View className="py-1">
            <SwipeableEntryCard entry={item.entry} />
          </View>
        );
      }}
    />
  );
}
