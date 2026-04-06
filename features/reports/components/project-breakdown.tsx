import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { useEntriesStore } from '@/lib/stores/entries-store';
import { useProjectsStore } from '@/lib/stores/projects-store';
import { formatDurationShort } from '@/lib/format';
import { useMemo } from 'react';
import { View } from 'react-native';

type ProjectTime = {
  id: string | null;
  name: string;
  color: string;
  duration: number;
  percentage: number;
};

export function ProjectBreakdown() {
  const entries = useEntriesStore((s) => s.entries);
  const projects = useProjectsStore((s) => s.projects);

  const breakdown = useMemo((): ProjectTime[] => {
    const projectMap = new Map<string | null, number>();

    for (const entry of entries) {
      const current = projectMap.get(entry.projectId) ?? 0;
      projectMap.set(entry.projectId, current + entry.duration);
    }

    const total = entries.reduce((sum, e) => sum + e.duration, 0);
    if (total === 0) return [];

    const result: ProjectTime[] = [];

    for (const [projectId, duration] of projectMap) {
      const project = projectId ? projects.find((p) => p.id === projectId) : null;
      result.push({
        id: projectId,
        name: project?.name ?? 'Uncategorized',
        color: project?.color ?? '#9ca3af',
        duration,
        percentage: Math.round((duration / total) * 100),
      });
    }

    return result.sort((a, b) => b.duration - a.duration);
  }, [entries, projects]);

  if (breakdown.length === 0) {
    return (
      <Card>
        <CardHeader className="p-4">
          <CardTitle>
            <Text className="text-lg font-semibold">By Project</Text>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <Text className="text-sm text-muted-foreground">
            Track some time to see project breakdown
          </Text>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="p-4">
        <CardTitle>
          <Text className="text-lg font-semibold">By Project</Text>
        </CardTitle>
      </CardHeader>
      <CardContent className="gap-3 p-4 pt-0">
        {breakdown.map((item) => (
          <View key={item.id ?? 'none'} className="gap-1.5">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                <View className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                <Text className="text-sm font-medium">{item.name}</Text>
              </View>
              <Text className="font-mono text-sm text-blue-500">
                {formatDurationShort(item.duration)}
              </Text>
            </View>
            {/* Progress bar */}
            <View className="h-2 overflow-hidden rounded-full bg-secondary">
              <View
                className="h-full rounded-full"
                style={{
                  backgroundColor: item.color,
                  width: `${item.percentage}%`,
                }}
              />
            </View>
          </View>
        ))}
      </CardContent>
    </Card>
  );
}
