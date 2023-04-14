<script setup lang="ts">
// import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import HeaderLayout from '@/renderer/components/layout/HeaderLayout.vue'
import SideBar from '@/renderer/components/elements/SideBar.vue'
// import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
// const locale = ref(zhCn)
import { useSettingStore } from '@/renderer/store/settings'
const { settings } = storeToRefs(useSettingStore())
</script>

<template>
  <el-config-provider>
    <el-container style="height: 100vh">
      <el-header><HeaderLayout /></el-header>
      <el-container>
        <el-aside v-if="settings.showSide" width="200px"><SideBar /></el-aside>
        <el-main><slot /></el-main>
      </el-container>
    </el-container>
  </el-config-provider>
</template>
