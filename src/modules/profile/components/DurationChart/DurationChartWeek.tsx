import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  isSameDay,
} from 'date-fns';
import { loadMonthlyMoodMap } from '../../../../utils/loadMonthlyMoodMap';

export default function DurationChartWeek() {
  const today = new Date();
  const start = startOfMonth(today);
  const end = endOfMonth(today);
  const daysInMonth = eachDayOfInterval({ start, end });

  const [moodMap, setMoodMap] = useState<Record<string, string>>({});

  useEffect(() => {
    loadMonthlyMoodMap().then(setMoodMap);
  }, []);

  // 构建日历结构（按周分组，周一为一周起始）
  const calendar: (Date | null)[][] = [];
  let week: (Date | null)[] = [];

  const firstDay = getDay(start); // 0=Sun, 1=Mon
  const offset = firstDay === 0 ? 6 : firstDay - 1;
  for (let i = 0; i < offset; i++) week.push(null);

  daysInMonth.forEach((day) => {
    week.push(day);
    if (week.length === 7) {
      calendar.push(week);
      week = [];
    }
  });
  if (week.length > 0) {
    while (week.length < 7) week.push(null);
    calendar.push(week);
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.monthLabel}>{format(today, 'yyyy年MM月')} 心情记录</Text>
      </View>

      {/* 星期标题 */}
      <View style={styles.weekdays}>
        {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((day) => (
          <Text key={day} style={styles.weekdayText}>{day}</Text>
        ))}
      </View>

      {/* 日期格子 */}
      {calendar.map((week, idx) => (
        <View key={idx} style={styles.weekRow}>
          {week.map((date, i) => {
            const isToday = date && isSameDay(date, today);
            const dateStr = date ? format(date, 'yyyy-MM-dd') : '';
            const emoji = moodMap[dateStr];

            return (
              <View
                key={i}
                style={[
                  styles.dayBox,
                  isToday && styles.todayBox,
                ]}
              >
                {emoji ? (
                  <Text style={styles.emojiText}>{emoji}</Text>
                ) : (
                  <Text style={[styles.dayText, isToday && styles.todayText]}>
                    {date ? format(date, 'd') : ''}
                  </Text>
                )}
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
  header: {
    alignItems: 'center',
    marginBottom: 8,
  },
  monthLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2B333E',
  },
  weekdays: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
    paddingHorizontal: 8,
  },
  weekdayText: {
    width: 32,
    textAlign: 'center',
    fontSize: 12,
    color: '#888',
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
    paddingHorizontal: 8,
  },
  dayBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayText: {
    fontSize: 13,
    color: '#2B333E',
  },
  emojiText: {
    fontSize: 18,
  },
  todayBox: {
    backgroundColor: '#f7e8aa',
  },
  todayText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
