import React from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import { heatmapData } from '../../mock/heatmapData';

const boxSize = 22;
const boxMargin = 4;
const columnWidth = boxSize + boxMargin + 8;
const yLabelWidth = 36;

const getColor = (minutes: number) => {
  if (minutes === 0) return '#ebedf0';
  if (minutes <= 30) return '#66a9c9';
  if (minutes <= 60) return '#1a94bc';
  return '#144a74';
};

const buildWeeks = (data: typeof heatmapData) => {
  const startDate = new Date(data[0].date);
  const matrix: { [weekIndex: number]: { [weekday: number]: { date: string; minutes: number } } } = {};

  data.forEach((item) => {
    const date = new Date(item.date);
    const weekday = date.getDay();
    const diff = Math.floor((+date - +startDate) / (1000 * 3600 * 24));
    const weekIndex = Math.floor((diff + startDate.getDay()) / 7);

    if (!matrix[weekIndex]) matrix[weekIndex] = {};
    matrix[weekIndex][weekday] = {
      date: item.date,
      minutes: item.minutes,
    };
  });

  const weeks = Object.keys(matrix).map((weekIndex) => {
    const week = matrix[+weekIndex];
    const days = Array.from({ length: 7 }, (_, weekday) => ({
      weekday,
      date: week[weekday]?.date ?? '',
      minutes: week[weekday]?.minutes ?? 0,
    }));
    return { weekIndex: +weekIndex, days };
  });

  return weeks;
};

const getMonthLabelMap = (weeks: ReturnType<typeof buildWeeks>) => {
  const labelMap: { [weekIdx: number]: string } = {};
  const seen = new Set<string>();

  weeks.forEach((week, idx) => {
    for (const day of week.days) {
      if (day.date && new Date(day.date).getDate() === 1) {
        const month = new Date(day.date).toLocaleString('en-US', { month: 'short' });
        if (!seen.has(month)) {
          seen.add(month);
          labelMap[idx] = month;
        }
        break;
      }
    }
  });

  return labelMap;
};

export default function DurationChartYear() {
  const data = heatmapData;
  if (!data || data.length === 0) return null;

  const weeks = buildWeeks(data);
  const monthLabelMap = getMonthLabelMap(weeks);

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View>
        {/* 月份标签 */}
        <View style={styles.monthLabelsRow}>
          <View style={{ width: yLabelWidth }} />
          {weeks.map((_, idx) => (
            <View
              key={`month-${idx}`}
              style={{
                width: columnWidth,
                alignItems: 'flex-start',
              }}
            >
              <Text
                style={styles.monthLabel}
                numberOfLines={1}
                ellipsizeMode="clip"
              >
                {monthLabelMap[idx] || ' '}
              </Text>
            </View>
          ))}
        </View>

        {/* 热图格子 */}
        <View style={{ flexDirection: 'row' }}>
          <View style={styles.yLabelColumn}>
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((label) => (
              <Text key={label} style={styles.yLabel}>
                {label}
              </Text>
            ))}
          </View>

          {weeks.map((week, weekIdx) => (
            <View
              key={`week-${weekIdx}`}
              style={{
                width: columnWidth,
                alignItems: 'center',
              }}
            >
              {week.days.map((day) => (
                <View
                  key={day.weekday}
                  style={{
                    width: boxSize,
                    height: boxSize,
                    marginVertical: boxMargin,
                    backgroundColor: getColor(day.minutes),
                    borderRadius: 4,
                  }}
                />
              ))}
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  monthLabelsRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  monthLabel: {
    fontSize: 14,
    color: '#555',
    width: columnWidth,
    overflow: 'hidden',
    marginLeft: 8,
  },
  yLabelColumn: {
    width: yLabelWidth,
    justifyContent: 'space-between',

  },
  yLabel: {
    fontSize: 14,
    color: '#555',
    textAlign: 'right',
    marginVertical: 4,
  },
});
