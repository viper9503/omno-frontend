import { SettingsGroup, SettingsPage, SettingsRow } from '@/features/settings/components';
import { BellIcon, MailIcon, ClockIcon } from 'lucide-react-native';
import { useState } from 'react';
import { Switch } from 'react-native';

export default function NotificationsScreen() {
  const [allEnabled, setAllEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [weeklyHoursEnabled, setWeeklyHoursEnabled] = useState(true);

  return (
    <SettingsPage title="Notifications">
        <SettingsGroup
          title="General"
          footer="Turn off to disable all notifications from Omno."
        >
          <SettingsRow
            icon={BellIcon}
            iconColor="#FF9500"
            label="Allow Notifications"
            right={<Switch value={allEnabled} onValueChange={setAllEnabled} />}
            last
          />
        </SettingsGroup>

        {allEnabled && (
          <>
            <SettingsGroup
              title="Channels"
              footer="Choose how you'd like to be notified."
            >
              <SettingsRow
                icon={MailIcon}
                iconColor="#007AFF"
                label="Email Notifications"
                right={
                  <Switch value={emailEnabled} onValueChange={setEmailEnabled} />
                }
                last
              />
            </SettingsGroup>

            <SettingsGroup
              title="Alerts"
              footer="Get notified when you hit milestones."
            >
              <SettingsRow
                icon={ClockIcon}
                iconColor="#34C759"
                label="40 hrs completed this week"
                right={
                  <Switch
                    value={weeklyHoursEnabled}
                    onValueChange={setWeeklyHoursEnabled}
                  />
                }
                last
              />
            </SettingsGroup>
          </>
        )}
    </SettingsPage>
  );
}
