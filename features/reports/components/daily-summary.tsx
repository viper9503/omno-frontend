import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { useEntriesStore } from '@/lib/stores/entries-store';
import { formatDurationShort } from '@/lib/format';
import { useMemo } from 'react';
import { View } from 'react-native';

export function DailySummary() {
  const entries = useEntriesStore((s) => s.entries);

  const stats = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());

    let todayMs = 0;
    let weekMs = 0;
    let totalMs = 0;

    for (const entry of entries) {
      totalMs += entry.duration;
      if (entry.startTime >= today.getTime()) {
        todayMs += entry.duration;
      }
      if (entry.startTime >= weekStart.getTime()) {
        weekMs += entry.duration;
      }
    }

    return { todayMs, weekMs, totalMs, entryCount: entries.length };
  }, [entries]);

  return (
    <View className="gap-3">
      <View className="flex-row gap-3">
        <StatCard title="Today" value={formatDurationShort(stats.todayMs)} />
        <StatCard title="This Week" value={formatDurationShort(stats.weekMs)} />
      </View>
      <View className="flex-row gap-3">
        <StatCard title="All Time" value={formatDurationShort(stats.totalMs)} />
        <StatCard title="Entries" value={stats.entryCount.toString()} />
      </View>
    </View>
  );
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <Card className="flex-1">
      <CardHeader className="px-4 pb-0 pt-3">
        <Text className="text-sm text-muted-foreground">{title}</Text>
      </CardHeader>
      <CardContent className="px-4 pb-3 pt-0">
        <Text className="text-2xl font-bold text-blue-500">{value}</Text>
      </CardContent>
    </Card>
  );
}
