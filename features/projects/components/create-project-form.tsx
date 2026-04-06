import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { useProjectsStore } from '@/lib/stores/projects-store';
import { PROJECT_COLORS } from '@/features/types';
import { PlusIcon } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, View } from 'react-native';

export function CreateProjectForm() {
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState(PROJECT_COLORS[0]);
  const addProject = useProjectsStore((s) => s.addProject);

  const handleSubmit = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    addProject(trimmed, selectedColor);
    setName('');
    // Cycle to next color for convenience
    const currentIndex = PROJECT_COLORS.indexOf(selectedColor);
    setSelectedColor(PROJECT_COLORS[(currentIndex + 1) % PROJECT_COLORS.length]);
  };

  return (
    <View className="gap-3">
      <View className="flex-row gap-2">
        <Input
          placeholder="Project name"
          value={name}
          onChangeText={setName}
          className="flex-1"
          onSubmitEditing={handleSubmit}
          returnKeyType="done"
        />
        <Button onPress={handleSubmit} disabled={!name.trim()} className="h-12 w-12">
          <Icon as={PlusIcon} className="text-primary-foreground" size={20} />
        </Button>
      </View>
      <View className="flex-row flex-wrap gap-2">
        {PROJECT_COLORS.map((color) => (
          <Pressable
            key={color}
            onPress={() => setSelectedColor(color)}
            className={`h-8 w-8 items-center justify-center rounded-full ${
              selectedColor === color ? 'border-2 border-foreground' : ''
            }`}
            style={{ backgroundColor: color }}
          />
        ))}
      </View>
    </View>
  );
}
