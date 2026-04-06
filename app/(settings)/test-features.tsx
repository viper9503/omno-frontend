import { Text } from '@/components/ui/text';
import { SettingsGroup, SettingsPage, SettingsRow } from '@/features/settings/components';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import {
  LayersIcon,
  MessageSquareIcon,
  BellRingIcon,
  ListIcon,
  SquareStackIcon,
} from 'lucide-react-native';
import { useCallback, useMemo, useRef } from 'react';
import { Alert, View } from 'react-native';
import { useColorScheme } from 'nativewind';

export default function TestFeaturesScreen() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Bottom sheet refs
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapSheetRef = useRef<BottomSheet>(null);

  // Snap points for the snapping sheet
  const snapPoints = useMemo(() => ['25%', '50%', '90%'], []);

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

  const sheetBg = isDark ? '#1c1c1e' : '#ffffff';
  const sheetIndicator = isDark ? '#636366' : '#c7c7cc';
  const sheetTextClass = 'text-foreground';

  function openBasicSheet() {
    bottomSheetRef.current?.expand();
  }

  function openSnapSheet() {
    snapSheetRef.current?.snapToIndex(0);
  }

  return (
    <>
      <SettingsPage title="Test Features">
        <SettingsGroup
          title="Bottom Sheet"
          footer="Test the @gorhom/bottom-sheet component with different configurations."
        >
          <SettingsRow
            icon={LayersIcon}
            iconColor="#007AFF"
            label="Basic Bottom Sheet"
            chevron
            onPress={openBasicSheet}
          />
          <SettingsRow
            icon={SquareStackIcon}
            iconColor="#5856D6"
            label="Snap Points Sheet"
            chevron
            onPress={openSnapSheet}
            last
          />
        </SettingsGroup>

        <SettingsGroup
          title="Alerts"
          footer="Test native alert dialogs and feedback patterns."
        >
          <SettingsRow
            icon={MessageSquareIcon}
            iconColor="#FF9500"
            label="Native Alert"
            chevron
            onPress={() =>
              Alert.alert('Test Alert', 'This is a native iOS/Android alert dialog.', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'OK' },
              ])
            }
          />
          <SettingsRow
            icon={BellRingIcon}
            iconColor="#FF3B30"
            label="Destructive Alert"
            chevron
            onPress={() =>
              Alert.alert(
                'Delete Everything?',
                'This is a test of a destructive confirmation dialog.',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Delete', style: 'destructive' },
                ]
              )
            }
            last
          />
        </SettingsGroup>

        <SettingsGroup
          title="Lists"
          footer="Test different list rendering patterns."
        >
          <SettingsRow
            icon={ListIcon}
            iconColor="#34C759"
            label="Long List (Coming Soon)"
            last
          />
        </SettingsGroup>
      </SettingsPage>

      {/* Basic bottom sheet */}
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        enablePanDownToClose
        enableDynamicSizing
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: sheetBg }}
        handleIndicatorStyle={{ backgroundColor: sheetIndicator }}
      >
        <BottomSheetView>
          <View className="px-6 pb-10 pt-2">
            <Text className={`text-lg font-semibold ${sheetTextClass}`}>
              Basic Bottom Sheet
            </Text>
            <Text className={`mt-2 text-base text-muted-foreground`}>
              This is a basic bottom sheet that sizes itself to its content. Swipe
              down to dismiss.
            </Text>
            <View className="mt-4 rounded-xl bg-accent/50 p-4">
              <Text className={`text-sm ${sheetTextClass}`}>
                This sheet uses dynamic sizing — it adjusts height to fit its
                content rather than snapping to fixed points.
              </Text>
            </View>
          </View>
        </BottomSheetView>
      </BottomSheet>

      {/* Snap points bottom sheet */}
      <BottomSheet
        ref={snapSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: sheetBg }}
        handleIndicatorStyle={{ backgroundColor: sheetIndicator }}
      >
        <BottomSheetView>
          <View className="px-6 pb-10 pt-2">
            <Text className={`text-lg font-semibold ${sheetTextClass}`}>
              Snap Points Sheet
            </Text>
            <Text className={`mt-2 text-base text-muted-foreground`}>
              This sheet snaps to 25%, 50%, and 90% of screen height. Drag to try
              each snap point.
            </Text>
            <View className="mt-4 gap-3">
              {snapPoints.map((point, i) => (
                <View key={point} className="rounded-xl bg-accent/50 p-4">
                  <Text className={`text-sm font-medium ${sheetTextClass}`}>
                    Snap Point {i + 1}: {point}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </BottomSheetView>
      </BottomSheet>
    </>
  );
}
