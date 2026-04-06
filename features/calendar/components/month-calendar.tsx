import { Text } from '@/components/ui/text';
import { useEntriesStore } from '@/lib/stores/entries-store';
import { useProjectsStore } from '@/lib/stores/projects-store';
import { cn } from '@/lib/utils';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';
import { Icon } from '@/components/ui/icon';

type MonthCalendarProps = {
  selectedDate: string; // YYYY-MM-DD
  onSelectDate: (date: string) => void;
};

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;

function toDateKey(ts: number): string {
  const d = new Date(ts);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function todayKey(): string {
  return toDateKey(Date.now());
}

function formatMonth(year: number, month: number): string {
  const d = new Date(year, month);
  return d.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
}

/** Returns grid of day numbers (1-based), with nulls for empty leading/trailing cells. */
function buildCalendarGrid(year: number, month: number): (number | null)[][] {
  const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const weeks: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }
  return weeks;
}

function makeDateString(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export function MonthCalendar({ selectedDate, onSelectDate }: MonthCalendarProps) {
  const entries = useEntriesStore((s) => s.entries);
  const projects = useProjectsStore((s) => s.projects);

  // Parse selected date to initialize displayed month
  const [selY, selM] = selectedDate.split('-').map(Number);
  const [viewYear, setViewYear] = useState(selY);
  const [viewMonth, setViewMonth] = useState(selM - 1); // 0-indexed

  const today = todayKey();
  const weeks = useMemo(() => buildCalendarGrid(viewYear, viewMonth), [viewYear, viewMonth]);

  // Build a set of dates that have entries, with project colors for dots
  const entryDots = useMemo(() => {
    const map = new Map<string, Set<string>>();
    for (const entry of entries) {
      const key = toDateKey(entry.startTime);
      if (!map.has(key)) map.set(key, new Set());
      const color = entry.projectId
        ? projects.find((p) => p.id === entry.projectId)?.color ?? '#9ca3af'
        : '#9ca3af';
      map.get(key)!.add(color);
    }
    return map;
  }, [entries, projects]);

  function goToPrevMonth() {
    if (viewMonth === 0) {
      setViewYear(viewYear - 1);
      setViewMonth(11);
    } else {
      setViewMonth(viewMonth - 1);
    }
  }

  function goToNextMonth() {
    if (viewMonth === 11) {
      setViewYear(viewYear + 1);
      setViewMonth(0);
    } else {
      setViewMonth(viewMonth + 1);
    }
  }

  return (
    <View className="gap-2">
      {/* Header: month/year with arrows */}
      <View className="flex-row items-center justify-between px-1 py-2">
        <Pressable onPress={goToPrevMonth} hitSlop={12}>
          <Icon as={ChevronLeftIcon} size={22} className="text-foreground" />
        </Pressable>
        <Text className="text-base font-semibold">{formatMonth(viewYear, viewMonth)}</Text>
        <Pressable onPress={goToNextMonth} hitSlop={12}>
          <Icon as={ChevronRightIcon} size={22} className="text-foreground" />
        </Pressable>
      </View>

      {/* Day-of-week headers */}
      <View className="flex-row">
        {DAY_LABELS.map((label) => (
          <View key={label} className="flex-1 items-center pb-2">
            <Text className="text-xs font-medium text-muted-foreground">{label}</Text>
          </View>
        ))}
      </View>

      {/* Date grid */}
      {weeks.map((week, wi) => (
        <View key={wi} className="flex-row">
          {week.map((day, di) => {
            if (day === null) {
              return <View key={di} className="flex-1 items-center py-1" />;
            }

            const dateStr = makeDateString(viewYear, viewMonth, day);
            const isSelected = dateStr === selectedDate;
            const isToday = dateStr === today;
            const dots = entryDots.get(dateStr);

            return (
              <View key={di} className="flex-1 items-center py-1">
                <Pressable
                  onPress={() => onSelectDate(dateStr)}
                  className={cn(
                    'h-9 w-9 items-center justify-center rounded-full',
                    isSelected && 'bg-foreground'
                  )}
                >
                  <Text
                    className={cn(
                      'text-base',
                      isSelected && 'font-semibold text-background',
                      !isSelected && isToday && 'font-semibold text-primary',
                      !isSelected && !isToday && 'text-foreground'
                    )}
                  >
                    {day}
                  </Text>
                </Pressable>
                {/* Entry dots */}
                {dots && dots.size > 0 && (
                  <View className="mt-0.5 flex-row gap-0.5">
                    {Array.from(dots)
                      .slice(0, 3)
                      .map((color) => (
                        <View
                          key={color}
                          className="h-1 w-1 rounded-full"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                  </View>
                )}
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
}
