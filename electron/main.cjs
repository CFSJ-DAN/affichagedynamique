const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const Store = require('electron-store');
const fs = require('fs');

// Configuration du stockage local
const store = new Store();

// Chemin de base pour le stockage des fichiers
const BASE_PATH = 'C:\\APPS\\affichagedynamique';
const CONTENT_PATH = path.join(BASE_PATH, 'content');
const DB_PATH = path.join(BASE_PATH, 'db');

// Créer les répertoires nécessaires
function ensureDirectoriesExist() {
  [BASE_PATH, CONTENT_PATH, DB_PATH].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
}

function createWindow() {
  // Créer la fenêtre principale
  const mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.cjs')
    },
    fullscreen: true,
    autoHideMenuBar: true,
  });

  // Charger l'application
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173');
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  // Gérer les raccourcis clavier
  mainWindow.webContents.on('before-input-event', (event, input) => {
    if (input.key !== 'Escape') {
      event.preventDefault();
    }
  });
}

app.whenReady().then(() => {
  ensureDirectoriesExist();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Gestionnaires IPC
ipcMain.handle('save-media', async (event, { id, data }) => {
  try {
    const filePath = path.join(CONTENT_PATH, `${id}`);
    await fs.promises.writeFile(filePath, Buffer.from(data, 'base64'));
    return filePath;
  } catch (error) {
    console.error('Error saving media:', error);
    throw error;
  }
});

ipcMain.handle('save-db', async (event, data) => {
  try {
    const dbPath = path.join(DB_PATH, 'local.json');
    await fs.promises.writeFile(dbPath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error saving DB:', error);
    throw error;
  }
});

ipcMain.handle('load-db', async () => {
  try {
    const dbPath = path.join(DB_PATH, 'local.json');
    const data = await fs.promises.readFile(dbPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading DB:', error);
    return null;
  }
});