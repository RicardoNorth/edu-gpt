import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ScheduleItem, parseScheduleData } from './parseScheduleData';

// 时间段（5行）
const timeSlots = [
  { start: 800, end: 1000 },
  { start: 1000, end: 1200 },
  { start: 1400, end: 1600 },
  { start: 1600, end: 1800 },
  { start: 1900, end: 2100 },
];

const weekdays = ['一', '二', '三', '四', '五', '六', '天'];

interface Props {
  data: any[]; // 接口中的 data 字段
  currentWeek?: number; // 可选，默认14
}

export default function ScheduleTable({ data, currentWeek = 14 }: Props) {
  const schedule = parseScheduleData(data, currentWeek);

  // 构造 5x7 网格
  const grid: ScheduleItem[][][] = Array.from({ length: 5 }, () =>
    Array.from({ length: 7 }, () => [])
  );

  schedule.forEach(item => {
    const col = item.weekday - 1;
    const row = timeSlots.findIndex(
      slot => item.startTime >= slot.start && item.startTime < slot.end
    );
    if (row !== -1 && col !== -1) {
      grid[row][col].push(item);
    }
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>第 {currentWeek} 周 课程表</Text>

      {/* 顶部栏 */}
      <View style={styles.row}>
        {weekdays.map((day, i) => (
          <View key={i} style={styles.headerCell}>
            <Text style={styles.headerText}>{day}</Text>
          </View>
        ))}
      </View>

      {/* 主体行 */}
      {grid.map((rowItems, rowIdx) => (
        <View key={rowIdx} style={styles.row}>
          {rowItems.map((cellItems, colIdx) => (
            <View key={colIdx} style={styles.cell}>
              {cellItems.map((item, index) => (
                <View key={`${item.id}-${index}`} style={styles.courseBlock}>
                  <Text
                    style={styles.courseName}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                  >
                    {item.name}
                  </Text>
                  <Text
                    style={styles.courseRoom}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                  >
                    {item.room}
                  </Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    paddingHorizontal: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
  },
  headerCell: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderWidth: 0.5,
    borderColor: '#ddd',
  },
  headerText: {
    fontWeight: '600',
    fontSize: 13,
  },
  cell: {
  flex: 1,
  minHeight: 78,  // ✅ 可调大一点如 68 或 72
  padding: 2,
  borderWidth: 0.5,
  borderColor: '#eee',
  justifyContent: 'center', // ✅ 使空格内容居中
  },
  courseBlock: {
  backgroundColor: '#e0f0ff',
  borderRadius: 6,
  padding: 4,
  },
  courseName: {
    fontSize: 13, 
    fontWeight: '500',
    color: '#333',
    lineHeight: 18,
  },
  courseRoom: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
  courseText: {
  fontSize: 12,
  color: '#333',
  lineHeight: 16,
  },
  courseSub: {
    fontSize: 11,
    color: '#666',
  },
});
