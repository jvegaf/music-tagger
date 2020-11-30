const {app, BrowserWindow, ipcMain, dialog} = require('electron');
const id3 = require('./services/id3Service');
const coverFinder = require('./services/coverFinderService');
const fetch = require('node-fetch');
const Scraper = require('electron-images-scraper');

const scraper = new Scraper({
  puppeteer: {
    //headless: false,
  },
  tbs: {
    isz: "m", // medium size
    iar: "s", // square format
    ift: "jpg" // ift: "png"
  },
});

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

ipcMain.on('open-folder', async () => {
  dialog
    .showOpenDialog(mainWindow, {
      properties: ['openDirectory'],
    })
    .then(async (result) => {
      let tags = await id3.getTagsFromPath(result.filePaths[0]);
      mainWindow.webContents.send('tags-extracted', tags);
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

ipcMain.on('fetch-cover', async (event, item) => {
  try {
    const result = await coverFinder.findCovers(scraper, item);
    console.log(result);
    mainWindow.webContents.send('covers-fetched', result);
  } catch (err) {
    mainWindow.webContents.send('covers-fetch-error', err);
  }
})

ipcMain.on('imageUrl-to-buffer', async (event, url) => {
  try {
    const response = await fetch(url);
    const imgBuff = await response.buffer();
    mainWindow.webContents.send('buffer-image', imgBuff);
  } catch (err) {
    console.log(err);
    mainWindow.webContents.send('covers-fetch-error', err);
  }

})
