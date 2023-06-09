import { app, BrowserWindow, RenderProcessGoneDetails, Menu } from 'electron'
import Constants from './utils/Constants'
import IPCs, { openAssociatedFile, notifyToSaveDoc, shouldQuite } from './IPCs'
import { registerShortcuts, unRegisterShortcuts } from './shortcut'

const exitApp = (mainWindow: BrowserWindow): void => {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.hide()
  }
  mainWindow.destroy()
  app.exit()
}

export const createMainWindow = async (mainWindow: BrowserWindow): Promise<BrowserWindow> => {
  mainWindow = new BrowserWindow({
    title: Constants.APP_NAME,
    show: false,
    width: Constants.IS_DEV_ENV ? 1500 : 1200,
    height: 650,
    useContentSize: true,
    webPreferences: Constants.DEFAULT_WEB_PREFERENCES,
    frame: false,
    titleBarStyle: 'hidden',
    trafficLightPosition: { x: 16, y: 10 }
  })

  mainWindow.setMenu(null)
  // Menu.setApplicationMenu(null)

  // 此地有bug，需要修复，会造成一个死循环，引入shouldQuite带来一个新问题，二次点击没效果。
  // 要解决这个问题，需要渲染线程来决定什么时候关闭窗口，而不是主线程。
  mainWindow.on('close', async (event: Event) => {
    if (shouldQuite) {
      exitApp(mainWindow)
    } else {
      event.preventDefault()
      notifyToSaveDoc(mainWindow)
    }
  })

  mainWindow.webContents.on('did-frame-finish-load', (): void => {
    if (Constants.IS_DEV_ENV) {
      mainWindow.webContents.openDevTools()
    }
  })

  mainWindow.once('ready-to-show', (): void => {
    mainWindow.setAlwaysOnTop(true)
    mainWindow.show()
    mainWindow.focus()
    mainWindow.setAlwaysOnTop(false)
    openAssociatedFile(mainWindow, '')
  })

  // mainWindow.on('focus', (): void => {
  //   mainWindow.show()
  //   registerShortcuts(mainWindow)
  // })

  // mainWindow.on('blur', (): void => {
  //   unRegisterShortcuts(mainWindow)
  // })

  if (Constants.IS_DEV_ENV) {
    await mainWindow.loadURL(Constants.APP_INDEX_URL_DEV)
  } else {
    await mainWindow.loadFile(Constants.APP_INDEX_URL_PROD)
  }
  // Initialize IPC Communication
  IPCs.initialize(mainWindow)

  return mainWindow
}

export const createErrorWindow = async (
  errorWindow: BrowserWindow,
  mainWindow: BrowserWindow,
  details?: RenderProcessGoneDetails
): Promise<BrowserWindow> => {
  if (!Constants.IS_DEV_ENV) {
    mainWindow?.hide()
  }

  errorWindow = new BrowserWindow({
    title: Constants.APP_NAME,
    show: false,
    resizable: Constants.IS_DEV_ENV,
    webPreferences: Constants.DEFAULT_WEB_PREFERENCES
  })

  errorWindow.setMenu(null)

  if (Constants.IS_DEV_ENV) {
    await errorWindow.loadURL(`${Constants.APP_INDEX_URL_DEV}#/error`)
  } else {
    await errorWindow.loadFile(Constants.APP_INDEX_URL_PROD, { hash: 'error' })
  }

  errorWindow.on('ready-to-show', (): void => {
    if (!Constants.IS_DEV_ENV && mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.destroy()
    }
    errorWindow.show()
    errorWindow.focus()
  })

  errorWindow.webContents.on('did-frame-finish-load', (): void => {
    if (Constants.IS_DEV_ENV) {
      errorWindow.webContents.openDevTools()
    }
  })

  return errorWindow
}
