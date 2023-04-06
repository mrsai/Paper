import { generateId } from '@/renderer/utils/index'
import { defineStore } from 'pinia'
import { IDirectory, ETypes, IDirectoryItem, EExt } from '../types/sidebar'

export const useDirectoryStore = defineStore('Directory', {
  state: () =>
    ({
      list: [],
      selected: undefined,
      selectedKey: undefined,
      expandedKey: []
    } as IDirectory),
  getters: {
    selectedFile: (state) => state.list
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
        isEditing: false,
        ext: EExt.MarkDown
      } as IDirectoryItem
      Object.assign(item, data)
      // remove ext if type is folder
      if (item.type === ETypes.Folder) {
        delete item.ext
        delete item.pid
      }
      if (item.type === ETypes.File) {
        item.name = `${item.name}`
        delete item.children
      }
      // add to list
      if (item.pid) {
        // eslint-disable-next-line no-debugger
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
      // remove from tree list
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
    }
  }
})
