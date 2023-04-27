<script setup lang="tsx">
import MDEditor from '@/renderer/components/elements/MDEditor.vue'
import SideBar from '@/renderer/components/elements/SideBar.vue'
import StartScreen from '@/renderer/views/StartScreen.vue'
import { useDirectoryStore } from '@/renderer/store/directory'
import { useSettingStore } from '@/renderer/store/settings'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

const { settings } = storeToRefs(useSettingStore())
const { create } = useDirectoryStore()
const { list, selectedFile, temporary } = storeToRefs(useDirectoryStore())

const currentTab = computed(() => {
  // 如果有临时打开的文件或者有选中的目录
  return selectedFile.value?.id || temporary?.value ? MDEditor : StartScreen
})
// const appVersion = ref('Unknown')
// onMounted((): void => {
//   // Get application version from package.json version string (Using IPC communication)
//   window.mainApi.receive('msgReceivedVersion', (event: Event, version: string) => {
//     appVersion.value = version
//   })
//   window.mainApi.send('msgRequestGetVersion')
// })
</script>

<template>
  <el-container>
    <el-aside v-if="settings.showSide" width="200px"><SideBar /></el-aside>
    <el-main> <component :is="currentTab"></component></el-main>
  </el-container>
</template>
