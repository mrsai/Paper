import { file } from '@/commons/events'
import {v4 as uuidv4 } from 'uuid'

export default class Utils {
  static getCurrentLocale(): string {
    return navigator?.language?.split('-')[0] || 'en'
  }

  static generateId(): string {
    return uuidv4();
  }

  static async openExternal(url: string): Promise<void> {
    await window.mainApi.send('msgOpenExternalLink', url)
  }

  static async openFile(): Promise<string> {
    return await window.mainApi.send(file.openFile)
  }
}

export const { getCurrentLocale, openExternal,generateId } = Utils