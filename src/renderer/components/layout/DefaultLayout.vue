<script setup lang="ts">
// import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import HeaderBar from '@/renderer/components/elements/HeaderBar.vue'
import SideBar from '@/renderer/components/elements/SideBar.vue'
// import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
// const locale = ref(zhCn)
import { useSettingStore } from '@/renderer/store/settings'
const { settings } = storeToRefs(useSettingStore())
</script>

<template>
  <el-config-provider>
    <el-container style="height: 100vh">
      <el-header><HeaderBar /></el-header>
      <router-view></router-view>
    </el-container>
  </el-config-provider>
</template>
