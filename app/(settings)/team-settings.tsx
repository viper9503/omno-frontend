import { Text } from '@/components/ui/text';
import { SettingsGroup, SettingsPage, SettingsRow } from '@/features/settings/components';
import { useMyTeam, useUpdateTeamName, useTeamSettings, useUpdateTeamSettings, useLeaveTeam } from '@/lib/api/hooks';
import { useAuthStore } from '@/lib/api/auth-store';
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetTextInput, BottomSheetView } from '@gorhom/bottom-sheet';
import { PencilIcon, UserPlusIcon, UsersIcon, Trash2Icon, MapPinIcon, LocateFixedIcon, MapIcon } from 'lucide-react-native';
import { useCallback, useRef, useState } from 'react';
import { Alert, Keyboard, Pressable, Switch, View } from 'react-native';
import { useColorScheme } from 'nativewind';
import { useRouter } from 'expo-router';

export default function TeamSettingsScreen() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { data: teamData } = useMyTeam();
  const updateTeamName = useUpdateTeamName();
  const pb = useAuthStore((s) => s.pb);
  const currentUserId = pb?.authStore.record?.id;

  const sheetRef = useRef<BottomSheetModal>(null);
  const [nameInput, setNameInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const leaveTeam = useLeaveTeam();

  const team = teamData?.team;
  const isOwner = team != null && team.owner === currentUserId;

  const { data: teamSettings } = useTeamSettings(team?.id);
  const updateSettings = useUpdateTeamSettings(team?.id);

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

  function handleOpenSheet() {
    if (!team) return;
    setNameInput(team.name);
    setError(null);
    sheetRef.current?.present();
  }

  function handleCloseSheet() {
    Keyboard.dismiss();
    sheetRef.current?.dismiss();
  }

  async function handleSave() {
    if (!team || !nameInput.trim()) return;
    setError(null);
    try {
      await updateTeamName.mutateAsync({
        teamId: team.id,
        name: nameInput.trim(),
      });
      Keyboard.dismiss();
      sheetRef.current?.dismiss();
    } catch (e) {
      setError((e as Error).message || 'Failed to update team name');
    }
  }

  function handleDeleteTeam() {
    if (!teamData) return;
    Alert.alert(
      'Delete Team',
      `Are you sure you want to delete ${teamData.team.name}? This will remove all members and permanently delete all team data. This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => leaveTeam.mutate(teamData.membership.id),
        },
      ]
    );
  }

  return (
    <>
      <SettingsPage title="Team Settings" backTitle="Settings">
        <SettingsGroup title="Team">
          <SettingsRow
            icon={PencilIcon}
            iconColor="#007AFF"
            label="Team Name"
            value={team?.name ?? ''}
            chevron={isOwner}
            onPress={isOwner ? handleOpenSheet : undefined}
          />
          <SettingsRow
            icon={UsersIcon}
            iconColor="#34C759"
            label="Members"
            chevron
          />
          <SettingsRow
            icon={UserPlusIcon}
            iconColor="#5856D6"
            label="Invite Members"
            chevron
            onPress={() => router.push('/invite-members' as never)}
            last
          />
        </SettingsGroup>

        {isOwner && teamSettings && (
          <SettingsGroup title="Location" footer="When enabled, team members must be within a work zone to clock in.">
            <SettingsRow
              icon={MapIcon}
              iconColor="#34C759"
              label="Work Zones"
              chevron
              onPress={() => router.push('/work-zones' as never)}
            />
            <SettingsRow
              icon={MapPinIcon}
              iconColor="#FF9500"
              label="Require Work Zone"
              right={
                <Switch
                  value={teamSettings.require_work_zone}
                  onValueChange={(value) =>
                    updateSettings.mutate({
                      settingsId: teamSettings.id,
                      data: { require_work_zone: value },
                    })
                  }
                />
              }
            />
            <SettingsRow
              icon={LocateFixedIcon}
              iconColor="#5856D6"
              label="Track Clock Location"
              right={
                <Switch
                  value={teamSettings.track_clock_location}
                  onValueChange={(value) =>
                    updateSettings.mutate({
                      settingsId: teamSettings.id,
                      data: { track_clock_location: value },
                    })
                  }
                />
              }
              last
            />
          </SettingsGroup>
        )}

        {isOwner && (
          <SettingsGroup title="Danger Zone">
            <SettingsRow
              icon={Trash2Icon}
              iconColor="#FF3B30"
              label="Delete Team"
              destructive
              onPress={handleDeleteTeam}
              last
            />
          </SettingsGroup>
        )}
      </SettingsPage>

      <BottomSheetModal
        ref={sheetRef}
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
              <Pressable onPress={handleCloseSheet} hitSlop={8}>
                <Text className="text-[17px] text-[#007AFF]">Cancel</Text>
              </Pressable>
              <Text className="text-[17px] font-semibold text-foreground">Edit Team Name</Text>
              <Pressable
                onPress={handleSave}
                disabled={!nameInput.trim() || updateTeamName.isPending}
                hitSlop={8}
              >
                <Text
                  className={`text-[17px] font-semibold ${
                    !nameInput.trim() || updateTeamName.isPending
                      ? 'text-[#007AFF]/40'
                      : 'text-[#007AFF]'
                  }`}
                >
                  {updateTeamName.isPending ? 'Saving...' : 'Save'}
                </Text>
              </Pressable>
            </View>
            <View className="mt-6">
              <View className="h-11 justify-center rounded-[10px] bg-muted px-1">
                <BottomSheetTextInput
                  value={nameInput}
                  onChangeText={setNameInput}
                  placeholder="Team Name"
                  placeholderTextColor="#999"
                  autoFocus
                  autoCapitalize="words"
                  autoCorrect={false}
                  onSubmitEditing={handleSave}
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
                The team name is visible to all members.
              </Text>
            </View>
            {error ? (
              <Text className="mt-2 text-sm text-destructive">{error}</Text>
            ) : null}
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    </>
  );
}
