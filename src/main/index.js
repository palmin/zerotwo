/* eslint-disable */
import { app, BrowserWindow, ipcMain, Menu, MenuItem, shell } from 'electron'
import os from 'os';
import electronOauth2 from 'electron-oauth2';
import { oauth as oauthConfig } from './config';
import { version } from '../../package.json';
/* eslint-enable */
const windowParams = {
  alwaysOnTop: true,
  autoHideMenuBar: true,
  webPreferences: {
    nodeIntegration: false,
  },
};
const aniListOAuth = electronOauth2(oauthConfig, windowParams);

ipcMain.on('aniList-oauth', (event, action, refreshToken) => {
  if (action === 'getToken') {
    aniListOAuth.getAccessToken({})
      .then((token) => {
        aniListOAuth.getAuthorizationCode()
          .then((authToken) => {
            event.sender.send('aniList-oauth-reply', token, authToken);
          }, (err) => {
            // eslint-disable-next-line no-console
            console.log('Error while getting token', err);
          });
      }, (err) => {
        // eslint-disable-next-line no-console
        console.log('Error while getting token', err);
      });
  } else if (action === 'refreshToken') {
    aniListOAuth.refreshToken(refreshToken)
      .then((newToken) => {
        event.sender.send('aniList-oauth-refresh', newToken);
      }, (err) => {
        // eslint-disable-next-line no-console
        console.log('Error while getting token', err);
      });
  } else if (action === 'authorizationToken') {
    aniListOAuth.getAuthorizationCode()
      .then((token) => {
        event.sender.send('aniList-oauth-authorize', token);
      }, (err) => {
        // eslint-disable-next-line no-console
        console.log('Error while getting token', err);
      });
  }
});

process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = true;

let mainWindow;
let winURL = 'http://localhost:9080';

if (process.env.NODE_ENV === 'development') {
  try {
    // eslint-disable-next-line
    require('electron-debug')({
      showDevTools: true,
    });
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

  // mainWindow.setMenu(null)
  mainWindow.loadURL(winURL);

  // Show when loaded
  mainWindow.on('ready-to-show', () => {
    mainWindow.show();
    mainWindow.focus();

    if (
      process.env.ELECTRON_ENV === 'development' ||
      process.argv.indexOf('--debug') !== -1
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
    Menu.setApplicationMenu(Menu.buildFromTemplate([
      {
        label: app.getName(),
        submenu: [
          { role: 'about' },
          { type: 'separator' },
          { role: 'hide' },
          { role: 'hideothers' },
          { role: 'unhide' },
          { type: 'separator' },
          { role: 'quit' },
        ],
      },
      {
        label: 'Edit',
        submenu: [
          { role: 'undo' },
          { role: 'redo' },
          { type: 'separator' },
          { role: 'cut' },
          { role: 'copy' },
          { role: 'paste' },
          { role: 'delete' },
          { role: 'selectall' },
        ],
      },
      {
        label: 'Window',
        submenu: [
          { role: 'close' },
          { role: 'minimize' },
          { role: 'zoom' },
          { type: 'separator' },
          { role: 'front' },
        ],
      },
      {
        label: 'Help',
        submenu: [
          {
            label: 'GitHub Issue Tracker',
            click() {
              shell.openExternal('https://github.com/NicoAiko/zerotwo/issues');
            },
          },
          {
            label: 'Create a Bug Issue on GitHub',
            click() {
              const content = encodeURIComponent(`# BUG REPORT\n\n*Please specify the bug you want to report.*\n\n___\n\nZeroTwo v${version}\n\n${os.platform()} ${os.release()}`);
              const url = `https://github.com/NicoAiko/zerotwo/issues/new?labels=bug🐞&body=${content}`;
              shell.openExternal(url);
            },
          },
          {
            label: 'ZeroTwo Homepage',
            click() {
              shell.openExternal('https://www.zerotwo.org');
            },
          },
        ],
      },
    ]));
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
