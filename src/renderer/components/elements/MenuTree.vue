<script setup lang="ts">
import { nextTick, ref, h, computed } from 'vue'
import { useDirectoryStore } from '@/renderer/store/directory'
import { ETypes, EExt } from '@/renderer/types/sidebar'
import { storeToRefs } from 'pinia'
import ContextMenu from '@imengyu/vue3-context-menu'
import { useSettingStore } from '@/renderer/store/settings'
import { ElMessage, ElMessageBox } from 'element-plus'
import { tipsToSave } from '@/renderer/utils/helper'
import { useI18n } from 'vue-i18n'
import {
  createLocalFolder,
  selectFolder,
  getUnusedName,
  renameFolder,
  renameFile,
  copyFile,
  createLocalFile,
  pathJoin,
  saveDirectory,
  pathParse
} from '@/renderer/utils'

const { t } = useI18n()

const { list, selectedKey, expandedKey, selectedFile } = storeToRefs(useDirectoryStore())
const { create, update, del, handleOpenDoc, handleSaveDoc } = useDirectoryStore()
const treeRef = ref<any>(null)
const treeInput = ref<any>(null)

const sidebarContextmenu = (event: any, cb: any, type: any) => {
  let filters: any = []
  // 不同的点击目标，显示不同的菜单
  if (type === ETypes.Folder) {
    filters = ['createFolder']
  } else if (type === ETypes.File) {
    filters = ['createMarkdown', 'createRichText', 'createFolder']
  } else {
    filters = ['rename', 'sync', 'extractTranslate', 'generateBlog', 'delete', 'importMarkdown']
  }

  // ;<font-awesome-icon icon="fa-solid fa-user-secret" />
  const defaultMenu = {
    // theme: 'mac',
    x: event.x,
    y: event.y,
    zIndex: 3,
    items: [
      {
        key: 'createMarkdown',
        label: t('contextMenu.create-markdown'),
        // eslint-disable-next-line no-undef
        // icon: h(FontAwesomeIcon, { icon: 'fa fa-folder' }),
        onClick: cb.createMarkdown
      },
      {
        key: 'createRichText',
        label: t('contextMenu.create-rich-text'),
        icon: 'el-icon-edit',
        onClick: cb.createRichText,
        disabled: true
      },
      {
        key: 'createFolder',
        label: t('contextMenu.create-folder'),
        icon: 'el-icon-edit',
        onClick: cb.createFolder
      },
      {
        key: 'rename',
        label: t('contextMenu.rename'),
        icon: 'el-icon-edit',
        onClick: cb.rename
      },
      {
        key: 'sync',
        label: t('contextMenu.sync'),
        icon: 'el-icon-edit',
        onClick: cb.sync,
        disabled: true
      },
      {
        key: 'extractTranslate',
        label: t('contextMenu.translate'),
        icon: 'el-icon-edit',
        onClick: cb.extractTranslate,
        disabled: true
      },
      {
        key: 'generateBlog',
        label: t('contextMenu.blog'),
        onClick: cb.generateBlog,
        disabled: true
      },
      {
        key: 'importMarkdown',
        label: t('contextMenu.import-file'),
        onClick: cb.importMarkdown
      },
      {
        key: 'delete',
        label: t('contextMenu.delete'),
        onClick: cb.delete
      }
    ]
  }

  const items = defaultMenu.items.filter((item: any) => !filters.includes(item.key))
  const options = { ...defaultMenu, items }
  return options
}

const handleContextMenu = (event: any, data: any, node: any) => {
  const menu = sidebarContextmenu(
    event,
    {
      async createMarkdown() {
        // 找到文件夹的路径
        const path = await pathJoin(data.path, data.name)
        // 获取一个未使用的文件名
        const name = await getUnusedName(path, '新建文件', EExt.MarkDown)
        const markdown = {
          pid: data.id,
          name,
          type: ETypes.File,
          ext: EExt.MarkDown,
          isEditing: true,
          path,
          isSaved: true
        }
        // 创建本地文件
        await createLocalFile(markdown)
        // 创建文件结构数据
        create(markdown)
        // 展开菜单
        expandedKey.value = [data.id]
        await nextTick(() => {
          const t = setTimeout(() => {
            treeInput.value = treeRef.value?.el$?.querySelector('input')
            treeInput.value?.focus()
            treeInput.value?.select()
            clearTimeout(t)
          }, 100)
        })
      },
      async createRichText() {
        const path = await pathJoin(data.path, data.name)
        const name = await getUnusedName(path, '新建文件', EExt.RichText)
        const richText = {
          pid: data.id,
          name,
          type: ETypes.File,
          ext: EExt.RichText,
          isEditing: true,
          path,
          isSaved: true
        }
        await createLocalFile(richText)
        create(richText)
        expandedKey.value = [data.id]
        await nextTick(() => {
          const t = setTimeout(() => {
            treeInput.value = treeRef.value?.el$?.querySelector('input')
            treeInput.value?.focus()
            treeInput.value?.select()
            clearTimeout(t)
          }, 100)
        })
      },
      async createFolder() {
        const res = await selectFolder()
        if (res) {
          const name = await getUnusedName(res, '未命名', '')
          const folder = {
            name,
            type: ETypes.Folder,
            isEditing: true,
            path: res
          }
          await createLocalFolder(folder)
          create(folder)
          await nextTick(() => {
            treeInput.value = treeRef.value?.el$?.querySelector('input')
            treeInput.value?.focus()
            treeInput.value?.select()
          })
        }
      },
      rename() {
        update({
          ...data,
          isEditing: true
        })
        nextTick(() => {
          treeInput.value = treeRef.value?.el$?.querySelector('input')
          treeInput.value?.focus()
          treeInput.value?.select()
        })
      },
      delete() {
        ElMessageBox.confirm('确定要删除吗？该操作不会删除本地的文件。', '', {
          confirmButtonText: '删除',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            del(data.id)
          })
          .catch(() => {})
      },
      extractTranslate() {},
      sync() {},
      generateBlog() {},
      async importMarkdown() {
        const path = await selectFolder({ properties: ['openFile'] })
        if (path) {
          // 判断是否是已经存在该文件

          const { name, ext } = await pathParse(path)
          const newPath = await pathJoin(data.path, data.name)
          const createData = { name, ext, pid: data.id, path: newPath, isSaved: true }
          create(createData)
          await saveDirectory(list.value)
          const newFile = await pathJoin(newPath, name + ext)
          await copyFile(path, newFile)
        }
      }
    },
    data.type
  )
  ContextMenu.showContextMenu(menu)
}

const handleRenameBlur = async (event: any, node: any, data: any) => {
  const name = event.target.value?.trim()
  const oldName = data.name
  if (name) {
    if (name !== oldName) {
      let res: any = null
      if (data.type === ETypes.Folder) {
        res = await renameFolder(data, name)
      } else {
        res = await renameFile(data, name)
      }
      if (res.success) {
        update({
          ...data,
          name,
          isEditing: false
        })
      } else {
        ElMessage.error(res.msg)
        treeInput.value?.focus()
        treeInput.value?.select()
      }
    } else {
      update({
        ...data,
        isEditing: false
      })
      treeInput.value?.focus()
      treeInput.value?.select()
    }
    await saveDirectory(list.value)
  }
}

const handleUserSelected = (data: any) => {
  if (data.type === ETypes.Folder) {
    return false
  }
  if (selectedFile.value) {
    if (!selectedFile.value.path) {
      tipsToSave(
        () => handleSaveDoc(() => handleOpenDoc(data)),
        () => handleOpenDoc(data)
      )
    } else if (!selectedFile.value.isSaved) {
      handleSaveDoc(() => handleOpenDoc(data))
    } else {
      handleOpenDoc(data)
    }
  } else {
    handleOpenDoc(data)
  }
}

const { settings } = storeToRefs(useSettingStore())
const isCustom = computed(() => settings.value.theme === 'custom')
</script>

<template>
  <div class="flex-col height-100p pt-5">
    <el-tree
      id="treeRef"
      ref="treeRef"
      :style="{ minHeight: 0 }"
      node-key="id"
      empty-text=""
      :current-node-key="selectedKey"
      :data="list"
      :props="{
        children: 'children',
        label: 'name'
      }"
      :highlight-current="false"
      :expand-on-click-node="false"
      :check-on-click-node="false"
      :default-expanded-keys="expandedKey"
      @node-contextmenu="handleContextMenu"
      @current-change="handleUserSelected"
    >
      <template #default="{ node, data }">
        <div class="custom-tree-node">
          <font-awesome-icon
            class="menu-icon-fa fa-fw"
            :icon="node.expanded ? data.expIcon : data.icon"
          />
          <div v-if="!data.isEditing" class="custom-title">{{ node.label }}{{ data.ext }}</div>
          <input
            v-else
            class="custom-input"
            type="text"
            :value="data.name"
            @blur="handleRenameBlur($event, node, data)"
            @keydown.enter="handleRenameBlur($event, node, data)"
          />
        </div>
      </template>
    </el-tree>
    <div
      class="custom-create"
      @contextmenu.prevent.stop="handleContextMenu($event, {}, null)"
    ></div>
    <div class="user-settings flex-row justify-between ph-10">
      <div><font-awesome-icon :icon="['fas', 'user']" /></div>
    </div>
  </div>
</template>
<style>
.menu-icon-fa {
  margin-right: 8px;
  text-align: left;
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 10px 0;
}
.custom-input {
  border: none;
  background-color: transparent;
  width: 8em;
}
.custom-create {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 10px 0;
}
.custom-title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 9em;
}
.user-settings {
  height: 30px;
  color: var(--el-color-info);
}
</style>
