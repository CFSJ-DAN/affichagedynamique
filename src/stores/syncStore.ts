import { create } from 'zustand';
import { usePlaylistStore } from './playlistStore';
import { useScreenStore } from './screenStore';

interface SyncStore {
  syncQueue: string[]; // IDs des playlists à synchroniser
  currentSync: string | null;
  syncHistory: {
    id: string;
    timestamp: string;
    status: 'success' | 'error';
    details?: string;
  }[];
  error: string | null;
  addToQueue: (playlistId: string) => void;
  removeFromQueue: (playlistId: string) => void;
  startSync: () => Promise<void>;
  clearQueue: () => void;
}

export const useSyncStore = create<SyncStore>((set, get) => ({
  syncQueue: [],
  currentSync: null,
  syncHistory: [],
  error: null,

  addToQueue: (playlistId) => {
    set({ error: null });
    try {
      set((state) => ({
        syncQueue: state.syncQueue.includes(playlistId) 
          ? state.syncQueue 
          : [...state.syncQueue, playlistId],
        error: null
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to add to sync queue'
      });
      throw error;
    }
  },

  removeFromQueue: (playlistId) => {
    set({ error: null });
    try {
      set((state) => ({
        syncQueue: state.syncQueue.filter(id => id !== playlistId),
        error: null
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to remove from sync queue'
      });
      throw error;
    }
  },

  clearQueue: () => {
    set({ error: null });
    try {
      set({ 
        syncQueue: [], 
        currentSync: null,
        error: null 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to clear sync queue'
      });
      throw error;
    }
  },

  startSync: async () => {
    const state = get();
    if (state.currentSync || state.syncQueue.length === 0) return;

    const playlistId = state.syncQueue[0];
    set({ currentSync: playlistId, error: null });

    try {
      const { playlists } = usePlaylistStore.getState();
      const { screens } = useScreenStore.getState();
      const playlist = playlists.find(p => p.id === playlistId);
      
      if (!playlist) {
        throw new Error('Playlist not found');
      }

      // Simuler la synchronisation avec les écrans
      await Promise.all(screens.map(async screen => {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }));

      set(state => ({
        syncQueue: state.syncQueue.filter(id => id !== playlistId),
        currentSync: null,
        syncHistory: [
          {
            id: playlistId,
            timestamp: new Date().toISOString(),
            status: 'success',
          },
          ...state.syncHistory,
        ],
        error: null
      }));

      // Continuer avec la prochaine playlist si disponible
      const nextState = get();
      if (nextState.syncQueue.length > 0) {
        nextState.startSync();
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown sync error';
      set(state => ({
        syncQueue: state.syncQueue.filter(id => id !== playlistId),
        currentSync: null,
        syncHistory: [
          {
            id: playlistId,
            timestamp: new Date().toISOString(),
            status: 'error',
            details: errorMessage,
          },
          ...state.syncHistory,
        ],
        error: errorMessage
      }));
      throw error;
    }
  },
}));