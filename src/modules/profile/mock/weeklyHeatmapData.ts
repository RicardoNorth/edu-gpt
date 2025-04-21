// src/modules/profile/mock/weeklyHeatmapData.ts
import { startOfMonth, endOfMonth, eachDayOfInterval, format } from 'date-fns';

interface Activity {
  date: string;
  minutes: number;
}

// 获取当前月份范围
const now = new Date();
const start = startOfMonth(now);
const end = endOfMonth(now);

// 枚举所有天
const allDays = eachDayOfInterval({ start, end });

// 随机生成打球数据
export const weeklyHeatmapData: Activity[] = allDays.map((date) => {
  const minutes = Math.random() < 0.3 ? 0 : Math.floor(Math.random() * 90); // 30% 概率为 0
  return {
    date: format(date, 'yyyy-MM-dd'),
    minutes,
  };
});
