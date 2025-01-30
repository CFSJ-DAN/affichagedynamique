const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
<<<<<<< HEAD
const fs = require('fs');
const log = require('electron-log');

// Configure logs
log.transports.file.level = 'debug';
log.transports.file.resolvePathFn = () => path.join('C:\\APPS\\affichagedynamique\\logs', 'main.log');

// Base paths
const BASE_PATH = 'C:\\APPS\\affichagedynamique';
const CONTENT_PATH = path.join(BASE_PATH, 'content');
const DB_PATH = path.join(BASE_PATH, 'db');
const LOGS_PATH = path.join(BASE_PATH, 'logs');

// Create necessary directories
function ensureDirectoriesExist() {
  [BASE_PATH, CONTENT_PATH, DB_PATH, LOGS_PATH].forEach(dir => {
=======
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
>>>>>>> d10a24af2e42d821006b0db9075c52072fddaadd
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
}

function createWindow() {
<<<<<<< HEAD
  log.info('Creating main window');
  
=======
  // Créer la fenêtre principale
>>>>>>> d10a24af2e42d821006b0db9075c52072fddaadd
  const mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    webPreferences: {
<<<<<<< HEAD
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.cjs'),
      sandbox: false
    },
    fullscreen: true,
    autoHideMenuBar: true,
    kiosk: true // Enable kiosk mode
  });

  if (process.env.NODE_ENV === 'development') {
    log.info('Loading development URL');
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    log.info('Loading production build');
    mainWindow.loadFile(path.join(__dirname, '..', 'dist', 'index.html')).catch(err => {
      log.error('Failed to load index.html:', err);
    });
  }

  // Prevent window from being closed with Alt+F4
  mainWindow.on('close', (e) => {
    if (!app.isQuitting) {
      e.preventDefault();
    }
  });

  return mainWindow;
}

// IPC Handlers
ipcMain.handle('save-media', async (event, { id, data }) => {
  try {
    const filePath = path.join(CONTENT_PATH, id);
    await fs.promises.writeFile(filePath, Buffer.from(data, 'base64'));
    return filePath;
  } catch (error) {
    log.error('Error saving media:', error);
=======
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
>>>>>>> d10a24af2e42d821006b0db9075c52072fddaadd
    throw error;
  }
});

ipcMain.handle('save-db', async (event, data) => {
  try {
    const dbPath = path.join(DB_PATH, 'local.json');
    await fs.promises.writeFile(dbPath, JSON.stringify(data, null, 2));
  } catch (error) {
<<<<<<< HEAD
    log.error('Error saving DB:', error);
=======
    console.error('Error saving DB:', error);
>>>>>>> d10a24af2e42d821006b0db9075c52072fddaadd
    throw error;
  }
});

ipcMain.handle('load-db', async () => {
  try {
    const dbPath = path.join(DB_PATH, 'local.json');
    const data = await fs.promises.readFile(dbPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
<<<<<<< HEAD
    log.error('Error loading DB:', error);
    return null;
  }
});

app.whenReady().then(() => {
  log.info('App ready, initializing...');
  try {
    ensureDirectoriesExist();
    createWindow();
  } catch (error) {
    log.error('Error during initialization:', error);
  }
});

// Prevent app from closing with Alt+F4
app.on('before-quit', () => {
  app.isQuitting = true;
});

app.on('window-all-closed', () => {
  log.info('All windows closed');
  if (process.platform !== 'darwin') {
    app.quit();
  }
=======
    console.error('Error loading DB:', error);
    return null;
  }
>>>>>>> d10a24af2e42d821006b0db9075c52072fddaadd
});