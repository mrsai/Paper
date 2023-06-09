<script setup lang="ts">
import { ref, nextTick, watch, computed } from 'vue'
import { useDark } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { openExternal, saveSettings, selectFolder } from '@/renderer/utils'
import { useSettingStore } from '@/renderer/store/settings'
import { useAutoParseStore } from '@/renderer/store/auto-parse'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { useDirectoryStore } from '@/renderer/store/directory'
import SettingsScreen from '@/renderer/views/SettingsScreen.vue'
import IconWrap from '@/renderer/components/elements/IconWrap.vue'
// Settings
const { settings } = storeToRefs(useSettingStore())
const { updateSettings } = useSettingStore()
const settingsRef = ref<any>(null)
const settingVisible = ref(false)
const toggleSettingVisible = () => (settingVisible.value = !settingVisible.value)

// theme
const isDark = useDark()

const handleSettingChange = (data: any) => {
  updateSettings(data)
  saveSettings(settings.value)
  toggleSettingVisible()
  if (data.theme === 'dark') {
    isDark.value = true
  } else {
    isDark.value = false
  }
}

// language
const { locale, t } = useI18n()
watch(
  () => settings.value.lang,
  () => {
    locale.value = settings.value.lang
  }
)

// files
const { selectedFile, selectedKey } = storeToRefs(useDirectoryStore())
const { handleSaveDoc, handleCreateTemp, openFileByPath, update } = useDirectoryStore()

// actions
const command = Object.create(null)

command.toggleSidebar = () => {
  settings.value.showSide = !settings.value.showSide
  saveSettings(settings.value)
}
command.settings = () => {
  toggleSettingVisible()
  nextTick(() => {
    settingsRef.value?.initSettings(settings.value)
  })
}
command.changeLang = () => {
  // 模板语法 {{ $t('menu.change-theme') }}
  // JS 语法 console.log('t', t('menu.change-theme'))
  locale.value = locale.value === 'en' ? 'zhHans' : 'en'
  settings.value.lang = locale.value
  saveSettings(settings.value)
}

const handleCommand = (name: any) => {
  command[name]()
}

command.online = async () => {
  await openExternal('https://vutron.jooy2.com')
}
command.createTempMd = async () => {
  await handleSaveDoc(handleCreateTemp)
}

// 自动黏贴是否在运行
const { isAutoPasteRunning } = storeToRefs(useAutoParseStore())
const { stopAutoParse, startAutoParse } = useAutoParseStore()
command.autoPaste = async () => {
  if (isAutoPasteRunning.value) {
    stopAutoParse()
  } else {
    startAutoParse((res: string) => {
      if (selectedFile.value.id) {
        update({ ...selectedFile.value, content: selectedFile.value.content + '\n - ' + res })
      }
    })
  }
}

command.openTempMd = async () => {
  await handleSaveDoc(async () => {
    const path = await selectFolder({ properties: ['openFile'] })
    path && (await openFileByPath(path))
  })
}

const barColor = computed(() => {
  if (selectedFile.value && !selectedFile.value.isSaved) {
    return 'rgba(255,0,0,0.1)'
  }
  if (settings.value.theme === 'custom') {
    return settings.value.appColor
  }
  return ''
})
</script>
<template>
  <header class="top-bar flex-row items-center justify-between" :style="{ background: barColor }">
    <div class="bar-left"> </div>
    <div class="bar-center"> </div>
    <div class="bar-right">
      <el-dropdown v-if="selectedFile" trigger="click" :teleported="true" @command="handleCommand">
        <span class="el-dropdown-link pointer">
          <font-awesome-icon :icon="['fas', 'ellipsis-vertical']" />
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="editorTool" disabled>{{
              $t('article.editor-helper')
            }}</el-dropdown-item>
            <el-dropdown-item command="a" disabled>{{
              $t('article.generate-link')
            }}</el-dropdown-item>
            <el-dropdown-item command="b" disabled>{{
              $t('article.generate-picture')
            }}</el-dropdown-item>
            <el-dropdown-item command="d" disabled>{{
              $t('article.generate-pdf')
            }}</el-dropdown-item>
            <el-dropdown-item command="c" disabled>{{ $t('article.translate') }}</el-dropdown-item>
            <el-dropdown-item command="c" disabled>{{ $t('article.chat') }}</el-dropdown-item>
            <el-dropdown-item command="autoPaste" divided>
              <font-awesome-icon
                :icon="['fas', 'circle']"
                class="copy-size"
                :style="{ color: isAutoPasteRunning ? 'green' : 'red' }"
              />
              <span>{{ $t('article.auto-paste') }}</span>
            </el-dropdown-item>
            <el-dropdown-item command="c" divided disabled>{{
              $t('article.history')
            }}</el-dropdown-item>
            <el-dropdown-item command="d" disabled>2022年9月14 16:32:00</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <el-dropdown trigger="click" :teleported="true" @command="handleCommand">
        <span class="el-dropdown-link pointer">
          <font-awesome-icon :icon="['fas', 'bars']" />
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="createTempMd">
              {{ $t('app.create-markdown') }}
            </el-dropdown-item>
            <el-dropdown-item command="openTempMd">{{ $t('app.open-markdown') }}</el-dropdown-item>
            <!-- 如果已经保存，则直接保存，如果用户未保存，则提示用户是否进行保存，如果用户选择保存，则让用户选择保存目录 -->

            <el-dropdown-item command="toggleSidebar" divided>{{
              $t('app.sidebar')
            }}</el-dropdown-item>
            <el-dropdown-item command="changeLang">{{
              $t('app.change-language')
            }}</el-dropdown-item>
            <el-dropdown-item command="settings">{{ $t('app.settings') }}</el-dropdown-item>
            <el-dropdown-item command="message" disabled divided>{{
              $t('app.message')
            }}</el-dropdown-item>
            <el-dropdown-item command="picService" disabled>{{
              $t('app.picture-services')
            }}</el-dropdown-item>
            <el-dropdown-item command="help" disabled>{{ $t('app.help') }}</el-dropdown-item>
            <el-dropdown-item command="online" disabled>{{ $t('app.online') }}</el-dropdown-item>
            <el-dropdown-item command="about" divided>{{ $t('app.about') }}</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </header>
  <el-drawer v-model="settingVisible" direction="rtl" size="100%" :show-close="false">
    <template #header="{ close, titleId, titleClass }">
      <div class="setting-title">
        <h2 :id="titleId" :class="titleClass">设置</h2>
        <IconWrap
          icon="CloseOne"
          size="20"
          :fill="['#fff', '#2F88FF', '#FFF', '#43CCF8']"
          style="cursor: pointer"
          @click="close"
        />
      </div>
    </template>
    <SettingsScreen ref="settingsRef" @on-change="handleSettingChange" />
  </el-drawer>
</template>
<style scoped>
.pointer {
  padding: 10px;
}
.top-bar {
  width: 100%;
  position: fixed;
  height: 36px;
}
.bar-left {
  width: 126px;
  height: 100%;
}
.bar-center {
  flex: 1;
  display: flex;
  align-items: center;
  text-align: center;
  -webkit-app-region: drag;
  height: 36px;
}
.bar-right {
  width: 120px;
  text-align: right;
  padding-right: 10px;
}
.copy-size {
  font-size: 8px;
  margin-right: 5px;
  color: green;
}
.setting-title {
  background-color: #1e90ff;
  color: #fff;
  padding: 5px 100px;
  display: flex;
  justify-content: space-between;
  margin: 20px 0;
  border-radius: 5px;
  align-items: center;
}
.setting-title h2 {
  font-size: 22px;
  margin: 0;
  font-weight: 300;
}
</style>
