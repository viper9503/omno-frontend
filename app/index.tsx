import { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import { useAuthStore } from '@/lib/api/auth-store';
import { ActivityIndicator, View } from 'react-native';
import { hasSeenWelcome } from './welcome';

export default function Index() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);
  const [welcomeChecked, setWelcomeChecked] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    hasSeenWelcome().then((seen) => {
      setShowWelcome(!seen);
      setWelcomeChecked(true);
    });
  }, []);

  if (isLoading || !welcomeChecked) {
    return (
      <View className="bg-background flex-1 items-center justify-center">
        <ActivityIndicator />
      </View>
    );
  }

  if (showWelcome) {
    return <Redirect href={'/welcome' as never} />;
  }

  if (!isAuthenticated) {
    return <Redirect href={'/login' as never} />;
  }

  return <Redirect href="/(tabs)" />;
}
