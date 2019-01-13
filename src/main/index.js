/* eslint-disable */
import { app, BrowserWindow, Menu } from 'electron'
import './authentication';
import macMenu from './macMenu';
/* eslint-enable */
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = true;

let mainWindow;
let winURL = 'http://localhost:9080';

if (process.env.NODE_ENV === 'development') {
  try {
    // eslint-disable-next-line
    require('electron-debug')({
      showDevTools: true });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log('Failed to install `electron-debug`: Please set `NODE_ENV=production` before build to avoid installing debugging packages. ');
  }
} else {
  winURL = `file://${__dirname}/index.html`;

  /**
   * Set `__static` path to static files in production
   * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
   */
  // eslint-disable-next-line
  global.__static = require('path')
    .join(__dirname, '/static')
    .replace(/\\/g, '\\\\') // eslint-disable-line
}

function installDevTools() {
  try {
    require('devtron').install() //eslint-disable-line
    require('vue-devtools').install() //eslint-disable-line
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log('Failed to install `devtron` & `vue-devtools`: Please set `NODE_ENV=production` before build to avoid installing debugging packages. ');
  }
}

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    minHeight: 720,
    height: 720,
    useContentSize: true,
    width: 1280,
    minWidth: 1280,
    vibrancy: 'ultra-dark',
    show: false,
    webPreferences: {
      nodeIntegrationInWorker: true,
      webSecurity: false,
    },
  });
  mainWindow.loadURL(winURL);

  // Show when loaded
  mainWindow.on('ready-to-show', () => {
    mainWindow.show();
    mainWindow.focus();

    if (
      process.env.ELECTRON_ENV === 'development'
      || process.argv.indexOf('--debug') !== -1
    ) {
      mainWindow.webContents.openDevTools();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Menu
  // Check if we are on a Mac
  if (process.platform === 'darwin') {
    // Create our menu entries so that we can use MAC shortcuts
    Menu.setApplicationMenu(macMenu());
  }
}

app.on('ready', () => {
  createWindow();

  if (process.env.NODE_ENV === 'development') {
    installDevTools();
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
