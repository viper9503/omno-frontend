import { Text } from '@/components/ui/text';
import { useProjectsStore } from '@/lib/stores/projects-store';
import { FolderIcon } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';
import { Pressable, ScrollView, View } from 'react-native';

type ProjectPickerProps = {
  projectId: string | null;
  onSelectProject: (id: string | null) => void;
};

export function ProjectPicker({ projectId, onSelectProject }: ProjectPickerProps) {
  const projects = useProjectsStore((s) => s.projects);

  if (projects.length === 0) {
    return (
      <View className="flex-row items-center justify-center gap-2 py-2">
        <Icon as={FolderIcon} className="text-muted-foreground" size={16} />
        <Text className="text-sm text-muted-foreground">
          Add a project in the Projects tab to categorize time
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="gap-2 px-4 py-2"
    >
      <Pressable
        onPress={() => onSelectProject(null)}
        className={`rounded-full px-4 py-2 ${
          projectId === null ? 'bg-primary' : 'bg-secondary'
        }`}
      >
        <Text
          className={`text-sm font-medium ${
            projectId === null ? 'text-primary-foreground' : 'text-secondary-foreground'
          }`}
        >
          No project
        </Text>
      </Pressable>
      {projects.map((project) => (
        <Pressable
          key={project.id}
          onPress={() => onSelectProject(project.id)}
          className={`flex-row items-center gap-2 rounded-full px-4 py-2 ${
            projectId === project.id ? 'bg-primary' : 'bg-secondary'
          }`}
        >
          <View className="h-3 w-3 rounded-full" style={{ backgroundColor: project.color }} />
          <Text
            className={`text-sm font-medium ${
              projectId === project.id ? 'text-primary-foreground' : 'text-secondary-foreground'
            }`}
          >
            {project.name}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}
