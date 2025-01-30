import { create } from 'zustand';
import storage from '../lib/storage';
import type { MediaItem, MediaFilter } from '../types/media';

const STORAGE_KEY = 'digital-signage-media';

interface MediaStore {
  items: MediaItem[];
  tags: string[];
  activeFilters: MediaFilter;
  isLoading: boolean;
  error: string | null;
  loadItems: () => Promise<void>;
  addMedia: (data: Omit<MediaItem, 'id' | 'createdAt'>) => Promise<void>;
  deleteMedia: (id: string) => Promise<void>;
  updateMedia: (id: string, data: Partial<MediaItem>) => Promise<void>;
  getFilteredItems: () => MediaItem[];
  setFilters: (filters: MediaFilter) => void;
}

export const useMediaStore = create<MediaStore>((set, get) => ({
  items: [],
  tags: [],
  activeFilters: { tags: [] },
  isLoading: false,
  error: null,

  loadItems: async () => {
    try {
      set({ isLoading: true });
      const items = await storage.get<MediaItem[]>(STORAGE_KEY) || [];
      
      // Load media content for each item
      const itemsWithContent = await Promise.all(
        items.map(async item => {
          const content = await storage.getMedia(item.id);
          return {
            ...item,
            url: content || item.url
          };
        })
      );
      
      const tags = Array.from(new Set(itemsWithContent.flatMap(item => item.tags || [])));
      set({ items: itemsWithContent, tags, error: null });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to load media items',
        items: [],
        tags: []
      });
    } finally {
      set({ isLoading: false });
    }
  },

  addMedia: async (data) => {
    try {
      set({ isLoading: true });
      const id = crypto.randomUUID();
      const newItem: MediaItem = {
        ...data,
        id,
        createdAt: new Date().toISOString()
      };

      // Store the media content separately
      await storage.storeMedia(id, data.url);

      const items = [...get().items, newItem];
      await storage.set(STORAGE_KEY, items);
      
      const tags = Array.from(new Set([...get().tags, ...(newItem.tags || [])]));
      set({ items, tags, error: null });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to add media'
      });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteMedia: async (id) => {
    try {
      set({ isLoading: true });
      // Remove the media content
      await storage.removeMedia(id);

      const items = get().items.filter(item => item.id !== id);
      await storage.set(STORAGE_KEY, items);
      
      const tags = Array.from(new Set(items.flatMap(item => item.tags || [])));
      set({ items, tags, error: null });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete media'
      });
    } finally {
      set({ isLoading: false });
    }
  },

  updateMedia: async (id, data) => {
    try {
      set({ isLoading: true });
      if (data.url) {
        // Update the media content if URL is changed
        await storage.storeMedia(id, data.url);
      }

      const items = get().items.map(item =>
        item.id === id ? { ...item, ...data } : item
      );
      await storage.set(STORAGE_KEY, items);
      
      const tags = Array.from(new Set(items.flatMap(item => item.tags || [])));
      set({ items, tags, error: null });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update media'
      });
    } finally {
      set({ isLoading: false });
    }
  },

  getFilteredItems: () => {
    const { items, activeFilters } = get();
    return items.filter(item => {
      if (activeFilters.type && item.type !== activeFilters.type) {
        return false;
      }
      if (activeFilters.tags?.length > 0) {
        return activeFilters.tags.every(tag => 
          item.tags?.includes(tag)
        );
      }
      return true;
    });
  },

  setFilters: (filters) => {
    set({ activeFilters: filters });
  },
}));

// Load media items when the store is created
useMediaStore.getState().loadItems();