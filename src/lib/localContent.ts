import { MediaItem } from '../types/media';
import { Playlist } from '../types/playlist';
import { TimeSlot } from '../types/schedule';

interface LocalDB {
  playlists: Playlist[];
  slots: TimeSlot[];
  media: MediaItem[];
  lastSync: string;
}

export class LocalContentManager {
  private static instance: LocalContentManager;

  private constructor() {}

  static getInstance(): LocalContentManager {
    if (!this.instance) {
      this.instance = new LocalContentManager();
    }
    return this.instance;
  }

  async saveMediaContent(mediaItem: MediaItem): Promise<void> {
    try {
      if (!window.electronAPI) {
        throw new Error('Electron API not available');
      }

      // Extraire le type de fichier de l'URL data
      const matches = mediaItem.url.match(/^data:(.+);base64,(.+)/);
      if (!matches) {
        throw new Error('Invalid data URL');
      }

      const [, , base64Data] = matches;
      await window.electronAPI.saveMedia(mediaItem.id, base64Data);

    } catch (error) {
      console.error('Failed to save media content:', error);
      throw error;
    }
  }

  async saveLocalDB(data: LocalDB): Promise<void> {
    try {
      if (!window.electronAPI) {
        throw new Error('Electron API not available');
      }

      await window.electronAPI.saveDB(data);
    } catch (error) {
      console.error('Failed to save local DB:', error);
      throw error;
    }
  }

  async loadLocalDB(): Promise<LocalDB | null> {
    try {
      if (!window.electronAPI) {
        throw new Error('Electron API not available');
      }

      const data = await window.electronAPI.loadDB();
      return data;
    } catch (error) {
      console.error('Failed to load local DB:', error);
      return null;
    }
  }

  async syncContent(
    playlists: Playlist[],
    slots: TimeSlot[],
    media: MediaItem[]
  ): Promise<void> {
    try {
      // 1. Sauvegarder les nouveaux fichiers médias
      const mediaPromises = media.map(async (item) => {
        await this.saveMediaContent(item);
        return item;
      });
      await Promise.all(mediaPromises);

      // 2. Sauvegarder la base de données locale
      const localDB: LocalDB = {
        playlists,
        slots,
        media,
        lastSync: new Date().toISOString(),
      };
      await this.saveLocalDB(localDB);

    } catch (error) {
      console.error('Failed to sync content:', error);
      throw error;
    }
  }
}

export const localContent = LocalContentManager.getInstance();