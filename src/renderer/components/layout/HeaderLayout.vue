<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useDark, useToggle } from '@vueuse/core'

const isDark = useDark()
const router = useRouter()
const toggleDark = useToggle(isDark)
const command = Object.create(null)
command.changeTheme = () => {
  toggleDark()
}
command.settings = () => {
  router.push('/settings')
}

const handleCommand = (name: any) => {
  console.log(`click on item ${name}`)
  command[name]()
}
</script>
<template>
  <header class="top-bar flex-row items-center justify-between">
    <div class="bar-left"> </div>
    <div class="bar-cneter">
      <el-dropdown trigger="click" :teleported="true" @command="handleCommand">
        <span class="el-dropdown-link pointer">
          <font-awesome-icon :icon="['fas', 'bars']" color="#333" />
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="settings">设置</el-dropdown-item>
            <el-dropdown-item command="a">侧边栏&emsp;&emsp;CTRL+K</el-dropdown-item>
            <el-dropdown-item command="b">默认模式</el-dropdown-item>
            <el-dropdown-item command="c">简洁模式</el-dropdown-item>
            <el-dropdown-item command="changeTheme">切换主题</el-dropdown-item>
            <!-- <el-dropdown-item command="changeTheme">白色主题</el-dropdown-item> -->
            <!-- 设置字体，大小，背景色，间距，markdown主题 -->
            <el-dropdown-item command="e" disabled>图床服务</el-dropdown-item>
            <el-dropdown-item command="changeTheme">切换语言</el-dropdown-item>
            <el-dropdown-item command="e" disabled divided>历史</el-dropdown-item>
            <!-- 展示最近5次的同步历史数据 -->

            <!-- <el-dropdown-item command="e">退出</el-dropdown-item> -->
            <!-- <el-dropdown-item command="e">帮助</el-dropdown-item>
            <el-dropdown-item command="e">访问在线</el-dropdown-item>
            <el-dropdown-item command="e" divided>关于</el-dropdown-item> -->
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <input type="text" value="万家灯火" class="topbar-title"
    /></div>
    <div class="bar-right">
      <el-dropdown trigger="click" :teleported="true" @command="handleCommand">
        <span class="el-dropdown-link pointer">
          <font-awesome-icon :icon="['fas', 'ellipsis']" />
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="a" disabled>生成链接</el-dropdown-item>
            <el-dropdown-item command="b">生成图片</el-dropdown-item>
            <el-dropdown-item command="d">生成PDF</el-dropdown-item>
            <el-dropdown-item command="c" disabled>翻译</el-dropdown-item>
            <el-dropdown-item command="e" divided>
              <font-awesome-icon :icon="['fas', 'circle']" class="copy-size" />
              <span>自动粘贴</span>
            </el-dropdown-item>
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
}
.bar-left {
  width: 126px;
  height: 100%;
}
.bar-cneter {
  flex: 1;
  display: flex;
  align-items: center;
}
.bar-right {
  width: 120px;
  text-align: right;
  padding-right: 22px;
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
