<script setup lang="tsx">
import { useI18n } from 'vue-i18n'
import { openExternal } from '@/renderer/utils'
import { useDirectoryStore } from '@/renderer/store/directory'
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'
import { useDark, useToggle } from '@vueuse/core'
import { ETypes } from '@/renderer/types/sidebar'
import { Search } from '@element-plus/icons-vue'

const { locale, availableLocales, t } = useI18n()
const { create } = useDirectoryStore()
const { list } = storeToRefs(useDirectoryStore())
const languages = ref(['en'])
const appVersion = ref('Unknown')

const isDark = useDark()
const toggleDark = useToggle(isDark)

onMounted((): void => {
  languages.value = availableLocales

  // Get application version from package.json version string (Using IPC communication)
  window.mainApi.receive('msgReceivedVersion', (event: Event, version: string) => {
    appVersion.value = version
  })
  window.mainApi.send('msgRequestGetVersion')
})

const handleChangeTheme = (): void => {
  toggleDark()
}

const handleChangeLanguage = (val): void => {
  locale.value = 'en'
  console.log('t', t('menu.change-theme'))
}

const handleDocument = async (): Promise<void> => {
  await openExternal('https://vutron.jooy2.com')
}

const handleCountIncrease = (): void => {
  create({
    name: '新建文件夹',
    type: ETypes.Folder
  })
  console.log(list)
}
</script>

<template>
  <div>
    <el-button :icon="Search" circle />
    <el-button type="primary" @click="handleChangeTheme"
      >{{ $t('menu.change-theme') }} ok?</el-button
    >
    <el-button type="success" @click="handleCountIncrease">使用 store 创建</el-button>
    <el-button type="info" @click="handleDocument">打开文档</el-button>
    <el-button type="warning" @click="handleChangeLanguage">切换语言</el-button>
    <div>{{ list }}</div>
  </div>
</template>
