import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useEntriesStore } from '@/lib/stores/entries-store';
import { useProjectsStore } from '@/lib/stores/projects-store';
import type { TimeEntry } from '@/features/types';
import { formatDurationShort, formatTime } from '@/lib/format';
import { TrashIcon } from 'lucide-react-native';
import { Alert, View } from 'react-native';

type EntryCardProps = {
  entry: TimeEntry;
};

export function EntryCard({ entry }: EntryCardProps) {
  const getProject = useProjectsStore((s) => s.getProject);
  const deleteEntry = useEntriesStore((s) => s.deleteEntry);

  const project = entry.projectId ? getProject(entry.projectId) : null;

  const handleDelete = () => {
    Alert.alert('Delete Entry', 'Delete this time entry?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteEntry(entry.id) },
    ]);
  };

  return (
    <Card>
      <CardContent className="flex-row items-center gap-3 p-4">
        {project ? (
          <View className="h-3 w-3 rounded-full" style={{ backgroundColor: project.color }} />
        ) : (
          <View className="h-3 w-3 rounded-full bg-muted-foreground" />
        )}
        <View className="flex-1">
          <Text className="text-base font-medium">
            {entry.note || project?.name || 'Untitled'}
          </Text>
          <Text className="text-sm text-blue-500">
            {formatTime(entry.startTime)} – {formatTime(entry.endTime)}
          </Text>
        </View>
        <Text className="font-mono text-base font-semibold text-blue-500">
          {formatDurationShort(entry.duration)}
        </Text>
        <Button variant="ghost" size="icon" onPress={handleDelete}>
          <Icon as={TrashIcon} className="text-muted-foreground" size={16} />
        </Button>
      </CardContent>
    </Card>
  );
}
