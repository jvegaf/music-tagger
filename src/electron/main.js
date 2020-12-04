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
      mainWindow.webContents.send('processing');
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

ipcMain.handle('save-tags', (event, item) => {
  id3.updateTagsOfItem(item);
  return true;
})

ipcMain.handle('save-all-tags', (event, items) => {
  items.forEach(item => id3.updateTagsOfItem(item));
  return true;
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
    return await getImageBuffer(url);
  } catch (err) {
    console.log(err);
    mainWindow.webContents.send('covers-fetch-error', err);
  }
})

ipcMain.handle('find-tags', async (event, item) => {
  try {
    const newItem =  await mxmService.findTags(item);
    if (item.imageTag === undefined){
      const coverUrl = await coverFinder.getCoverUrl(newItem);
      const buffer = await getImageBuffer(coverUrl);
      newItem.imageTag = {
        description: '', imageBuffer: buffer, mime: 'jpeg', type: {id: 3, name: 'front cover'}
      };
    }
    return newItem;
  } catch (e) {
    console.log(e);
  }
})

async function getImageBuffer(url) {
  const response = await fetch(url);
  return await response.buffer();
}
