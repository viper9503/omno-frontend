import { Text } from '@/components/ui/text';
import { useProjectsStore } from '@/lib/stores/projects-store';
import { FolderIcon } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';
import { View } from 'react-native';
import { ProjectCard } from './project-card';

export function ProjectList() {
  const projects = useProjectsStore((s) => s.projects);

  if (projects.length === 0) {
    return (
      <View className="flex-1 items-center justify-center gap-3 py-12">
        <Icon as={FolderIcon} className="text-muted-foreground" size={48} />
        <Text className="text-lg text-muted-foreground">No projects yet</Text>
        <Text className="text-sm text-muted-foreground">
          Create your first project above to start organizing time
        </Text>
      </View>
    );
  }

  return (
    <View className="gap-3">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </View>
  );
}
