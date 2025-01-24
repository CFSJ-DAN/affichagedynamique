import { create } from 'zustand';
import storage from '../lib/storage';
import type { Template, TextElement, TemplateFormData } from '../types/template';

const STORAGE_KEY = 'digital-signage-templates';

interface TemplateStore {
  templates: Template[];
  isLoading: boolean;
  error: string | null;
  loadTemplates: () => Promise<void>;
  addTemplate: (data: TemplateFormData) => Promise<void>;
  deleteTemplate: (id: string) => Promise<void>;
  updateTemplate: (id: string, data: Partial<Template>) => Promise<void>;
  addTextElement: (templateId: string, element: Omit<TextElement, 'id'>) => Promise<void>;
  updateTextElement: (templateId: string, elementId: string, data: Partial<TextElement>) => Promise<void>;
  deleteTextElement: (templateId: string, elementId: string) => Promise<void>;
}

export const useTemplateStore = create<TemplateStore>((set, get) => ({
  templates: [],
  isLoading: false,
  error: null,

  loadTemplates: async () => {
    try {
      set({ isLoading: true });
      const templates = await storage.get<Template[]>(STORAGE_KEY) || [];
      set({ templates, error: null });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to load templates',
        templates: []
      });
    } finally {
      set({ isLoading: false });
    }
  },

  addTemplate: async (data) => {
    try {
      set({ isLoading: true });
      const newTemplate: Template = {
        id: crypto.randomUUID(),
        ...data,
        textElements: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const templates = [...get().templates, newTemplate];
      await storage.set(STORAGE_KEY, templates);
      set({ templates, error: null });
      return newTemplate.id;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to add template'
      });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteTemplate: async (id) => {
    try {
      set({ isLoading: true });
      const templates = get().templates.filter(template => template.id !== id);
      await storage.set(STORAGE_KEY, templates);
      set({ templates, error: null });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete template'
      });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateTemplate: async (id, data) => {
    try {
      set({ isLoading: true });
      const templates = get().templates.map(template =>
        template.id === id
          ? {
              ...template,
              ...data,
              updatedAt: new Date().toISOString(),
              // Préserver les éléments de texte existants s'ils ne sont pas inclus dans la mise à jour
              textElements: data.textElements || template.textElements,
            }
          : template
      );
      await storage.set(STORAGE_KEY, templates);
      set({ templates, error: null });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update template'
      });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  addTextElement: async (templateId, element) => {
    try {
      set({ isLoading: true });
      const newElement = { ...element, id: crypto.randomUUID() };
      const templates = get().templates.map(template =>
        template.id === templateId
          ? {
              ...template,
              textElements: [...template.textElements, newElement],
              updatedAt: new Date().toISOString(),
            }
          : template
      );
      await storage.set(STORAGE_KEY, templates);
      set({ templates, error: null });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to add text element'
      });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateTextElement: async (templateId, elementId, data) => {
    try {
      set({ isLoading: true });
      const templates = get().templates.map(template =>
        template.id === templateId
          ? {
              ...template,
              textElements: template.textElements.map(element =>
                element.id === elementId
                  ? { ...element, ...data }
                  : element
              ),
              updatedAt: new Date().toISOString(),
            }
          : template
      );
      await storage.set(STORAGE_KEY, templates);
      set({ templates, error: null });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update text element'
      });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteTextElement: async (templateId, elementId) => {
    try {
      set({ isLoading: true });
      const templates = get().templates.map(template =>
        template.id === templateId
          ? {
              ...template,
              textElements: template.textElements.filter(
                element => element.id !== elementId
              ),
              updatedAt: new Date().toISOString(),
            }
          : template
      );
      await storage.set(STORAGE_KEY, templates);
      set({ templates, error: null });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete text element'
      });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
}));

// Charger les templates au démarrage
useTemplateStore.getState().loadTemplates();