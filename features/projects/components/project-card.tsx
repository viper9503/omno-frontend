import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useEntriesStore } from '@/lib/stores/entries-store';
import { useProjectsStore } from '@/lib/stores/projects-store';
import type { Project } from '@/features/types';
import { formatDurationShort } from '@/lib/format';
import { TrashIcon } from 'lucide-react-native';
import { Alert, View } from 'react-native';

type ProjectCardProps = {
  project: Project;
};

export function ProjectCard({ project }: ProjectCardProps) {
  const deleteProject = useProjectsStore((s) => s.deleteProject);
  const getTotalDuration = useEntriesStore((s) => s.getTotalDuration);

  const totalTime = getTotalDuration(project.id);

  const handleDelete = () => {
    Alert.alert('Delete Project', `Delete "${project.name}"? Time entries will keep their data.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteProject(project.id) },
    ]);
  };

  return (
    <Card>
      <CardContent className="flex-row items-center gap-3 p-4">
        <View className="h-4 w-4 rounded-full" style={{ backgroundColor: project.color }} />
        <View className="flex-1">
          <Text className="text-base font-semibold">{project.name}</Text>
          <Text className={`text-sm ${totalTime > 0 ? 'text-blue-500' : 'text-muted-foreground'}`}>
            {totalTime > 0 ? formatDurationShort(totalTime) + ' tracked' : 'No time tracked'}
          </Text>
        </View>
        <Button variant="ghost" size="icon" onPress={handleDelete}>
          <Icon as={TrashIcon} className="text-muted-foreground" size={18} />
        </Button>
      </CardContent>
    </Card>
  );
}
