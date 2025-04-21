export const heatmapData = Array.from({ length: 365 }, (_, i) => {
  const date = new Date(2025, 0, 1 + i); // 从 1 月 1 日开始
  const isoDate = date.toISOString().split('T')[0];
  const minutes = Math.random() < 0.3 ? 0 : Math.floor(Math.random() * 90); // 约 30% 为空闲日
  return { date: isoDate, minutes };
});
