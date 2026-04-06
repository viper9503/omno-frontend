import { View } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Clock } from 'lucide-react-native';

const WELCOME_SEEN_KEY = 'omno_welcome_seen';

export async function hasSeenWelcome(): Promise<boolean> {
  const value = await AsyncStorage.getItem(WELCOME_SEEN_KEY);
  return value === 'true';
}

export default function WelcomeScreen() {
  const router = useRouter();

  async function handleContinue() {
    await AsyncStorage.setItem(WELCOME_SEEN_KEY, 'true');
    router.replace('/');
  }

  return (
    <View className="bg-background flex-1 items-center justify-center px-8">
      {/* Logo */}
      <View className="bg-primary mb-6 h-24 w-24 items-center justify-center rounded-3xl">
        <Icon as={Clock} className="text-primary-foreground" size={48} />
      </View>

      <Text variant="h1" className="mb-3">
        omno
      </Text>

      <Text variant="lead" className="mb-4 text-center">
        Time tracking, simplified.
      </Text>

      <Text variant="muted" className="mb-12 max-w-xs text-center leading-6">
        Track your hours, manage projects, and stay on top of your work — all in one place.
      </Text>

      <View className="w-full max-w-sm">
        <Button size="lg" onPress={handleContinue}>
          <Text>Continue</Text>
        </Button>
      </View>
    </View>
  );
}
