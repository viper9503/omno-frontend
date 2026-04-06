import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import type { Reminder } from '@/lib/stores/reminder-store';

const REMINDER_ID_PREFIX = 'clock-reminder-';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function requestNotificationPermissions(): Promise<boolean> {
  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;

  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

/** Cancel all clock-in reminder notifications. */
async function cancelAllReminders() {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  for (const n of scheduled) {
    if (n.identifier.startsWith(REMINDER_ID_PREFIX)) {
      await Notifications.cancelScheduledNotificationAsync(n.identifier);
    }
  }
}

/** Schedule weekly repeating notifications for each enabled day. */
export async function scheduleReminders(reminder: Reminder) {
  await cancelAllReminders();

  if (!reminder.enabled || reminder.days.length === 0) return;

  // Android needs a notification channel
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('clock-reminders', {
      name: 'Clock-in Reminders',
      importance: Notifications.AndroidImportance.HIGH,
      sound: 'default',
    });
  }

  for (const weekday of reminder.days) {
    await Notifications.scheduleNotificationAsync({
      identifier: `${REMINDER_ID_PREFIX}${weekday}`,
      content: {
        title: 'Time to clock in!',
        body: "Don't forget to start your work timer.",
        sound: 'default',
        ...(Platform.OS === 'android' && { channelId: 'clock-reminders' }),
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
        weekday: weekday === 0 ? 1 : weekday + 1, // expo uses 1=Sun, 2=Mon...
        hour: reminder.hour,
        minute: reminder.minute,
      },
    });
  }
}
