import { MediaItem } from './media';

export interface Playlist {
  id: string;
  name: string;
  description: string;
  items: MediaItem[];
  duration: number;
  isActive: boolean;
  transition: {
    type: 'none' | 'fade' | 'slide' | 'zoom';
    duration: number;
  };
  schedule: Schedule[];
  createdAt: string;
  updatedAt: string;
  lastSync?: string;
  syncStatus?: 'pending' | 'syncing' | 'synced' | 'error';
}

export interface Schedule {
  id: string;
  dayOfWeek: number[];
  startTime: string;
  endTime: string;
  screens: string[];
}

export interface PlaylistFormData {
  name: string;
  description: string;
  transition?: Playlist['transition'];
}