export interface TimeSlot {
  id: string;
  playlistId: string;
  screenId: string;
  startDate?: string;
  endDate?: string;
  startTime: string;
  endTime: string;
  days: number[];
  recurrence?: {
    type: 'day' | 'week' | 'month' | 'year';
    interval: number;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ScheduleFormData {
  screenIds: string[];
  startDate?: string;
  endDate?: string;
  startTime: string;
  endTime: string;
  days: number[];
  recurrence?: {
    type: 'day' | 'week' | 'month' | 'year';
    interval: number;
  };
}