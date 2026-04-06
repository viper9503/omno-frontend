import { Text } from '@/components/ui/text';
import { SettingsGroup, SettingsPage, SettingsRow } from '@/features/settings/components';
import {
  useMyTeam,
  useWorkZones,
  useCreateWorkZone,
  useUpdateWorkZone,
  useDeleteWorkZone,
} from '@/lib/api/hooks';
import type { TeamWorkZonesResponse } from '@/lib/api/types';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetTextInput,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { MapPinIcon, PlusIcon, Trash2Icon } from 'lucide-react-native';
import { useCallback, useRef, useState } from 'react';
import {
  Alert,
  Keyboard,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import MapView, { Circle, Marker, type Region } from 'react-native-maps';
import { useColorScheme } from 'nativewind';
import Slider from '@react-native-community/slider';

const ZONE_COLORS = [
  '#22c55e', '#3b82f6', '#ef4444', '#f59e0b', '#8b5cf6', '#ec4899',
];

const DEFAULT_RADIUS = 200; // meters

export default function WorkZonesScreen() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { data: teamData } = useMyTeam();
  const team = teamData?.team;

  const { data: zones } = useWorkZones(team?.id);
  const createZone = useCreateWorkZone(team?.id);
  const updateZone = useUpdateWorkZone(team?.id);
  const deleteZone = useDeleteWorkZone(team?.id);

  const sheetRef = useRef<BottomSheetModal>(null);
  const mapRef = useRef<MapView>(null);

  // Editor state
  const [editingZone, setEditingZone] = useState<TeamWorkZonesResponse | null>(null);
  const [nameInput, setNameInput] = useState('');
  const [pinLat, setPinLat] = useState(0);
  const [pinLng, setPinLng] = useState(0);
  const [radius, setRadius] = useState(DEFAULT_RADIUS);
  const [selectedColor, setSelectedColor] = useState(ZONE_COLORS[0]);
  const [error, setError] = useState<string | null>(null);

  const sheetBg = isDark ? '#1c1c1e' : '#ffffff';
  const isEditing = editingZone !== null;

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

  function openCreateSheet(region: Region) {
    setEditingZone(null);
    setNameInput('');
    setPinLat(region.latitude);
    setPinLng(region.longitude);
    setRadius(DEFAULT_RADIUS);
    setSelectedColor(ZONE_COLORS[(zones?.length ?? 0) % ZONE_COLORS.length]);
    setError(null);
    sheetRef.current?.present();
  }

  function openEditSheet(zone: TeamWorkZonesResponse) {
    setEditingZone(zone);
    setNameInput(zone.name);
    setPinLat(zone.latitude);
    setPinLng(zone.longitude);
    setRadius(zone.radius);
    setSelectedColor(zone.color);
    setError(null);
    sheetRef.current?.present();
  }

  function handleClose() {
    Keyboard.dismiss();
    sheetRef.current?.dismiss();
  }

  async function handleSave() {
    if (!team || !nameInput.trim()) return;
    setError(null);
    try {
      if (isEditing) {
        await updateZone.mutateAsync({
          zoneId: editingZone.id,
          data: {
            name: nameInput.trim(),
            latitude: pinLat,
            longitude: pinLng,
            radius,
            color: selectedColor,
          },
        });
      } else {
        await createZone.mutateAsync({
          team: team.id,
          name: nameInput.trim(),
          latitude: pinLat,
          longitude: pinLng,
          radius,
          color: selectedColor,
        });
      }
      Keyboard.dismiss();
      sheetRef.current?.dismiss();
    } catch (e) {
      setError((e as Error).message || 'Failed to save zone');
    }
  }

  function handleDelete(zone: TeamWorkZonesResponse) {
    Alert.alert('Delete Zone', `Delete "${zone.name}"? This cannot be undone.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteZone.mutate(zone.id),
      },
    ]);
  }

  function handleAddZone() {
    // Get the current map region and drop a pin in the center
    mapRef.current?.getCamera().then((camera) => {
      openCreateSheet({
        latitude: camera.center.latitude,
        longitude: camera.center.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    });
  }

  const isSaving = createZone.isPending || updateZone.isPending;

  return (
    <>
      <SettingsPage title="Work Zones" backTitle="Team Settings">
        {/* Map preview showing all zones */}
        <View className="overflow-hidden rounded-xl border border-border">
          <View style={styles.mapContainer}>
            <MapView
              ref={mapRef}
              style={StyleSheet.absoluteFillObject}
              mapType="mutedStandard"
              userInterfaceStyle={isDark ? 'dark' : 'light'}
              showsUserLocation
              showsMyLocationButton={false}
              showsCompass={false}
              showsPointsOfInterest={false}
              toolbarEnabled={false}
            >
              {zones?.map((zone) => (
                <Circle
                  key={zone.id}
                  center={{ latitude: zone.latitude, longitude: zone.longitude }}
                  radius={zone.radius}
                  fillColor={zone.color + '26'}
                  strokeColor={zone.color + '99'}
                  strokeWidth={2}
                />
              ))}
            </MapView>
          </View>
        </View>

        {/* Zone list */}
        <SettingsGroup title="Zones">
          {zones && zones.length > 0 ? (
            zones.map((zone, i) => (
              <SettingsRow
                key={zone.id}
                icon={MapPinIcon}
                iconColor={zone.color}
                label={zone.name}
                value={`${Math.round(zone.radius)}m`}
                chevron
                onPress={() => openEditSheet(zone)}
                last={i === zones.length - 1}
              />
            ))
          ) : (
            <SettingsRow
              label="No zones defined"
              value="Tap + to add one"
              last
            />
          )}
        </SettingsGroup>

        <Pressable
          className="flex-row items-center justify-center gap-2 rounded-xl bg-card border border-border p-4"
          onPress={handleAddZone}
        >
          <PlusIcon size={18} color={isDark ? '#fff' : '#000'} />
          <Text className="text-base font-semibold">Add Work Zone</Text>
        </Pressable>
      </SettingsPage>

      {/* Zone editor sheet */}
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
            {/* Header */}
            <View className="mb-4 flex-row items-center justify-between">
              <Pressable onPress={handleClose} hitSlop={8}>
                <Text className="text-[17px] text-[#007AFF]">Cancel</Text>
              </Pressable>
              <Text className="text-[17px] font-semibold text-foreground">
                {isEditing ? 'Edit Zone' : 'New Zone'}
              </Text>
              <Pressable
                onPress={handleSave}
                disabled={!nameInput.trim() || isSaving}
                hitSlop={8}
              >
                <Text
                  className={`text-[17px] font-semibold ${
                    !nameInput.trim() || isSaving ? 'text-[#007AFF]/40' : 'text-[#007AFF]'
                  }`}
                >
                  {isSaving ? 'Saving...' : 'Save'}
                </Text>
              </Pressable>
            </View>

            {/* Map — tap to place pin */}
            <View className="mb-1 overflow-hidden rounded-xl" style={styles.editorMap}>
              <MapView
                style={StyleSheet.absoluteFillObject}
                mapType="mutedStandard"
                userInterfaceStyle={isDark ? 'dark' : 'light'}
                showsUserLocation
                showsMyLocationButton={false}
                showsCompass={false}
                showsPointsOfInterest={false}
                toolbarEnabled={false}
                initialRegion={{
                  latitude: pinLat || 40.7128,
                  longitude: pinLng || -74.006,
                  latitudeDelta: 0.005,
                  longitudeDelta: 0.005,
                }}
                onPress={(e) => {
                  setPinLat(e.nativeEvent.coordinate.latitude);
                  setPinLng(e.nativeEvent.coordinate.longitude);
                }}
              >
                <Marker
                  coordinate={{ latitude: pinLat, longitude: pinLng }}
                />
                <Circle
                  center={{ latitude: pinLat, longitude: pinLng }}
                  radius={radius}
                  fillColor={selectedColor + '26'}
                  strokeColor={selectedColor + '99'}
                  strokeWidth={2}
                />
              </MapView>
            </View>

            <Text className="mb-4 text-center text-xs text-muted-foreground">
              Tap the map to place the zone center.
            </Text>

            {/* Name input */}
            <View className="mb-4 h-11 justify-center rounded-[10px] bg-muted px-1">
              <BottomSheetTextInput
                value={nameInput}
                onChangeText={setNameInput}
                placeholder="Zone Name"
                placeholderTextColor="#999"
                autoCapitalize="words"
                autoCorrect={false}
                returnKeyType="done"
                onSubmitEditing={() => Keyboard.dismiss()}
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

            {/* Radius slider */}
            <View className="mb-4">
              <Text className="mb-1 text-sm text-muted-foreground">
                Radius: {Math.round(radius)}m
              </Text>
              <Slider
                minimumValue={50}
                maximumValue={2000}
                step={10}
                value={radius}
                onValueChange={setRadius}
                minimumTrackTintColor={selectedColor}
                maximumTrackTintColor={isDark ? '#555' : '#ccc'}
              />
            </View>

            {/* Color picker */}
            <View className="mb-2">
              <Text className="mb-2 text-sm text-muted-foreground">Color</Text>
              <View className="flex-row gap-3">
                {ZONE_COLORS.map((color) => (
                  <Pressable
                    key={color}
                    onPress={() => setSelectedColor(color)}
                    style={[
                      styles.colorDot,
                      { backgroundColor: color },
                      selectedColor === color && styles.colorDotSelected,
                    ]}
                  />
                ))}
              </View>
            </View>

            {/* Delete button (edit mode) */}
            {isEditing && (
              <Pressable
                className="mt-4 flex-row items-center justify-center gap-2 rounded-xl bg-destructive/10 p-3"
                onPress={() => {
                  handleClose();
                  handleDelete(editingZone);
                }}
              >
                <Trash2Icon size={16} color="#ef4444" />
                <Text className="text-base font-semibold text-destructive">Delete Zone</Text>
              </Pressable>
            )}

            {error ? (
              <Text className="mt-2 text-sm text-destructive">{error}</Text>
            ) : null}
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    </>
  );
}

const styles = StyleSheet.create({
  mapContainer: {
    height: 200,
  },
  editorMap: {
    height: 200,
  },
  colorDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  colorDotSelected: {
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
});
