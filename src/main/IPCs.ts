import fse from 'fs-extra'
import { join } from 'path'
import { BrowserWindow, ipcMain, shell, dialog } from 'electron'
import Constants from './utils/Constants'

/*
 * IPC Communications
 * */
export default class IPCs {
  static initialize(window: BrowserWindow): void {
    // Get application version
    ipcMain.on('msgRequestGetVersion', () => {
      window.webContents.send('msgReceivedVersion', Constants.APP_VERSION)
    })

    // Open url via web browser
    ipcMain.on('msgOpenExternalLink', async (event, url: string) => {
      await shell.openExternal(url)
    })

    ipcMain.handle('open-file-dialog', async (event) => {
      const result = await dialog.showOpenDialog(window, {
        title: 'Select the Folder to Save',
        properties: ['openDirectory']
      })
      return result.filePaths[0]
    })

    ipcMain.handle('get-unused-name', async (event, data) => {
      let { name, path, ext } = data
      const staticName = name
      let index = 1
      while (await fse.pathExists(join(path, name))) {
        name = `${staticName}(${index})${ext}`
        index++
      }
      return name
    })

    ipcMain.handle('create-local-folder', async (event, { path, name }) => {
      const folderPath = join(path, name)
      const res = fse.pathExistsSync(folderPath)
      if (!res) {
        fse.mkdirSync(folderPath)
      }
    })

    ipcMain.handle('create-local-file', async (event, { path, name }) => {
      const folderPath = join(path, name)
      const res = fse.pathExistsSync(folderPath)
      if (!res) {
        fse.mkdirSync(folderPath)
      }
    })

    ipcMain.handle('rename-folder', async (event, data, newName) => {
      const newData = JSON.parse(data)
      const oldPath = join(newData.path, newData.name)
      const newPath = join(newData.path, newName)
      console.log(fse.pathExistsSync(newPath), newPath)
      if (fse.pathExistsSync(newPath)) {
        return {
          success: false,
          msg: '文件夹已经存在！'
        }
      } else {
        try {
          fse.renameSync(oldPath, newPath)
          return {
            success: true,
            msg: '修改成功'
          }
        } catch (err) {
          return {
            success: false,
            msg: `重命名文件夹时出错：${err}`
          }
        }
      }
    })
  }
}
