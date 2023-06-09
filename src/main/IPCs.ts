import fse from 'fs-extra'
import { join, parse } from 'path'
import { BrowserWindow, ipcMain, shell, dialog, app, clipboard } from 'electron'
import Constants from './utils/Constants'

/*
 * IPC Communications
 * TODO：
 * 需要重写成为 try catch 的形式来捕获处理所有的错误，return 给render 进程反馈给用户
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

    ipcMain.handle('open-file-dialog', async (event, options: any = {}) => {
      const result = await dialog.showOpenDialog(window, {
        title: 'Select the Folder to Save',
        properties: ['openDirectory'],
        ...options
      })
      return result.filePaths[0]
    })

    ipcMain.handle('get-unused-name', async (event, data) => {
      let { name, path, ext } = data
      const staticName = name
      let index = 1
      while (await fse.pathExists(join(path, `${name}${ext}`))) {
        name = `${staticName}(${index})`
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

    ipcMain.handle('create-local-file', async (event, { path, name, ext }) => {
      const filePath = join(path, `${name}${ext}`)
      const res = fse.pathExistsSync(filePath)
      if (!res) {
        try {
          fse.ensureFileSync(filePath)
          console.log(`File '${filePath}' has been created.`)
        } catch (err) {
          console.error(`Failed to create file '${filePath}': ${err}`)
        }
      }
    })

    ipcMain.handle('open-local-file', async (event, data) => {
      let filePath = ''
      try {
        const { path, name, ext } = JSON.parse(data)
        filePath = join(path, `${name}${ext}`)
        const res = fse.pathExistsSync(filePath)
        if (res) {
          return fse.readFileSync(filePath).toString()
        }
      } catch (err) {
        console.error(`Failed to create file '${filePath}': ${err}`)
      }
    })

    ipcMain.handle('open-save-file-dialog', async (event, data) => {
      const fileData = {
        name: 'unnamed',
        ext: '.md'
      }
      if (data) {
        try {
          const _data = JSON.parse(data)
          Object.assign(fileData, _data)
        } catch (error) {
          console.log('error', error)
        }
      }
      const result = await dialog.showSaveDialog(window, {
        defaultPath: `${fileData.name}${fileData.ext}`,
        title: 'Select the Folder to Save',
        buttonLabel: 'Save'
      })
      return result.filePath
    })

    ipcMain.handle('save-local-file', async (event, data) => {
      console.log(data)
      let filePath = ''
      try {
        const { path, name, ext, content } = JSON.parse(data)
        filePath = join(path, `${name}${ext}`)
        // 确保同路径同名的文件如果存在，则要给出提示信息。
        fse.ensureFileSync(filePath)
        fse.writeFileSync(filePath, content)
      } catch (err) {
        console.error(`Failed to create file '${filePath}': ${err}`)
      }
    })

    ipcMain.handle('rename-folder', async (event, data, newName) => {
      console.log('rename-folder', data, newName)
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

    ipcMain.handle('rename-file', async (event, data, newName) => {
      const originData = JSON.parse(data)
      const oldPath = join(originData.path, `${originData.name}${originData.ext}`)
      const newPath = join(originData.path, `${newName}${originData.ext}`)
      if (fse.pathExistsSync(newPath)) {
        return {
          success: false,
          msg: '文件已经存在！'
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
            msg: `重命名文件时出错：${err}`
          }
        }
      }
    })

    ipcMain.handle('path-join', async (event, ...paths) => {
      return join(...paths)
    })

    ipcMain.handle('path-parse', async (event, path) => {
      return parse(path)
    })

    ipcMain.on('save-directory', async (event, data) => {
      const filePath = join(app.getPath('appData'), app.name, 'directoryDB.json')
      try {
        const saveData = JSON.parse(data)
        saveData.forEach((item: any) => {
          if (item.content) {
            item.content = ''
          }
          if (item.children) {
            item.children.forEach((child: any) => {
              if (child.content) {
                child.content = ''
              }
            })
          }
        })
        // 确保文件存在
        fse.ensureFileSync(filePath)
        // 写入文件内容
        fse.writeJsonSync(filePath, saveData, { spaces: 2 })
        console.log(`JSON data written to file ${filePath}`)
      } catch (err) {
        console.error(`Error writing file ${filePath}: ${err}`)
        throw err
      }
    })

    ipcMain.handle('read-directory', async (event, path) => {
      const filePath = join(app.getPath('appData'), app.name, 'directoryDB.json')
      let data: any
      try {
        // 确保文件存在
        fse.ensureFileSync(filePath)
        // 读取文件内容
        data = fse.readFileSync(filePath)
        data = data.toString()
      } catch (err) {
        console.error(`Error reading file ${filePath}: ${err}`)
        throw err
      }
      return data ? JSON.parse(data) : []
    })

    ipcMain.handle('get-settings', async (event) => {
      const filePath = join(app.getPath('appData'), app.name, 'user-settings.json')

      try {
        // 尝试读取文件内容
        return await fse.readJson(filePath)
      } catch (err: any) {
        if (err.code === 'ENOENT') {
          // 如果文件不存在，则创建文件并写入初始化数据
          const initData = {
            theme: 'light',
            showSide: true,
            mode: 'normal',
            appColor: 'rgba(255, 69, 0, 0.68)',
            backgroundColor: 'rgba(255, 255, 255, 1)',
            backgroundImage: '',
            lang: 'en',
            server: '',
            editorFontFamily: 1,
            editorFontColor: 'rgba(0, 0, 0, 1)',
            editorLineHeight: 1.6,
            editorFontSize: 16,
            editorPadding: 10
          }
          await fse.outputJson(filePath, initData)
          return initData
        } else {
          // 如果出现其他错误，则抛出异常
          throw err
        }
      }
    })

    ipcMain.on('save-settings', async (event, data) => {
      const filePath = join(app.getPath('appData'), app.name, 'user-settings.json')
      try {
        fse.ensureFileSync(filePath)
        fse.writeJsonSync(filePath, JSON.parse(data))
      } catch (err) {
        console.error(`Error writing file ${filePath}: ${err}`)
        throw err
      }
    })

    ipcMain.on('quit', () => {
      app.quit()
    })
    ipcMain.handle('get-clipboard', (event) => {
      return clipboard.readText()
    })
  }
}
