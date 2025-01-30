const { contextBridge, ipcRenderer } = require('electron');

// Exposer les fonctions IPC au renderer
contextBridge.exposeInMainWorld('electronAPI', {
  saveMedia: (id, data) => ipcRenderer.invoke('save-media', { id, data }),
  saveDB: (data) => ipcRenderer.invoke('save-db', data),
  loadDB: () => ipcRenderer.invoke('load-db'),
});