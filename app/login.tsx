import { useState } from 'react';
import { View, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Text } from '@/components/ui/text';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Separator } from '@/components/ui/separator';
import { useAuthStore } from '@/lib/api/auth-store';
import { queryClient } from '@/lib/api/query-client';
import { Clock } from 'lucide-react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const signIn = useAuthStore((s) => s.signIn);
  const router = useRouter();

  async function handleSignIn() {
    if (!email.trim() || !password) return;

    setLoading(true);
    setError(null);
    try {
      await signIn(email.trim(), password);
      await queryClient.invalidateQueries();
      router.replace('/(tabs)' as never);
    } catch (e) {
      const msg = (e as Error).message ?? '';
      if (msg.includes('Failed to fetch') || msg.includes('Network')) {
        setError('Unable to reach server');
      } else {
        setError('Invalid email or password');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="bg-background flex-1"
    >
      <View className="flex-1 items-center justify-center px-6">
        {/* Logo */}
        <View className="bg-primary mb-4 h-20 w-20 items-center justify-center rounded-2xl">
          <Icon as={Clock} className="text-primary-foreground" size={40} />
        </View>

        <Text variant="h3" className="mb-2">
          omno
        </Text>
        <Text variant="muted" className="mb-8">
          Sign in to continue
        </Text>

        {error && (
          <Text className="text-destructive mb-4 text-sm">{error}</Text>
        )}

        <View className="w-full max-w-sm gap-4">
          <Input
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            textContentType="emailAddress"
            autoComplete="email"
          />
          <Input
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            textContentType="password"
            autoComplete="password"
            onSubmitEditing={handleSignIn}
          />
          <Button
            onPress={handleSignIn}
            disabled={loading || !email.trim() || !password}
          >
            <Text>{loading ? 'Signing in…' : 'Sign in'}</Text>
          </Button>

          {/* Divider */}
          <View className="flex-row items-center gap-3">
            <Separator className="flex-1" />
            <Text variant="muted">or continue with</Text>
            <Separator className="flex-1" />
          </View>

          {/* Social login buttons */}
          <View className="gap-3">
            <Button variant="outline" onPress={() => {}}>
              <Ionicons name="logo-apple" size={20} color="#fff" />
              <Text>Continue with Apple</Text>
            </Button>
            <Button variant="outline" onPress={() => {}}>
              <Ionicons name="logo-google" size={20} color="#4285F4" />
              <Text>Continue with Google</Text>
            </Button>
            <Button variant="outline" onPress={() => {}}>
              <FontAwesome name="facebook" size={20} color="#1877F2" />
              <Text>Continue with Facebook</Text>
            </Button>
          </View>

          {/* Register */}
          <View className="mt-2 flex-row items-center justify-center gap-1">
            <Text variant="muted">Don't have an account?</Text>
            <Button variant="link" className="p-0" onPress={() => {}}>
              <Text>Register</Text>
            </Button>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
