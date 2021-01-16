const {app, BrowserWindow, ipcMain, dialog} = require('electron');
require('dotenv').config();
const id3 = require('./services/id3Service');
const recursiveReadSync = require('recursive-readdir-sync');
const coverFinder = require('./services/coverFinderService');
const finderServ = require('./services/onlineFinderService');
const path = require('path');
const fs = require('fs');

if (require('electron-squirrel-startup')) return app.quit();

const titleBar = () => {
  // if (process.platform !== 'darwin') { return 'default';}
  return 'hidden';
}

let mainWindow

function createWindow() {
  mainWindow = new BrowserWindow({
    minWidth: 1200,
    minHeight: 800,
    frame: false,
    // frame: process.platform !== 'linux',
    backgroundColor: "#80FFFFFF",
    webPreferences: {
      nodeIntegration: true,
      allowRunningInsecureContent: false,
      preload: __dirname + './../../node_modules/@marcj/angular-desktop-ui/preload.js',
      nativeWindowOpen: true,
    },
    titleBarStyle: titleBar(),
    icon: path.join(process.cwd(),'src', 'assets','icons', 'png', '64x64.png')
  })

  mainWindow.setMenuBarVisibility(false);
  mainWindow.loadFile('dist/music-tagger/index.html')
  mainWindow.maximize()
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
      if (result.canceled) {return null;}
      return recursiveReadSync(result.filePaths[0])
        .filter((file) => path.extname(file).toLowerCase() === '.mp3');
    })
    .catch((err) => {
      console.log(err);
    });
});

ipcMain.on('get-tags', (event, file) => {
  const resultItem = id3.getTagsOfFile(file);
  event.reply('tag-item', resultItem);
})

ipcMain.on('clean-filename', (event, args) => {
  const resultItem =  id3.cleanFilename(args.item, args.selection);
  console.log(`${resultItem.filename} cleaned`);
  event.reply('tag-completed', resultItem);
})

ipcMain.on('save-tags',  (event, item) => {
  id3.saveTags(item);
  event.reply('tags-saved');
})

ipcMain.handle('fetch-cover', async (event, item) => {
  try {
    return await coverFinder.findCovers(item);
  } catch (err) {
    mainWindow.webContents.send('covers-fetch-error', err);
  }
})

ipcMain.handle('imageTag-from-Url', async (event, url) => {
  try {
    return await id3.getImageTag(url);
  } catch (err) {
    console.log(err);
    mainWindow.webContents.send('covers-fetch-error', err);
  }
})

ipcMain.on('find-tags', async (event, item) => {
  try {
    const newItem = await finderServ.findTags(item);
    // id3.saveTags(newItem);
    event.reply('track-updated', newItem);
  } catch (e) {
    console.log(e);
  }
})

ipcMain.on('clean-from-menu', (event, selectedText) =>{
  console.log(selectedText);
  mainWindow.webContents.send('clean-selection', selectedText);
});

ipcMain.on('remove-file', (event, item) =>{
  console.log(`removing ${item.filepath}`);
  fs.unlink(item.filepath, (err) => {
    if (err) {
      console.error(err)
    }
  });
});
