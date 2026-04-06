import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Text } from '@/components/ui/text';
import { DAILY_HOURS_GOAL } from '@/features/dashboard/constants';
import { View } from 'react-native';

/**
 * Shows daily hours worked as a progress bar toward the daily goal.
 * Strictly presentational — all data is placeholder.
 */
export function HoursProgress() {
  const hoursWorked = 6.5;
  const percentage = Math.min(Math.round((hoursWorked / DAILY_HOURS_GOAL) * 100), 100);

  return (
    <Card>
      <CardContent className="gap-2 px-4 py-3">
        <View className="flex-row items-center justify-between">
          <Text className="text-lg font-medium">Hours Worked Today</Text>
          <Text className="text-lg font-bold text-blue-500">{hoursWorked}h</Text>
        </View>
        <Progress value={percentage} indicatorClassName="bg-primary" />
        <Text className="text-xs text-muted-foreground">
          {percentage}% of {DAILY_HOURS_GOAL}h daily goal
        </Text>
      </CardContent>
    </Card>
  );
}
