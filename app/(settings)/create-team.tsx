import { Text } from '@/components/ui/text';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useCreateTeam } from '@/lib/api/hooks';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, View } from 'react-native';
import { Stack, useRouter } from 'expo-router';

export default function CreateTeamScreen() {
  const router = useRouter();
  const createTeam = useCreateTeam();
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function handleCreate() {
    if (!name.trim()) return;
    setError(null);
    try {
      await createTeam.mutateAsync(name.trim());
      router.back();
    } catch (e) {
      setError((e as Error).message || 'Failed to create team');
    }
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Create Team',
          presentation: 'formSheet',
          headerShown: true,
          headerLeft: () => (
            <Pressable onPress={() => router.back()} hitSlop={8}>
              <Text className="text-[17px] text-[#007AFF]">Cancel</Text>
            </Pressable>
          ),
          headerRight: () => (
            <Pressable
              onPress={handleCreate}
              disabled={!name.trim() || createTeam.isPending}
              hitSlop={8}
            >
              <Text
                className={`text-[17px] font-semibold ${
                  !name.trim() || createTeam.isPending
                    ? 'text-[#007AFF]/40'
                    : 'text-[#007AFF]'
                }`}
              >
                {createTeam.isPending ? 'Creating...' : 'Create'}
              </Text>
            </Pressable>
          ),
          sheetGrabberVisible: false,
          sheetCornerRadius: 12,
        }}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 bg-card"
      >
        <View className="gap-4 px-4 pt-8">
          <View className="gap-1.5">
            <Text className="text-sm font-medium text-muted-foreground">Team Name</Text>
            <Input
              value={name}
              onChangeText={setName}
              placeholder="Enter team name"
              autoFocus
              onSubmitEditing={handleCreate}
              returnKeyType="done"
            />
          </View>
          {error ? (
            <Text className="text-sm text-destructive">{error}</Text>
          ) : null}
        </View>
      </KeyboardAvoidingView>
    </>
  );
}
