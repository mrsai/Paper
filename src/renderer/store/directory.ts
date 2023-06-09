import {
  generateId,
  openLocalFile,
  pathParse,
  selectSaveFolder,
  saveLocalFile
} from '@/renderer/utils'
import { defineStore } from 'pinia'
import { IDirectory, ETypes, IDirectoryItem, EExt } from '../types/sidebar'

export const useDirectoryStore = defineStore('Directory', {
  state: () =>
    ({
      list: [],
      isSaved: true,
      selectedKey: undefined,
      expandedKey: [],
      temporary: undefined
    } as IDirectory),
  getters: {
    selectedFile: (state) => {
      if (state.temporary?.id === state.selectedKey) {
        return state.temporary
      }
      const find = (list: any) => {
        for (const item of list) {
          if (item.id === state.selectedKey && item.type === ETypes.File) {
            return item
          }
          if (item.children) {
            return find(item.children)
          }
        }
      }
      return find(state.list)
    }
  },
  actions: {
    create(data: any) {
      const item = {
        pid: undefined,
        id: generateId(),
        name: 'New File',
        path: '',
        type: ETypes.File,
        children: [],
        updateAt: Date.now().toString(),
        origin: false,
        ext: EExt.MarkDown,
        icon: ['fa-solid', 'fa-folder'],
        expIcon: ['fa-solid', 'fa-folder-open'],
        isEditing: false,
        isSaved: true,
        isTemporary: false
      } as IDirectoryItem
      Object.assign(item, data)
      // remove ext if type is folder
      if (item.type === ETypes.Folder) {
        delete item.ext
        delete item.pid
      }
      if (item.type === ETypes.File) {
        item.name = `${item.name}`
        item.icon = ['far', 'file']
        delete item.children
      }
      // add to list
      if (item.pid) {
        const parent = this.list?.find((it) => it.id === item.pid)
        if (parent) {
          if (!parent.children) parent.children = []
          parent.children.push(item)
        }
      } else {
        this.list?.push(item)
      }
    },
    update(data: any) {
      if (this.temporary && data.isTemporary) {
        Object.assign(this.temporary, data)
        return
      }
      // 使用广度优先算法查找子节点
      const queue: any = [...this.list!]
      while (queue.length) {
        const item = queue.shift()
        if (item.id === data.id) {
          Object.assign(item, data)
          break
        }
        if (item.children) {
          queue.push(...item.children)
        }
      }
    },
    del(data: any) {
      const id = data.id || data
      for (const i in this.list) {
        if (this.list[i].id === id) {
          this.list.splice(parseInt(i), 1)
          break
        }
        if (this.list[i].children) {
          this.list[i].children = this.list[i].children.filter((item) => item.id !== id)
        }
      }
    },
    createTemp(data: any) {
      const item = {
        pid: undefined,
        id: generateId(),
        name: 'New File',
        path: '',
        type: ETypes.File,
        updateAt: Date.now().toString(),
        ext: EExt.MarkDown,
        isSaved: false,
        content: '#Yep',
        isEditing: false,
        isTemporary: true,
        origin: false
      } as IDirectoryItem
      Object.assign(item, data)
      this.temporary = item
      return this.temporary
    },
    updateTemporary(data: any) {
      this.temporary = { ...this.temporary, ...data }
    },
    updateList(data: any) {
      this.list = data
    },
    async handleOpenDoc(data: any) {
      if (!data.content && data.path) {
        openLocalFile(data).then((content) => {
          this.update({ ...data, content })
          this.selectedKey = data.id
        })
      } else {
        this.selectedKey = data.id
      }
    },
    async handleSaveDoc(next?: Function) {
      if (this.selectedFile && this.selectedFile.id && !this.selectedFile.isSaved) {
        let path = this.selectedFile.path
        const saveData = { ...this.selectedFile }
        if (!path) {
          path = await selectSaveFolder(this.selectedFile)
          if (!path) {
            // 取消保存，直接执行下一步的函数
            next?.()
            return false
          }
          const { dir, name } = await pathParse(path)
          Object.assign(saveData, { path: dir, name })
          this.update(saveData)
        }
        saveLocalFile(saveData).then(() => {
          this.update({ ...saveData, isSaved: true })
          next?.()
        })
      } else {
        next?.()
      }
    },
    async handleCreateTemp() {
      const temp = this.createTemp({
        name: 'untitled',
        content: '# untitled\n ... '
      })
      this.selectedKey = temp.id
    },
    async openFileByPath(path: string) {
      const { dir, name, ext } = await pathParse(path)
      const createData = { name, ext, path: dir }
      const content = await openLocalFile(createData)
      const temp = this.createTemp({ ...createData, content })
      this.selectedKey = temp.id
    }
  }
})
