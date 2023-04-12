<script setup lang="ts">
import { nextTick } from 'vue'
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
  createLocalFile
} from '@/renderer/utils'
import { ElMessage, ElMessageBox } from 'element-plus'
const { list, selectedKey, expandedKey } = storeToRefs(useDirectoryStore())
const { create, update, del } = useDirectoryStore()
const onContextMenu = (event: any, data: any, node: any) => {
  const menu = sidebarContextmenu(
    event,
    {
      async createMarkdown() {
        console.log('data', data)
        const name = await getUnusedName(data.path, '新建文件', EExt.MarkDown)
        const markdown = {
          pid: data.id,
          name,
          type: ETypes.File,
          ext: EExt.MarkDown,
          isEditing: true
        }
        await createLocalFile(markdown)
        create(markdown)
        expandedKey.value = [data.id]
        nextTick(() => {
          const treeRef = document.getElementById('treeRef')
          const input = treeRef?.querySelector('input')
          input?.focus()
          input?.select()
        })
      },
      createRichText() {
        create({
          pid: data.id,
          name: '新建文件',
          type: ETypes.File,
          ext: EExt.RichText
        })
        expandedKey.value = [data.id]
        nextTick(() => {
          const treeRef = document.getElementById('treeRef')
          const input = treeRef?.querySelector('input')
          input?.focus()
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
            const treeRef = document.getElementById('treeRef')
            const input = treeRef?.querySelector('input')
            input?.focus()
          })
        }
      },
      rename() {
        update({
          ...data,
          isEditing: true
        })
        nextTick(() => {
          const treeRef = document.getElementById('treeRef')
          const input = treeRef?.querySelector('input')
          input?.focus()
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

const handleBlur = async (event: any, node: any, data: any) => {
  const name = event.target.value?.trim()
  const oldName = data.name
  if (name) {
    if (name !== oldName) {
      const res = await renameFolder(data, name)
      if (res.success) {
        update({
          ...data,
          name,
          isEditing: false
        })
      } else {
        console.log(res.msg)
        ElMessage.error(res.msg)
      }
    } else {
      update({
        ...data,
        isEditing: false
      })
    }
  }
}

const handleSelected = (data: any) => {
  selectedKey.value = data.id
}
</script>

<template>
  <div class="flex-col height-100p">
    <el-tree
      id="treeRef"
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
      @node-contextmenu="onContextMenu"
      @current-change="handleSelected"
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
            @blur="handleBlur($event, node, data)"
            @keydown.enter="handleBlur($event, node, data)"
          />
        </div>
      </template>
    </el-tree>
    <div class="custom-create" @contextmenu.prevent.stop="onContextMenu($event, {}, null)"></div>
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
