import { globalShortcut } from 'electron'

// 这个快捷键可以注册在renderer渲染进程中
export const registerShortcuts = (mainWindow) => {
  // let ret = globalShortcut.register('CommandOrControl+S', () => {
  //   try {
  //     mainWindow.webContents.send('save-current-file', 'saved')
  //   } catch (e) {
  //     console.log(e)
  //   }
  // })
  // if (!ret) {
  //   console.log('registration failed!')
  // }
}

export const unRegisterShortcuts = (mainWindow) => {
  globalShortcut.unregisterAll()
}
