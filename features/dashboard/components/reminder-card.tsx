import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Text } from '@/components/ui/text';
import { useReminderStore } from '@/lib/stores/reminder-store';
import { requestNotificationPermissions, scheduleReminders } from '@/lib/notifications';
import DateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { BellIcon } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';
import { useCallback, useEffect, useState } from 'react';
import { Alert, Platform, Pressable, View } from 'react-native';

const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'] as const;

function formatTime12(hour: number, minute: number): string {
  const period = hour >= 12 ? 'PM' : 'AM';
  const h = hour % 12 || 12;
  const m = String(minute).padStart(2, '0');
  return `${h}:${m} ${period}`;
}

export function ReminderCard() {
  const { reminder, loaded, load, update } = useReminderStore();
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    if (!loaded) load();
  }, [loaded]);

  const syncNotifications = useCallback(
    async (next: typeof reminder) => {
      if (next.enabled) {
        const granted = await requestNotificationPermissions();
        if (!granted) {
          Alert.alert(
            'Notifications Disabled',
            'Enable notifications in your device settings to use reminders.'
          );
          await update({ enabled: false });
          return;
        }
      }
      await scheduleReminders(next);
    },
    [update]
  );

  const handleToggle = async () => {
    const next = { ...reminder, enabled: !reminder.enabled };
    await update({ enabled: next.enabled });
    await syncNotifications(next);
  };

  const handleDayToggle = async (day: number) => {
    const days = reminder.days.includes(day)
      ? reminder.days.filter((d) => d !== day)
      : [...reminder.days, day].sort();
    const next = { ...reminder, days };
    await update({ days });
    await syncNotifications(next);
  };

  const handleTimeChange = async (_event: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === 'android') setShowPicker(false);
    if (!date) return;
    const hour = date.getHours();
    const minute = date.getMinutes();
    const next = { ...reminder, hour, minute };
    await update({ hour, minute });
    await syncNotifications(next);
  };

  const handleTimeDismiss = () => setShowPicker(false);

  if (!loaded) return null;

  const pickerDate = new Date();
  pickerDate.setHours(reminder.hour, reminder.minute, 0, 0);

  return (
    <Card>
      <CardContent className="gap-4 px-4 py-3">
        {/* Header row */}
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <Icon as={BellIcon} size={18} className="text-muted-foreground" />
            <Text className="text-base font-medium">Clock-in Reminder</Text>
          </View>
          <Switch checked={reminder.enabled} onCheckedChange={handleToggle} />
        </View>

        {reminder.enabled && (
          <>
            {/* Time picker */}
            <Pressable
              onPress={() => setShowPicker(true)}
              className="flex-row items-center justify-between rounded-lg bg-muted/50 px-3 py-2.5"
            >
              <Text className="text-sm text-muted-foreground">Remind at</Text>
              <Text className="text-base font-semibold text-blue-500">
                {formatTime12(reminder.hour, reminder.minute)}
              </Text>
            </Pressable>

            {showPicker && (
              <View>
                <DateTimePicker
                  value={pickerDate}
                  mode="time"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={handleTimeChange}
                  minuteInterval={1}
                />
                {Platform.OS === 'ios' && (
                  <Pressable onPress={handleTimeDismiss} className="items-end pt-1">
                    <Text className="text-sm font-medium text-primary">Done</Text>
                  </Pressable>
                )}
              </View>
            )}

            {/* Day selector */}
            <View className="gap-2">
              <Text className="text-sm text-muted-foreground">Repeat on</Text>
              <View className="flex-row gap-1.5">
                {DAY_LABELS.map((label, index) => {
                  const active = reminder.days.includes(index);
                  return (
                    <Pressable
                      key={index}
                      onPress={() => handleDayToggle(index)}
                      className={`h-9 flex-1 items-center justify-center rounded-full ${
                        active ? 'bg-foreground' : 'bg-muted/50'
                      }`}
                    >
                      <Text
                        className={`text-sm font-medium ${
                          active ? 'text-background' : 'text-muted-foreground'
                        }`}
                      >
                        {label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </>
        )}
      </CardContent>
    </Card>
  );
}
