export interface MediaItem {
  id: string;
  type: 'image' | 'video' | 'text' | 'widget';
  name: string;
  url: string;
  duration: number;
  size?: number; // Taille en bytes
  tags: string[];
  transition?: {
    type: 'fade' | 'slide' | 'zoom' | 'none';
    duration: number;
  };
  createdAt: string;
  lastSync?: string;
  syncStatus?: 'pending' | 'syncing' | 'synced' | 'error';
}