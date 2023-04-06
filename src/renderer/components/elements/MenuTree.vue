<script setup lang="ts">
import { nextTick } from 'vue'
import { useDirectoryStore } from '@/renderer/store/directory'
import { ETypes, EExt } from '@/renderer/types/sidebar'
import { storeToRefs } from 'pinia'
import { Folder, FolderOpened } from '@element-plus/icons-vue'
import ContextMenu from '@imengyu/vue3-context-menu'
import { sidebarContextmenu } from '@/renderer/components/elements/contextMenu'

const { list, selectedKey, expandedKey } = storeToRefs(useDirectoryStore())
const { create, update, del } = useDirectoryStore()
const onContextMenu = (event: any, data: any, node: any) => {
  console.log('12212', 12212)

  const menu = sidebarContextmenu(
    event,
    {
      createMarkdown() {
        create({
          pid: data.id,
          name: '新建文件',
          type: ETypes.File,
          ext: EExt.MarkDown,
          isEditing: true
        })
        expandedKey.value = [data.id]
        nextTick(() => {
          const treeRef = document.getElementById('treeRef')
          const input = treeRef?.querySelector('input')
          input?.focus()
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
      createFolder() {
        create({
          name: '新建文件夹',
          type: ETypes.Folder
        })
        nextTick(() => {
          const treeRef = document.getElementById('treeRef')
          const input = treeRef?.querySelector('input')
          input?.focus()
        })
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
        del(data.id)
      },
      extractTranslate() {},
      sync() {},
      generateBlog() {}
    },
    data.type
  )
  ContextMenu.showContextMenu(menu)
}

const defaultProps = {
  children: 'children',
  label: 'name'
}

const handleBlur = (event: any, node: any, data: any) => {
  const name = event.target.value?.trim()
  if (name) {
    update({
      ...data,
      name,
      isEditing: false
    })
  }
}

const handleSelected = (data: any) => {
  selectedKey.value = data.id
}
</script>

<template>
  <div class="flex-col">
    <el-tree
      id="treeRef"
      node-key="id"
      empty-text=""
      :current-node-key="selectedKey"
      :data="list"
      :props="defaultProps"
      :highlight-current="true"
      :expand-on-click-node="false"
      :check-on-click-node="true"
      :default-expanded-keys="expandedKey"
      @node-contextmenu="onContextMenu"
      @current-change="handleSelected"
    >
      <template #default="{ node, data }">
        <div class="custom-tree-node">
          <el-icon v-if="data.type === ETypes.Folder" :size="20" class="menu-icon"
            ><FolderOpened v-if="node.expanded" /><Folder v-else
          /></el-icon>
          <div v-if="!data.isEditing">{{ node.label }}</div>
          <input
            v-else
            type="text"
            :value="data.name"
            @blur="handleBlur($event, node, data)"
            @keydown.enter="handleBlur($event, node, data)"
          />
        </div>
      </template>
    </el-tree>
    <div @contextmenu.prevent.stop="onContextMenu($event, null, null)"></div>
  </div>
</template>
<style>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: start;
  padding: 10px 0;
}
.menu-icon {
  margin-right: 8px;
}
</style>
