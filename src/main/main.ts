/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import fs from 'fs';
import { app, BrowserWindow, shell, ipcMain, dialog } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import mime from 'mime';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import { Channels } from './api';

const isDarwin = process.platform === 'darwin';

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  app.dock.setIcon(getAssetPath('icon.png'));

  mainWindow = new BrowserWindow({
    show: false,
    width: 800,
    height: 800,
    minWidth: 500,
    minHeight: 500,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      webSecurity: false,
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

const getDirFilePaths = async (dir: string): Promise<string[]> => {
  const dirents = await fs.promises.readdir(dir, {
    withFileTypes: true,
  });

  const getFilePath = (name: string) => path.join(dir, '/', name);

  const filePaths = dirents
    .filter((d) => d.isFile())
    .map((d) => getFilePath(d.name));

  const dirFilePaths = (
    await Promise.all(
      dirents
        .filter((d) => d.isDirectory())
        .map((d) => getDirFilePaths(getFilePath(d.name)))
    )
  ).flat();

  return [...filePaths, ...dirFilePaths];
};

const isImageMimeType = (filepath: string): boolean => {
  const regexp = new RegExp(/bmp|ico|gif|jpeg|png|svg|webp/);
  const mimetype = mime.getType(filepath);
  return (mimetype && regexp.test(mimetype)) || false;
};

ipcMain.handle(
  Channels.GET_IMAGE_PATHS_FROM_FIR,
  async (_e: Event, dirPath: string) => {
    return getDirFilePaths(dirPath)
      .then((filePaths) => filePaths.filter((p) => isImageMimeType(p)))
      .catch((err) => log.error(err));
  }
);

ipcMain.handle(Channels.GET_DIR_NAME, async (_e: Event, dirPath: string) => {
  return path.basename(dirPath);
});

ipcMain.handle(Channels.SELECT_DIR, async () => {
  if (!mainWindow) return Promise.reject();
  return dialog
    .showOpenDialog(mainWindow, {
      properties: ['openDirectory'],
    })
    .then((result) => {
      if (!result.canceled && result.filePaths.length !== 0) {
        return result.filePaths[0];
      }
      return null;
    })
    .catch((err) => {
      log.error(err);
    });
});

ipcMain.handle(Channels.CONFIRM, async (_e: Event, question: string) => {
  if (!mainWindow) return Promise.reject();
  return dialog
    .showMessageBox(mainWindow, {
      type: 'question',
      buttons: ['Cancel', 'Ok'],
      defaultId: 1,
      title: 'Question',
      message: question,
    })
    .then((result) => {
      return result.response === 1;
    })
    .catch((err) => log.error(err));
});

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (!isDarwin) {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
