const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
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
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
}

function createWindow() {
  log.info('Creating main window');
  
  const mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    webPreferences: {
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
    throw error;
  }
});

ipcMain.handle('save-db', async (event, data) => {
  try {
    const dbPath = path.join(DB_PATH, 'local.json');
    await fs.promises.writeFile(dbPath, JSON.stringify(data, null, 2));
  } catch (error) {
    log.error('Error saving DB:', error);
    throw error;
  }
});

ipcMain.handle('load-db', async () => {
  try {
    const dbPath = path.join(DB_PATH, 'local.json');
    const data = await fs.promises.readFile(dbPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
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
});