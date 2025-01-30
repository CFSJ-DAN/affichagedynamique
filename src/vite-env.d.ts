/// <reference types="vite/client" />

interface Window {
  electronAPI?: {
    isElectron: boolean;
    saveMedia: (id: string, data: string) => Promise<string>;
    saveDB: (data: any) => Promise<void>;
    loadDB: () => Promise<any>;
  };
}