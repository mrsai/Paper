import {globalShortcut, app, ipcMain} from 'electron'


export const registerShortcuts = (mainWindow) => {
  const ret = globalShortcut.register('CommandOrControl+M', () => {
    try {
      mainWindow.webContents.send('save-current-file',"saved")
    }catch (e) {
      console.log(e);
    }
  })

  if (!ret) {
    console.log('registration failed')
  }
}

export const unRegisterShortcuts = (mainWindow) => {
  globalShortcut.unregisterAll()
}
