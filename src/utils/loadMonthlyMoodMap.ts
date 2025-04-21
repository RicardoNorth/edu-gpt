import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from 'date-fns';

export async function loadMonthlyMoodMap(): Promise<Record<string, string>> {
  const now = new Date();
  const yearMonthPrefix = format(now, 'yyyy-MM'); // 例：2025-04
  const moodMap: Record<string, string> = {};

  const allKeys = await AsyncStorage.getAllKeys();
  const moodKeys = allKeys.filter((key) => key.startsWith('mood-'));

  const moodEntries = await AsyncStorage.multiGet(moodKeys);
  moodEntries.forEach(([key, value]) => {
    if (value && key.startsWith(`mood-${yearMonthPrefix}`)) {
      try {
        const parsed = JSON.parse(value);
        moodMap[key.replace('mood-', '')] = parsed.mood;
      } catch (e) {
        console.warn('解析失败：', key);
      }
    }
  });

  return moodMap;
}
