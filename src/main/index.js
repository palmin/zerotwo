import { app, BrowserWindow, Menu } from 'electron'; // eslint-disable-line import/no-extraneous-dependencies
import { autoUpdater } from 'electron-updater';
// import fs from 'fs';
// import path from 'path';

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\') // eslint-disable-line
}

// function exists(file) {
//   return new Promise((resolve) => {
//     fs.exists(file, (result) => {
//       resolve(result);
//     });
//   });
// }

// function readFile(file) {
//   return new Promise((resolve, reject) => {
//     fs.readFile(file, 'utf8', (err, data) => {
//       if (err) {
//         reject(err);
//         return;
//       }
//       resolve(data);
//     });
//   });
// }

// function getUserDefinedLocale() {
//   const userData = app.getPath('userData');
//   const settingsConfig = path.join(userData, 'settings.json');
//   return exists(settingsConfig).then((result) => {
//     if (result) {
//       return readFile(settingsConfig).then((content) => {
//         try {
//           const value = JSON.parse(content).locale;
//           return value && typeof value === 'string' ? value.toLowerCase() : undefined;
//         } catch (e) {
//           return undefined;
//         }
//       });
//     }
//     return undefined;
//   });
// }

// const userDefinedLocale = getUserDefinedLocale();

let mainWindow;
const winURL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:9080'
  : `file://${__dirname}/index.html`;

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
    webPreferences: {
      webSecurity: false,
    },
  });

  mainWindow.webContents.on('will-navigate', (event) => {
    event.preventDefault();
  });

  mainWindow.loadURL(winURL);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // const locale = userDefinedLocale === undefined ? 'en' : userDefinedLocale;

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
    ]));
  }
}

app.on('ready', createWindow);

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

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */


autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall();
});

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') {
    autoUpdater.checkForUpdates();
  }
});
