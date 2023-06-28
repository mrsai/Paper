import { file } from '@/commons/events'
import { v4 as uuidv4 } from 'uuid'

export default class Utils {
  static getCurrentLocale(): string {
    return navigator?.language?.split('-')[0] || 'en'
  }

  static generateId(): string {
    return uuidv4()
  }

  static async openExternal(url: string): Promise<void> {
    await window.mainApi.invoke('msgOpenExternalLink', url)
  }

  static async createLocalFolder(folder: any): Promise<any> {
    return await window.mainApi.invoke('create-local-folder', folder)
  }

  static async createLocalFile(fileData: any): Promise<any> {
    return await window.mainApi.invoke('create-local-file', fileData)
  }

  static async selectFolder(options?: any): Promise<any> {
    return await window.mainApi.invoke('open-file-dialog', options)
  }

  static async selectSaveFolder(fileData: any): Promise<any> {
    return await window.mainApi.invoke('open-save-file-dialog', JSON.stringify(fileData))
  }

  static async openLocalFile(fileData: any): Promise<string> {
    return await window.mainApi.invoke('open-local-file', JSON.stringify(fileData))
  }

  static async saveLocalFile(fileData: any): Promise<any> {
    return await window.mainApi.invoke('save-local-file', JSON.stringify(fileData))
  }

  static async getUnusedName(path: string, name: string, ext: string): Promise<string> {
    return await window.mainApi.invoke('get-unused-name', { name, path, ext })
  }

  static async renameFolder(data: any, newName: string): Promise<any> {
    return await window.mainApi.invoke('rename-folder', JSON.stringify(data), newName)
  }

  static async renameFile(data: any, newName: string): Promise<any> {
    return await window.mainApi.invoke('rename-file', JSON.stringify(data), newName)
  }

  static async copyFile(from: string, to: string): Promise<any> {
    return await window.mainApi.invoke('copy-file', from, to)
  }

  static async pathJoin(...paths: string[]): Promise<string> {
    return await window.mainApi.invoke('path-join', ...paths)
  }

  static async pathParse(path: string): Promise<any> {
    return await window.mainApi.invoke('path-parse', path)
  }

  static async saveDirectory(data: any): Promise<any> {
    return await window.mainApi.send('save-directory', JSON.stringify(data))
  }

  static async readDirectory(): Promise<any> {
    return await window.mainApi.invoke('read-directory')
  }

  static async saveSettings(data: any): Promise<any> {
    return await window.mainApi.send('save-settings', JSON.stringify(data))
  }

  static async getSettings(): Promise<any> {
    return await window.mainApi.invoke('get-settings')
  }

  static async getClipboard(): Promise<any> {
    return await window.mainApi.invoke('get-clipboard')
  }

  static async listenFileOpen(cb: Function): Promise<void> {
    window.mainApi.receive('open-associate-file', (event: any, data: any) => {
      data && cb?.(data)
    })
  }

  static async listenFileSave(cb: Function): Promise<void> {
    window.mainApi.receive('save-current-file', (event: any, data?: any) => {
      cb?.(data)
    })
  }

  static async quitApp(): Promise<void> {
    return window.mainApi.send('quit')
  }
}

export const {
  getCurrentLocale,
  openExternal,
  generateId,
  createLocalFolder,
  selectFolder,
  getUnusedName,
  renameFolder,
  renameFile,
  createLocalFile,
  pathJoin,
  saveDirectory,
  readDirectory,
  getSettings,
  saveSettings,
  openLocalFile,
  saveLocalFile,
  selectSaveFolder,
  pathParse,
  getClipboard,
  listenFileOpen,
  copyFile,
  listenFileSave,
  quitApp
} = Utils
