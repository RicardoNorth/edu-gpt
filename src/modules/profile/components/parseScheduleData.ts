export interface RawCourse {
  id: number;
  name: string;
  teachers: string[];
  schedule: {
    startTime: number;
    endTime: number;
    id: number;
    weekday: number;
    weekIndex: number;
    room?: string;
  }[];
}

export interface ScheduleItem {
  id: number;
  name: string;
  teacher?: string;
  room?: string;
  weekday: number;
  weekIndex: number;
  startTime: number;
  endTime: number;
}

export function parseScheduleData(rawData: RawCourse[], currentWeek: number): ScheduleItem[] {
  const parsed: ScheduleItem[] = [];

  rawData.forEach(course => {
    course.schedule.forEach(item => {
      if (item.weekIndex === currentWeek) {
        parsed.push({
          id: item.id,
          name: course.name,
          teacher: course.teachers?.[0] || '',
          room: item.room || '',
          weekday: item.weekday,
          weekIndex: item.weekIndex,
          startTime: item.startTime,
          endTime: item.endTime,
        });
      }
    });
  });

  return parsed;
}
