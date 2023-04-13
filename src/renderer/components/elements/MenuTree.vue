<script setup lang="ts">
import { nextTick, ref } from 'vue'
import { useDirectoryStore } from '@/renderer/store/directory'
import { ETypes, EExt } from '@/renderer/types/sidebar'
import { storeToRefs } from 'pinia'
import ContextMenu from '@imengyu/vue3-context-menu'
import { sidebarContextmenu } from '@/renderer/components/elements/contextMenu'
import {
  createLocalFolder,
  selectFolder,
  getUnusedName,
  renameFolder,
  renameFile,
  createLocalFile,
  pathJoin,
  saveDirectory,
  readDirectory
} from '@/renderer/utils'
import { ElMessage, ElMessageBox } from 'element-plus'
const { list, selectedKey, expandedKey } = storeToRefs(useDirectoryStore())
const { create, update, del } = useDirectoryStore()
const treeRef = ref<any>(null)
const treeInput = ref<any>(null)

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
          path
        }
        // 创建本地文件
        await createLocalFile(markdown)
        // 创建文件结构数据
        create(markdown)
        // 展开菜单
        expandedKey.value = [data.id]
        nextTick(() => {
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
          path
        }
        await createLocalFile(richText)
        create(richText)
        expandedKey.value = [data.id]
        nextTick(() => {
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
          nextTick(() => {
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
      generateBlog() {}
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
    saveDirectory(list.value)
  }
}

const handleUserSelected = (data: any) => {
  selectedKey.value = data.id
}

readDirectory().then((res) => {
  try {
    list.value = JSON.parse(res)
  } catch (error) {
    console.log(error)
  }
})
</script>

<template>
  <div class="flex-col height-100p">
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
      :highlight-current="true"
      :expand-on-click-node="false"
      :check-on-click-node="true"
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
  </div>
</template>
<style>
.el-tree__empty-block {
  min-height: 0;
}
.menu-icon-fa {
  margin-right: 8px;
  text-align: left;
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: start;
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
  justify-content: start;
  padding: 10px 0;
}
.custom-title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 9em;
}
</style>
