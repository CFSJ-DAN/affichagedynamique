import { MediaItem } from '../types/media';
import { Playlist } from '../types/playlist';
import { TimeSlot } from '../types/schedule';
import { ensureDirectoryExists, saveFile, deleteFile } from './fileSystem';

const BASE_PATH = 'C:\\APPS\\affichagedynamique';
const CONTENT_PATH = `${BASE_PATH}\\content`;
const DB_PATH = `${BASE_PATH}\\db`;

interface LocalDB {
  playlists: Playlist[];
  slots: TimeSlot[];
  media: MediaItem[];
  lastSync: string;
}

export class LocalContentManager {
  private static instance: LocalContentManager;

  private constructor() {
    this.initializeDirectories();
  }

  static getInstance(): LocalContentManager {
    if (!this.instance) {
      this.instance = new LocalContentManager();
    }
    return this.instance;
  }

  private async initializeDirectories() {
    await ensureDirectoryExists(BASE_PATH);
    await ensureDirectoryExists(CONTENT_PATH);
    await ensureDirectoryExists(DB_PATH);
  }

  async saveMediaContent(mediaItem: MediaItem): Promise<void> {
    try {
      // Extraire le type de fichier de l'URL data
      const matches = mediaItem.url.match(/^data:(.+);base64,(.+)/);
      if (!matches) {
        throw new Error('Invalid data URL');
      }

      const [, mimeType, base64Data] = matches;
      const extension = mimeType.split('/')[1];
      const fileName = `${mediaItem.id}.${extension}`;
      const filePath = `${CONTENT_PATH}\\${fileName}`;

      // Convertir base64 en buffer et sauvegarder
      const buffer = Buffer.from(base64Data, 'base64');
      await saveFile(filePath, buffer);

      // Mettre à jour l'URL dans les métadonnées
      return filePath;
    } catch (error) {
      console.error('Failed to save media content:', error);
      throw error;
    }
  }

  async saveLocalDB(data: LocalDB): Promise<void> {
    try {
      const dbPath = `${DB_PATH}\\local.json`;
      await saveFile(dbPath, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('Failed to save local DB:', error);
      throw error;
    }
  }

  async loadLocalDB(): Promise<LocalDB | null> {
    try {
      const dbPath = `${DB_PATH}\\local.json`;
      const data = await readFile(dbPath);
      return JSON.parse(data.toString());
    } catch (error) {
      console.error('Failed to load local DB:', error);
      return null;
    }
  }

  async cleanupUnusedMedia(currentMediaIds: string[]): Promise<void> {
    try {
      const files = await readdir(CONTENT_PATH);
      for (const file of files) {
        const mediaId = file.split('.')[0];
        if (!currentMediaIds.includes(mediaId)) {
          await deleteFile(`${CONTENT_PATH}\\${file}`);
        }
      }
    } catch (error) {
      console.error('Failed to cleanup unused media:', error);
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
        const localPath = await this.saveMediaContent(item);
        return {
          ...item,
          url: localPath, // Remplacer l'URL data par le chemin local
        };
      });
      const localMedia = await Promise.all(mediaPromises);

      // 2. Sauvegarder la base de données locale
      const localDB: LocalDB = {
        playlists,
        slots,
        media: localMedia,
        lastSync: new Date().toISOString(),
      };
      await this.saveLocalDB(localDB);

      // 3. Nettoyer les fichiers médias non utilisés
      const currentMediaIds = media.map(item => item.id);
      await this.cleanupUnusedMedia(currentMediaIds);
    } catch (error) {
      console.error('Failed to sync content:', error);
      throw error;
    }
  }
}

export const localContent = LocalContentManager.getInstance();