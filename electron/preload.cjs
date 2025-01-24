const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  saveMedia: (id, data) => ipcRenderer.invoke('save-media', { id, data }),
  saveDB: (data) => ipcRenderer.invoke('save-db', data),
  loadDB: () => ipcRenderer.invoke('load-db'),
});