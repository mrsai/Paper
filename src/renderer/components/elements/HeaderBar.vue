<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useDark, useToggle } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { openExternal } from '@/renderer/utils'
import { useSettingStore } from '@/renderer/store/settings'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {useDirectoryStore} from "@/renderer/store/directory";

const { saveSetting } = useSettingStore()
const languages = ref(['en'])
const isDark = useDark()
const router = useRouter()
const toggleDark = useToggle(isDark)
const { locale, availableLocales, t } = useI18n()
const { settings } = storeToRefs(useSettingStore())
const { selectedFile } = storeToRefs(useDirectoryStore())


const command = Object.create(null)
command.changeTheme = () => {
  toggleDark()
}
command.switchSidebar = () => {
  settings.value.showSide = !settings.value.showSide
  saveSetting()
}
command.settings = () => {
  router.push('/settings')
}
command.changeLang = () => {
  // 模板语法 {{ $t('menu.change-theme') }}
  // JS 语法 console.log('t', t('menu.change-theme'))
  locale.value = 'en'
}

const handleCommand = (name: any) => {
  console.log(`click on item ${name}`)
  command[name]()
}

command.online = async () => {
  await openExternal('https://vutron.jooy2.com')
}
onMounted((): void => {
  languages.value = availableLocales
})
</script>
<template>
  <header class="top-bar flex-row items-center justify-between" :style="{'background': selectedFile && !selectedFile.isSaved ? 'rgba(255,0,0,0.1)':''}">
    <div class="bar-left"> </div>
    <div class="bar-center">
    </div>
    <div class="bar-right">
      <el-dropdown v-if="selectedFile" trigger="click" :teleported="true" @command="handleCommand">
        <span class="el-dropdown-link pointer">
          <font-awesome-icon :icon="['fas', 'ellipsis-vertical']" />
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="editorTool">{{ $t('article.editor-helper') }}</el-dropdown-item>
            <el-dropdown-item command="a">{{ $t('article.generate-link') }}</el-dropdown-item>
            <el-dropdown-item command="b">{{ $t('article.generate-picture') }}</el-dropdown-item>
            <el-dropdown-item command="d">{{ $t('article.generate-pdf') }}</el-dropdown-item>
            <el-dropdown-item command="c">{{ $t('article.translate') }}</el-dropdown-item>
            <el-dropdown-item command="c">{{ $t('article.chat') }}</el-dropdown-item>
            <el-dropdown-item command="e" divided>
              <font-awesome-icon :icon="['fas', 'circle']" class="copy-size" />
              <span>{{ $t('article.auto-paste') }}</span>
            </el-dropdown-item>
            <el-dropdown-item command="c" divided disabled>{{ $t('article.history') }}</el-dropdown-item>
            <el-dropdown-item command="d">2022年9月14 16:32:00</el-dropdown-item>
            <el-dropdown-item command="d">2022年9月14 16:31:00</el-dropdown-item>
            <el-dropdown-item command="d">2022年9月14 16:11:00</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <el-dropdown trigger="click" :teleported="true" @command="handleCommand">
        <span class="el-dropdown-link pointer">
          <font-awesome-icon :icon="['fas', 'bars']" color="#333" />
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="create">
              {{ $t('app.create-markdown') }}
            </el-dropdown-item>
            <el-dropdown-item command="open">{{ $t('app.open-markdown') }}</el-dropdown-item>
            <!-- 如果已经保存，则直接保存，如果用户未保存，则提示用户是否进行保存，如果用户选择保存，则让用户选择保存目录 -->
            <el-dropdown-item command="settings" divided>{{ $t('app.settings') }}</el-dropdown-item>
            <el-dropdown-item command="switchSidebar">{{ $t('app.sidebar') }}&emsp;&emsp;CTRL+K</el-dropdown-item>
            <el-dropdown-item command="defaultMode">{{ $t('app.default-mode') }}</el-dropdown-item>
            <el-dropdown-item command="simpleMode">{{ $t('app.zen-mode') }}</el-dropdown-item>
            <el-dropdown-item command="changeTheme">{{ $t('app.dark-mode') }}</el-dropdown-item>
            <el-dropdown-item command="changeTheme">{{ $t('app.light-mode') }}</el-dropdown-item>
            <el-dropdown-item command="changeLang">{{ $t('app.change-language') }}</el-dropdown-item>
            <el-dropdown-item command="message" disabled divided>{{ $t('app.message') }}</el-dropdown-item>
            <el-dropdown-item command="picService" disabled>{{ $t('app.picture-services') }}</el-dropdown-item>
            <el-dropdown-item command="help">{{ $t('app.help') }}</el-dropdown-item>
            <el-dropdown-item command="online">{{ $t('app.online') }}</el-dropdown-item>
            <el-dropdown-item command="about" divided>{{ $t('app.about') }}</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </header>
</template>
<style scoped>
.pointer {
  padding: 10px;
}
.top-bar {
  width: 100%;
  position: fixed;
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
</style>
