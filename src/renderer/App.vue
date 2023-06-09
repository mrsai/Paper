<script setup lang="ts">
import { useSettingStore } from '@/renderer/store/settings'
import { useDirectoryStore } from '@/renderer/store/directory'
import { readDirectory, getSettings } from './utils'
import { onBeforeUnmount } from 'vue'

// 准备数据，包括设置和目录结构数据
const preparer = async () => {
  try {
    // 读取配置文件
    const settings = await getSettings()
    // 读取目录结构
    const directory = await readDirectory()
    // 更新store
    useSettingStore().updateSettings(settings)
    useDirectoryStore().updateList(directory)
  } catch (error) {
    console.log('读取配置文件和目录失败', error)
  }
}

preparer()

// 绑定禁用刷新快捷键
const keyFreshHandler = (event: KeyboardEvent) => {
  // 禁用刷新
  if (((event.metaKey || event.ctrlKey) && event.code === 'KeyR') || event.code === 'F5') {
    event.preventDefault()
  }
}
window.addEventListener('keydown', keyFreshHandler)
onBeforeUnmount(() => window.removeEventListener('keydown', keyFreshHandler))
</script>

<template>
  <router-view></router-view>
</template>
