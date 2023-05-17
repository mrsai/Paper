<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useDark, useToggle } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { openExternal } from '@/renderer/utils'
import { useSettingStore } from '@/renderer/store/settings'
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
const { saveSetting } = useSettingStore()
const languages = ref(['en'])
const isDark = useDark()
const router = useRouter()
const toggleDark = useToggle(isDark)
const { locale, availableLocales, t } = useI18n()
const { settings } = storeToRefs(useSettingStore())

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
  <header class="top-bar flex-row items-center justify-between">
    <div class="bar-left"> </div>
    <div class="bar-cneter">
      <!-- <input type="text" value="万家灯火" class="topbar-title" /> -->
    </div>
    <div class="bar-right">
      <el-dropdown trigger="click" :teleported="true" @command="handleCommand">
        <span class="el-dropdown-link pointer">
          <font-awesome-icon :icon="['fas', 'ellipsis-vertical']" />
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="a">生成链接</el-dropdown-item>
            <el-dropdown-item command="b">生成图片</el-dropdown-item>
            <el-dropdown-item command="d">生成PDF</el-dropdown-item>
            <el-dropdown-item command="c">翻译</el-dropdown-item>
            <el-dropdown-item command="c">对话</el-dropdown-item>
            <el-dropdown-item command="e" divided>
              <font-awesome-icon :icon="['fas', 'circle']" class="copy-size" />
              <span>自动粘贴</span>
            </el-dropdown-item>
            <el-dropdown-item command="c" divided disabled>历史</el-dropdown-item>
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
            <el-dropdown-item command="settings">
              新建
              <!-- &nbsp;
              <el-popover
                placement="left-start"
                title="提示"
                :width="260"
                trigger="hover"
                content="只创建本地 Markdown 文件，且不会进行目录管理。"
              >
                <template #reference>
                  <font-awesome-icon :icon="['fas', 'circle-info']" />
                </template>
              </el-popover> -->
            </el-dropdown-item>
            <el-dropdown-item command="settings">打开</el-dropdown-item>
            <!-- 如果已经保存，则直接保存，如果用户未保存，则提示用户是否进行保存，如果用户选择保存，则让用户选择保存目录 -->
            <el-dropdown-item command="settings" divided>设置</el-dropdown-item>
            <el-dropdown-item command="switchSidebar">侧边栏&emsp;&emsp;CTRL+K</el-dropdown-item>
            <el-dropdown-item command="b">工具栏</el-dropdown-item>
            <el-dropdown-item command="b">默认模式</el-dropdown-item>
            <el-dropdown-item command="c">简洁模式</el-dropdown-item>
            <el-dropdown-item command="changeTheme">切换主题</el-dropdown-item>
            <el-dropdown-item command="changeTheme">白色主题</el-dropdown-item>
            <el-dropdown-item command="e" disabled>图床服务</el-dropdown-item>
            <el-dropdown-item command="changeLang">切换语言</el-dropdown-item>
            <el-dropdown-item command="e" disabled divided>消息</el-dropdown-item>
            <el-dropdown-item command="e">退出</el-dropdown-item>
            <el-dropdown-item command="e">帮助</el-dropdown-item>
            <el-dropdown-item command="online">访问在线</el-dropdown-item>
            <el-dropdown-item command="e" divided>关于</el-dropdown-item>
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
.bar-cneter {
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
.topbar-title {
  outline: none;
  border: 0;
  line-height: 36px;
  padding: 0 2px;
  background-color: transparent;
}
.copy-size {
  font-size: 8px;
  margin-right: 5px;
  color: green;
}
</style>
