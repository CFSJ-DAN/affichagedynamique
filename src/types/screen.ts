export interface Screen {
  id: string;
  name: string;
  description: string;
  status: 'online' | 'offline' | 'error';
  lastSeen: string;
  orientation: 'landscape' | 'portrait';
  resolution: {
    width: number;
    height: number;
  };
  pairingCode: string;
  playlists: string[];
  createdAt: string;
  updatedAt: string;
}