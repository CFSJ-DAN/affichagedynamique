const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  saveMedia: (id, data) => ipcRenderer.invoke('save-media', { id, data }),
  saveDB: (data) => ipcRenderer.invoke('save-db', data),
  loadDB: () => ipcRenderer.invoke('load-db'),
  // Ajouter une propriété pour détecter Electron
  isElectron: true
});