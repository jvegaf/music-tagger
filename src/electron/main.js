const {app, BrowserWindow, ipcMain, dialog} = require('electron');
require('dotenv').config();
const id3 = require('./services/id3Service');
const coverFinder = require('./services/coverFinderService');
const fetch = require('node-fetch');
const spotiService = require('./services/spotifyService');
const mxmService = require('./services/musixMatchService');

if (require('electron-squirrel-startup')) return app.quit();


let mainWindow

function createWindow() {
  mainWindow = new BrowserWindow({
    minWidth: 1200,
    minHeight: 800,
    frame: process.platform === 'win32',
    backgroundColor: "#80FFFFFF",
    webPreferences: {
      nodeIntegration: true,
      allowRunningInsecureContent: false,
      preload: __dirname + './../../node_modules/@marcj/angular-desktop-ui/preload.js',
      nativeWindowOpen: true,
    },
  })

  mainWindow.setMenuBarVisibility(false);
  mainWindow.loadFile('dist/music-tagger/index.html')
  // mainWindow.webContents.openDevTools()
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

ipcMain.handle('open-folder', async () => {
  return await dialog
    .showOpenDialog(mainWindow, {
      properties: ['openDirectory'],
    })
    .then(async (result) => {
      return await id3.getTagsFromPath(result.filePaths[0]);
    })
    .catch((err) => {
      console.log(err);
    });
});

ipcMain.on('clean-filenames', (event, args) => {
  const tags = id3.cleanFilenames(args.items, args.dirtyText);
  mainWindow.webContents.send('tags-extracted', tags);
})

ipcMain.on('update-tags', (event, items) => {
  items.forEach(item => id3.updateTagsOfItem(item));
  mainWindow.webContents.send('tags-saved');
})

ipcMain.handle('fetch-cover', async (event, item) => {
  try {
    return await coverFinder.findCovers(item);
  } catch (err) {
    mainWindow.webContents.send('covers-fetch-error', err);
  }
})

ipcMain.handle('imageUrl-to-buffer', async (event, url) => {
  try {
    const response = await fetch(url);
    return await response.buffer();
  } catch (err) {
    console.log(err);
    mainWindow.webContents.send('covers-fetch-error', err);
  }
})

ipcMain.handle('find-tags', async (event, item) => {
  try {
    return await mxmService.findTags(item);
  } catch (e) {
    console.log(e);
  }
})
