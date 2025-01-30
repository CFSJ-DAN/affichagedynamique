import { create } from 'zustand';
import storage from '../lib/storage';
import type { Screen, ScreenFormData } from '../types/screen';

const STORAGE_KEY = 'digital-signage-screens';

interface ScreenStore {
  screens: Screen[];
  isLoading: boolean;
  error: string | null;
  monitoringStatus: {
    [key: string]: {
      lastPing: string;
      cpuUsage: number;
      memoryUsage: number;
      diskSpace: number;
      temperature: number;
      networkSpeed: number;
    };
  };
  loadScreens: () => Promise<void>;
  addScreen: (data: ScreenFormData) => Promise<void>;
  deleteScreen: (id: string) => Promise<void>;
  updateScreen: (id: string, data: Partial<Screen>) => Promise<void>;
  regeneratePairingCode: (id: string) => Promise<void>;
  updateMonitoringData: (id: string, data: any) => void;
  getScreenHealth: (id: string) => 'healthy' | 'warning' | 'critical';
}

const generatePairingCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

export const useScreenStore = create<ScreenStore>((set, get) => ({
  screens: [], // Initialiser avec un tableau vide
  isLoading: false,
  error: null,
  monitoringStatus: {},

  loadScreens: async () => {
    try {
      set({ isLoading: true });
      const screens = await storage.get<Screen[]>(STORAGE_KEY) || [];
      set({ screens, error: null });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to load screens',
        screens: [] // En cas d'erreur, s'assurer que screens est un tableau vide
      });
    } finally {
      set({ isLoading: false });
    }
  },

  addScreen: async (data) => {
    try {
      set({ isLoading: true });
      const newScreen: Screen = {
        id: crypto.randomUUID(),
        ...data,
        status: 'offline',
        lastSeen: new Date().toISOString(),
        pairingCode: generatePairingCode(),
        playlists: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const screens = [...get().screens, newScreen];
      await storage.set(STORAGE_KEY, screens);
      set({ screens, error: null });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to add screen'
      });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteScreen: async (id) => {
    try {
      set({ isLoading: true });
      const screens = get().screens.filter(screen => screen.id !== id);
      await storage.set(STORAGE_KEY, screens);
      
      const monitoringStatus = { ...get().monitoringStatus };
      delete monitoringStatus[id];
      
      set({ screens, monitoringStatus, error: null });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete screen'
      });
    } finally {
      set({ isLoading: false });
    }
  },

  updateScreen: async (id, data) => {
    try {
      set({ isLoading: true });
      const screens = get().screens.map(screen =>
        screen.id === id
          ? { ...screen, ...data, updatedAt: new Date().toISOString() }
          : screen
      );
      await storage.set(STORAGE_KEY, screens);
      set({ screens, error: null });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update screen'
      });
    } finally {
      set({ isLoading: false });
    }
  },

  regeneratePairingCode: async (id) => {
    try {
      set({ isLoading: true });
      const screens = get().screens.map(screen =>
        screen.id === id
          ? { ...screen, pairingCode: generatePairingCode() }
          : screen
      );
      await storage.set(STORAGE_KEY, screens);
      set({ screens, error: null });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to regenerate pairing code'
      });
    } finally {
      set({ isLoading: false });
    }
  },

  updateMonitoringData: (id, data) => {
    set(state => ({
      monitoringStatus: {
        ...state.monitoringStatus,
        [id]: {
          ...state.monitoringStatus[id],
          ...data,
          lastPing: new Date().toISOString(),
        },
      },
    }));
  },

  getScreenHealth: (id) => {
    const status = get().monitoringStatus[id];
    if (!status) return 'critical';

    const lastPing = new Date(status.lastPing);
    const now = new Date();
    const timeSinceLastPing = now.getTime() - lastPing.getTime();

    if (timeSinceLastPing > 5 * 60 * 1000) return 'critical';
    if (status.cpuUsage > 90 || status.memoryUsage > 90) return 'warning';
    if (status.diskSpace < 10) return 'warning';
    if (status.temperature > 80) return 'warning';

    return 'healthy';
  },
}));

// Charger les écrans au démarrage
useScreenStore.getState().loadScreens();