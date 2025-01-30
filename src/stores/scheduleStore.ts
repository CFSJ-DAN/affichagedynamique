import { create } from 'zustand';
import storage from '../lib/storage';
import type { TimeSlot, ScheduleFormData } from '../types/schedule';

const STORAGE_KEY = 'digital-signage-schedules';

interface ScheduleStore {
  slots: TimeSlot[];
  isLoading: boolean;
  error: string | null;
  loadSlots: () => Promise<void>;
  addTimeSlot: (data: ScheduleFormData & { playlistId: string }) => Promise<void>;
  deleteTimeSlot: (id: string) => Promise<void>;
  updateTimeSlot: (id: string, data: Partial<TimeSlot>) => Promise<void>;
  toggleTimeSlot: (id: string) => Promise<void>;
}

export const useScheduleStore = create<ScheduleStore>((set, get) => ({
  slots: [],
  isLoading: false,
  error: null,

  loadSlots: async () => {
    try {
      set({ isLoading: true });
      const slots = await storage.get<TimeSlot[]>(STORAGE_KEY) || [];
      set({ slots, error: null });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to load schedules',
        slots: []
      });
    } finally {
      set({ isLoading: false });
    }
  },

  addTimeSlot: async (data) => {
    try {
      set({ isLoading: true });
      const { screenIds, playlistId, startDate, endDate, startTime, endTime, days, recurrence } = data;
      const newSlots = screenIds.map(screenId => ({
        id: crypto.randomUUID(),
        playlistId,
        screenId,
        startDate,
        endDate,
        startTime: startTime || '00:00',
        endTime: endTime || '23:59',
        days: days || [0, 1, 2, 3, 4, 5, 6],
        recurrence,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));

      const slots = [...get().slots, ...newSlots];
      await storage.set(STORAGE_KEY, slots);
      set({ slots, error: null });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to add schedule'
      });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteTimeSlot: async (id) => {
    try {
      set({ isLoading: true });
      const slots = get().slots.filter(slot => slot.id !== id);
      await storage.set(STORAGE_KEY, slots);
      set({ slots, error: null });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete schedule'
      });
    } finally {
      set({ isLoading: false });
    }
  },

  updateTimeSlot: async (id, data) => {
    try {
      set({ isLoading: true });
      const slots = get().slots.map(slot =>
        slot.id === id
          ? { ...slot, ...data, updatedAt: new Date().toISOString() }
          : slot
      );
      await storage.set(STORAGE_KEY, slots);
      set({ slots, error: null });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update schedule'
      });
    } finally {
      set({ isLoading: false });
    }
  },

  toggleTimeSlot: async (id) => {
    try {
      set({ isLoading: true });
      const slots = get().slots.map(slot =>
        slot.id === id
          ? { ...slot, isActive: !slot.isActive, updatedAt: new Date().toISOString() }
          : slot
      );
      await storage.set(STORAGE_KEY, slots);
      set({ slots, error: null });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to toggle schedule'
      });
    } finally {
      set({ isLoading: false });
    }
  },
}));

// Charger les planifications au démarrage
useScheduleStore.getState().loadSlots();