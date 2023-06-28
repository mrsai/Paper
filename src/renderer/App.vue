<script setup lang="ts">
import { useSettingStore } from '@/renderer/store/settings'
import { useDirectoryStore } from '@/renderer/store/directory'
import { useI18n } from 'vue-i18n'
import { readDirectory, getSettings, listenFileOpen, listenFileSave, quitApp } from './utils'
import { onBeforeUnmount, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { ElMessageBox } from 'element-plus'
const { updateList, openFileByPath, handleSaveDoc } = useDirectoryStore()
const { selectedKey, selectedFile } = storeToRefs(useDirectoryStore())

const { t } = useI18n()
// 准备数据，包括设置和目录结构数据
const preparer = async () => {
  try {
    // 读取配置文件
    const settings = await getSettings()
    // 读取目录结构
    const directory = await readDirectory()
    // 更新store
    useSettingStore().updateSettings(settings)
    updateList(directory)
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

const unSavedHandler = () => {
  ElMessageBox.confirm(t('tips.save-title'), t('tips.title'), {
    distinguishCancelAndClose: true,
    confirmButtonText: t('tips.save-exist'),
    cancelButtonText: t('tips.save-not-exist'),
    type: 'warning'
  })
    .then(() => {
      handleSaveDoc(() => {
        quitApp()
      })
    })
    .catch((action) => {
      if (action === 'cancel') {
        quitApp()
      }
    })
}
// 监听全局事件
onMounted(() => {
  listenFileOpen((path: string) => {
    path && openFileByPath(path)
  })
  listenFileSave(() => {
    // 当前打开了文件
    if (selectedKey.value) {
      // 当前文件已经保存
      if (selectedFile.value?.isSaved) {
        quitApp()
      } else {
        unSavedHandler()
      }
    } else {
      quitApp()
    }
  })
})
</script>

<template>
  <router-view></router-view>
</template>
