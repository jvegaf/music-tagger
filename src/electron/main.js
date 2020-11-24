const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const id3 = require('./services/id3Service');

let mainWindow

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true
    }
  })

  mainWindow.setMenuBarVisibility(false)

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


