import { Separator } from '@/components/ui/separator';
import { Text } from '@/components/ui/text';
import { useEntriesStore } from '@/lib/stores/entries-store';
import { EntryCard } from '@/features/entries/components/entry-card';
import { formatDurationShort } from '@/lib/format';
import { ClockIcon } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';
import { useMemo } from 'react';
import { View } from 'react-native';

type DayEntriesProps = {
  dateString: string; // YYYY-MM-DD
};

function parseDate(dateString: string): Date {
  const [y, m, d] = dateString.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function formatDisplayDate(dateString: string): string {
  const date = parseDate(dateString);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';

  return date.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });
}

export function DayEntries({ dateString }: DayEntriesProps) {
  const entries = useEntriesStore((s) => s.entries);

  const dayEntries = useMemo(() => {
    const date = parseDate(dateString);
    return entries.filter((e) => {
      const d = new Date(e.startTime);
      return (
        d.getFullYear() === date.getFullYear() &&
        d.getMonth() === date.getMonth() &&
        d.getDate() === date.getDate()
      );
    });
  }, [entries, dateString]);

  const totalDuration = dayEntries.reduce((sum, e) => sum + e.duration, 0);

  return (
    <View className="gap-3">
      <View className="flex-row items-center justify-between">
        <Text className="text-base font-semibold">{formatDisplayDate(dateString)}</Text>
        {totalDuration > 0 && (
          <Text className="font-mono text-sm text-blue-500">
            {formatDurationShort(totalDuration)}
          </Text>
        )}
      </View>
      <Separator />
      {dayEntries.length === 0 ? (
        <View className="items-center gap-2 py-8">
          <Icon as={ClockIcon} className="text-muted-foreground" size={32} />
          <Text className="text-sm text-muted-foreground">No entries for this day</Text>
        </View>
      ) : (
        <View className="gap-2">
          {dayEntries.map((entry) => (
            <EntryCard key={entry.id} entry={entry} />
          ))}
        </View>
      )}
    </View>
  );
}
