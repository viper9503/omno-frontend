import { PageView } from '@/components/ui/page-view';
import { Text } from '@/components/ui/text';
import { SettingsGroup, SettingsRow } from '@/features/settings/components';
import { useAuthStore } from '@/lib/api/auth-store';
import { DEV_BYPASS_AUTH } from '@/lib/api/config';
import { useMyTeam, useCreateTeam, useLeaveTeam } from '@/lib/api/hooks';
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetTextInput, BottomSheetView } from '@gorhom/bottom-sheet';
import { useCurrentUser } from '@/lib/api/use-current-user';
import { BellIcon, MoonIcon, UsersIcon, PlusIcon, LogOutIcon, FlaskConicalIcon, UserIcon } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { useCallback, useRef, useState } from 'react';
import { Alert, Keyboard, Linking, Pressable, Switch, View } from 'react-native';
import { useRouter } from 'expo-router';

export default function SettingsScreen() {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const signOut = useAuthStore((s) => s.signOut);
  const pb = useAuthStore((s) => s.pb);
  const currentUser = useCurrentUser();
  const router = useRouter();
  const { data: teamData } = useMyTeam();
  const createTeam = useCreateTeam();
  const leaveTeam = useLeaveTeam();

  const createSheetRef = useRef<BottomSheetModal>(null);
  const [teamNameInput, setTeamNameInput] = useState('');
  const [createError, setCreateError] = useState<string | null>(null);

  const currentUserId = pb?.authStore.record?.id;
  const hasTeam = teamData != null;
  const isOwner = hasTeam && teamData.team.owner === currentUserId;
  const isManager = hasTeam && teamData.membership.role === 'manager';
  const showTeamSettings = hasTeam && (isOwner || isManager);

  const teamSectionTitle = hasTeam ? teamData.team.name.toUpperCase() : 'TEAM';

  function handleSignOut() {
    signOut();
    router.replace('/login' as never);
  }

  const sheetBg = isDark ? '#1c1c1e' : '#ffffff';

  const renderBackdrop = useCallback(
    (props: React.ComponentProps<typeof BottomSheetBackdrop>) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
      />
    ),
    []
  );

  function handleOpenCreateSheet() {
    setTeamNameInput('');
    setCreateError(null);
    createSheetRef.current?.present();
  }

  function handleCloseCreateSheet() {
    Keyboard.dismiss();
    createSheetRef.current?.dismiss();
  }

  async function handleCreateTeam() {
    if (!teamNameInput.trim()) return;
    setCreateError(null);
    try {
      await createTeam.mutateAsync(teamNameInput.trim());
      Keyboard.dismiss();
      createSheetRef.current?.dismiss();
    } catch (e) {
      setCreateError((e as Error).message || 'Failed to create team');
    }
  }

  function handleLeaveTeam() {
    if (!teamData) return;
    const message = isOwner
      ? `Are you sure you want to leave the team? You currently manage ${teamData.team.name}, leaving will delete the entire team and all team data. Continue?`
      : `Are you sure you want to leave ${teamData.team.name}?`;
    Alert.alert(
      'Leave Team',
      message,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Leave',
          style: 'destructive',
          onPress: () => leaveTeam.mutate(teamData.membership.id),
        },
      ]
    );
  }

  return (
    <>
    <PageView contentClassName="gap-8 pt-8">
      <Text className="-mb-4 text-4xl font-bold text-foreground">Settings</Text>
      <SettingsGroup title="General">
        <SettingsRow
          icon={BellIcon}
          iconColor="#FF9500"
          label="Notifications"
          chevron
          onPress={() => router.push('/notifications' as never)}
        />
        <SettingsRow
          icon={MoonIcon}
          iconColor="#5856D6"
          label="Dark Mode"
          right={<Switch value={isDark} onValueChange={toggleColorScheme} />}
          last
        />
      </SettingsGroup>

      <SettingsGroup title={teamSectionTitle}>
        {showTeamSettings && (
          <SettingsRow
            icon={UsersIcon}
            iconColor="#34C759"
            label="Team Settings"
            chevron
            onPress={() => router.push('/team-settings' as never)}
          />
        )}
        {hasTeam && (
          <SettingsRow
            icon={LogOutIcon}
            iconColor="#FF3B30"
            label="Leave Team"
            destructive
            onPress={handleLeaveTeam}
            last
          />
        )}
        {!hasTeam && (
          <SettingsRow
            icon={PlusIcon}
            iconColor="#007AFF"
            label="Create Team"
            chevron
            onPress={handleOpenCreateSheet}
            last
          />
        )}
      </SettingsGroup>

      {!DEV_BYPASS_AUTH && (
        <SettingsGroup title="Account">
          <SettingsRow
            icon={UserIcon}
            iconColor="#8E8E93"
            label="Username"
            value={currentUser?.name ?? ''}
          />
          <SettingsRow
            icon={UsersIcon}
            iconColor="#8E8E93"
            label="Team"
            value={hasTeam ? teamData.team.name : 'None'}
          />
          <SettingsRow
            icon={LogOutIcon}
            iconColor="#FF3B30"
            label="Sign Out"
            destructive
            onPress={handleSignOut}
            last
          />
        </SettingsGroup>
      )}

      <SettingsGroup title="Test">
        <SettingsRow
          icon={FlaskConicalIcon}
          iconColor="#AF52DE"
          label="Test Features"
          chevron
          onPress={() => router.push('/test-features' as never)}
          last
        />
      </SettingsGroup>

      <SettingsGroup title="Legal">
        <SettingsRow
          label="Terms and Conditions"
          chevron
          onPress={() => Linking.openURL('https://jackhric.com')}
        />
        <SettingsRow
          label="Privacy Policy"
          chevron
          onPress={() => Linking.openURL('https://jackhric.com')}
          last
        />
      </SettingsGroup>

      <View className="items-center pb-8 pt-2">
        <Text className="text-xs text-muted-foreground">
          Developed by jackh & manayl
        </Text>
      </View>
    </PageView>

    <BottomSheetModal
      ref={createSheetRef}
      enableDynamicSizing
      enablePanDownToClose={false}
      android_keyboardInputMode="adjustResize"
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: sheetBg }}
      handleComponent={() => null}
    >
      <BottomSheetView>
        <View className="px-4 pb-10 pt-5">
          <View className="mb-2 flex-row items-center justify-between">
            <Pressable onPress={handleCloseCreateSheet} hitSlop={8}>
              <Text className="text-[17px] text-[#007AFF]">Cancel</Text>
            </Pressable>
            <Text className="text-[17px] font-semibold text-foreground">Create Team</Text>
            <Pressable
              onPress={handleCreateTeam}
              disabled={!teamNameInput.trim() || createTeam.isPending}
              hitSlop={8}
            >
              <Text
                className={`text-[17px] font-semibold ${
                  !teamNameInput.trim() || createTeam.isPending
                    ? 'text-[#007AFF]/40'
                    : 'text-[#007AFF]'
                }`}
              >
                {createTeam.isPending ? 'Creating...' : 'Create'}
              </Text>
            </Pressable>
          </View>
          <View className="mt-6">
            <View className="h-11 justify-center rounded-[10px] bg-muted px-1">
              <BottomSheetTextInput
                value={teamNameInput}
                onChangeText={setTeamNameInput}
                placeholder="Team Name"
                placeholderTextColor="#999"
                autoFocus
                autoCapitalize="words"
                autoCorrect={false}
                onSubmitEditing={handleCreateTeam}
                returnKeyType="done"
                clearButtonMode="while-editing"
                style={{
                  height: 44,
                  paddingLeft: 8,
                  paddingRight: 4,
                  fontSize: 17,
                  color: isDark ? '#fff' : '#000',
                }}
              />
            </View>
            <Text className="mt-3 text-center text-xs text-muted-foreground">
              Creating a team will make you the owner. You can then invite members and manage roles from Team Settings.
            </Text>
          </View>
          {createError ? (
            <Text className="mt-2 text-sm text-destructive">{createError}</Text>
          ) : null}
        </View>
      </BottomSheetView>
    </BottomSheetModal>
    </>
  );
}
