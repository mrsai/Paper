<script setup lang="tsx">
import MDEditor from '@/renderer/components/elements/MDEditor.vue'
import { useI18n } from 'vue-i18n'
import { openExternal } from '@/renderer/utils'
import { useDirectoryStore } from '@/renderer/store/directory'
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'

import { ETypes } from '@/renderer/types/sidebar'

const { locale, availableLocales, t } = useI18n()
const { create } = useDirectoryStore()
const { list } = storeToRefs(useDirectoryStore())
const languages = ref(['en'])
const appVersion = ref('Unknown')

onMounted((): void => {
  languages.value = availableLocales

  // Get application version from package.json version string (Using IPC communication)
  window.mainApi.receive('msgReceivedVersion', (event: Event, version: string) => {
    appVersion.value = version
  })
  window.mainApi.send('msgRequestGetVersion')
})

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
    <MDEditor />
    <!-- <font-awesome-icon icon="fa-solid fa-folder" />

    <br />
    <font-awesome-icon icon="fa-solid fa-folder-open" />
    <font-awesome-icon :icon="['fab', 'markdown']" />
    <FontAwesomeIcon icon="fa-solid fa-bars" />
    <font-awesome-icon :icon="['fas', 'file-lines']" /> -->
    <!-- <el-button :icon="Search" circle />
    <el-button type="primary" @click="handleChangeTheme"
      >{{ $t('menu.change-theme') }} ok?</el-button
    >
    <el-button type="success" @click="handleCountIncrease">使用 store 创建</el-button>
    <el-button type="info" @click="handleDocument">打开文档</el-button>
    <el-button type="warning" @click="handleChangeLanguage">切换语言</el-button> -->
  </div>
</template>
