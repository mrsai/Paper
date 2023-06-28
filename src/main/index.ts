import { app, WebContents, RenderProcessGoneDetails, Menu } from 'electron'
import Constants from './utils/Constants'
import { createErrorWindow, createMainWindow } from './MainRunner'
import { macOSDisableDefaultMenuItem } from './utils/Menus'
import { unRegisterShortcuts } from './shortcut'
import { openAssociatedFile } from './IPCs'
import Update from './Updater'

let mainWindow
let errorWindow

app.on('ready', () => {
  macOSDisableDefaultMenuItem()
  mainWindow = createMainWindow(mainWindow)
  // 自动更新功能尚未验证
  Update.check()
})

app.on('activate', () => {
  if (!mainWindow) {
    mainWindow = createMainWindow(mainWindow)
  }
})

app.on('will-finish-launching', () => {
  app.on('open-file', (event, path) => {
    event.preventDefault()
    openAssociatedFile(mainWindow, path)
    process.argv.push(path)
  })
})
app.on('second-instance', (event, argv) => {
  if (process.platform !== 'darwin') {
    const path = argv[argv.length - 1]
    path && openAssociatedFile(mainWindow, path)
  }
})

app.on('window-all-closed', (event) => {
  mainWindow = null
  errorWindow = null

  if (!Constants.IS_MAC) {
    app.quit()
  }
})

app.on('will-quit', (event) => {
  unRegisterShortcuts(mainWindow)
})

app.on(
  'render-process-gone',
  (event: Event, webContents: WebContents, details: RenderProcessGoneDetails) => {
    errorWindow = createErrorWindow(errorWindow, mainWindow, details)
  }
)

process.on('uncaughtException', () => {
  errorWindow = createErrorWindow(errorWindow, mainWindow)
})
