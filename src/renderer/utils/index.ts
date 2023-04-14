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

  static async selectFolder(): Promise<any> {
    return await window.mainApi.invoke('open-file-dialog')
  }

  static async openFile(): Promise<string> {
    return await window.mainApi.send(file.openFile)
  }

  static async saveFile(): Promise<any> {
    return await window.mainApi.send(file.saveFile)
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

  static async pathJoin(...paths: string[]): Promise<string> {
    return await window.mainApi.invoke('path-join', ...paths)
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
  saveSettings
} = Utils
