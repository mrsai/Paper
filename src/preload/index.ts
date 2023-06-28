import { contextBridge, ipcRenderer } from 'electron'
import fse from 'fs-extra'

// Whitelist of valid channels used for IPC communication (Send message from Renderer to Main)
const mainAvailChannels: string[] = [
  'msgRequestGetVersion',
  'msgOpenExternalLink',
  'open-save-file-dialog',
  'create-local-folder',
  'create-local-file',
  'open-local-file',
  'save-local-file',
  'open-file-dialog',
  'get-unused-name',
  'save-directory',
  'read-directory',
  'get-clipboard',
  'rename-folder',
  'save-settings',
  'get-settings',
  'rename-file',
  'path-join',
  'path-parse',
  'copy-file',
  'quit'
]
const rendererAvailChannels: string[] = [
  'msgReceivedVersion',
  'save-current-file',
  'open-associate-file',
  'quit'
]

contextBridge.exposeInMainWorld('mainApi', {
  send: (channel: string, ...data: any[]): void => {
    if (mainAvailChannels.includes(channel)) {
      ipcRenderer.send.apply(null, [channel, ...data])
    } else {
      throw new Error(`Send failed: Unknown ipc channel name: ${channel}`)
    }
  },
  receive: (channel: string, cbFunc: Function): void => {
    if (rendererAvailChannels.includes(channel)) {
      ipcRenderer.on(channel, (event, ...args) => cbFunc(event, ...args))
      console.log(`Receive: ${channel}`)
    } else {
      throw new Error(`Receive failed: Unknown ipc channel name: ${channel}`)
    }
  },
  invoke: async (channel: string, ...data: any[]): Promise<any> => {
    if (mainAvailChannels.includes(channel)) {
      return await ipcRenderer.invoke.apply(null, [channel, ...data])
    }
    throw new Error(`Invoke failed: Unknown ipc channel name: ${channel}`)
  }
})
