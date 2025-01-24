import { create } from 'zustand';
import storage from '../lib/storage';
import type { Playlist, PlaylistFormData } from '../types/playlist';
import { calculateTotalDuration } from '../utils/mediaUtils';

const STORAGE_KEY = 'digital-signage-playlists';

interface PlaylistStore {
  playlists: Playlist[];
  isLoading: boolean;
  error: string | null;
  syncingPlaylists: Set<string>;
  loadPlaylists: () => Promise<void>;
  addPlaylist: (data: PlaylistFormData & { mediaItems: Playlist['items'] }) => Promise<void>;
  deletePlaylist: (id: string) => Promise<void>;
  updatePlaylist: (id: string, data: PlaylistFormData & { mediaItems: Playlist['items'] }) => Promise<void>;
  togglePlaylist: (id: string) => Promise<void>;
  syncPlaylist: (id: string) => Promise<void>;
}

export const usePlaylistStore = create<PlaylistStore>((set, get) => ({
  playlists: [],
  isLoading: false,
  error: null,
  syncingPlaylists: new Set(),

  loadPlaylists: async () => {
    try {
      set({ isLoading: true });
      const playlists = await storage.get<Playlist[]>(STORAGE_KEY) || [];
      set({ playlists, error: null });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to load playlists',
        playlists: [] // Ensure playlists is always an array
      });
    } finally {
      set({ isLoading: false });
    }
  },

  addPlaylist: async (data) => {
    try {
      set({ isLoading: true });
      const newPlaylist: Playlist = {
        id: crypto.randomUUID(),
        name: data.name,
        description: data.description,
        items: data.mediaItems,
        duration: calculateTotalDuration(data.mediaItems),
        isActive: true,
        transition: data.transition || { type: 'fade', duration: 500 },
        schedule: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const playlists = [...get().playlists, newPlaylist];
      await storage.set(STORAGE_KEY, playlists);
      set({ playlists, error: null });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to add playlist'
      });
    } finally {
      set({ isLoading: false });
    }
  },

  deletePlaylist: async (id) => {
    try {
      set({ isLoading: true });
      const playlists = get().playlists.filter(playlist => playlist.id !== id);
      await storage.set(STORAGE_KEY, playlists);
      set({ playlists, error: null });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete playlist'
      });
    } finally {
      set({ isLoading: false });
    }
  },

  updatePlaylist: async (id, data) => {
    try {
      set({ isLoading: true });
      const playlists = get().playlists.map(playlist =>
        playlist.id === id
          ? {
              ...playlist,
              name: data.name,
              description: data.description,
              items: data.mediaItems,
              transition: data.transition || playlist.transition,
              duration: calculateTotalDuration(data.mediaItems),
              updatedAt: new Date().toISOString(),
            }
          : playlist
      );
      await storage.set(STORAGE_KEY, playlists);
      set({ playlists, error: null });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update playlist'
      });
    } finally {
      set({ isLoading: false });
    }
  },

  togglePlaylist: async (id) => {
    try {
      set({ isLoading: true });
      const playlists = get().playlists.map(playlist =>
        playlist.id === id
          ? { ...playlist, isActive: !playlist.isActive }
          : playlist
      );
      await storage.set(STORAGE_KEY, playlists);
      set({ playlists, error: null });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to toggle playlist'
      });
    } finally {
      set({ isLoading: false });
    }
  },

  syncPlaylist: async (id: string) => {
    const playlist = get().playlists.find(p => p.id === id);
    if (!playlist) {
      set({ error: 'Playlist not found' });
      return;
    }

    set(state => ({
      syncingPlaylists: new Set(state.syncingPlaylists).add(id),
      error: null
    }));

    try {
      // Simulate synchronization
      await new Promise(resolve => setTimeout(resolve, 2000));

      set(state => {
        const syncing = new Set(state.syncingPlaylists);
        syncing.delete(id);
        return { 
          syncingPlaylists: syncing,
          error: null
        };
      });
    } catch (error) {
      set(state => {
        const syncing = new Set(state.syncingPlaylists);
        syncing.delete(id);
        return { 
          syncingPlaylists: syncing,
          error: error instanceof Error ? error.message : 'Failed to sync playlist'
        };
      });
    }
  },
}));

// Load playlists when the store is created
usePlaylistStore.getState().loadPlaylists();