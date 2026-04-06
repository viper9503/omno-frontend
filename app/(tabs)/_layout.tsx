import { useSyncClock } from '@/lib/api/use-sync-clock';
import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';

const HOME_ICON = { default: 'house', selected: 'house.fill' } as const;
const CLOCK_ICON = { default: 'clock', selected: 'clock.fill' } as const;
const CALENDAR_ICON = { default: 'calendar', selected: 'calendar' } as const;

export default function TabLayout() {
  useSyncClock();

  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <Icon sf={HOME_ICON} />
        <Label>Home</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="clock">
        <Icon sf={CLOCK_ICON} />
        <Label>Clock</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="calendar">
        <Icon sf={CALENDAR_ICON} />
        <Label>Calendar</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="settings">
        <Icon sf="gear" />
        <Label>Settings</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
