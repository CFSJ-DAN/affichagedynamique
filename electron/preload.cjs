const { contextBridge, ipcRenderer } = require('electron');

<<<<<<< HEAD
// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
=======
<<<<<<< HEAD
// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
=======
>>>>>>> d10a24af2e42d821006b0db9075c52072fddaadd
>>>>>>> 7143f6c4c52e8933b9badb5fff168e9f569d8599
contextBridge.exposeInMainWorld('electronAPI', {
  saveMedia: (id, data) => ipcRenderer.invoke('save-media', { id, data }),
  saveDB: (data) => ipcRenderer.invoke('save-db', data),
  loadDB: () => ipcRenderer.invoke('load-db'),
<<<<<<< HEAD
  // Ajouter une propriété pour détecter Electron
  isElectron: true
=======
<<<<<<< HEAD
  // Ajouter une propriété pour détecter Electron
  isElectron: true
=======
>>>>>>> d10a24af2e42d821006b0db9075c52072fddaadd
>>>>>>> 7143f6c4c52e8933b9badb5fff168e9f569d8599
});