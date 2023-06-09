<script setup lang="tsx">
import MDEditor from '@/renderer/components/elements/milkdown/MDEditor.vue'
import SideBar from '@/renderer/components/elements/SideBar.vue'
import StartScreen from '@/renderer/views/StartScreen.vue'
import { useDirectoryStore } from '@/renderer/store/directory'
import { useSettingStore } from '@/renderer/store/settings'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

const { settings } = storeToRefs(useSettingStore())
const { selectedFile, temporary } = storeToRefs(useDirectoryStore())

const currentTab: any = computed(() => {
  // 如果有临时打开的文件或者有选中的目录
  return selectedFile.value?.id || temporary?.value ? MDEditor : StartScreen
})

const isCustom = computed(() => settings?.value.theme === 'custom')
</script>

<template>
  <el-container :style="{ backgroundColor: isCustom ? settings?.backgroundColor : '' }">
    <el-aside
      v-if="settings?.showSide"
      width="200px"
      :style="{ backgroundColor: isCustom ? settings?.appColor : '' }"
      ><SideBar
    /></el-aside>
    <el-main> <component :is="currentTab"></component></el-main>
  </el-container>
</template>
