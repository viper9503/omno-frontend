import { PageView } from '@/components/ui/page-view';
import { DayEntries, MonthCalendar } from '@/features/calendar/components';
import { useState } from 'react';

function todayString(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export default function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState(todayString);

  return (
    <PageView>
      <MonthCalendar selectedDate={selectedDate} onSelectDate={setSelectedDate} />
      <DayEntries dateString={selectedDate} />
    </PageView>
  );
}
