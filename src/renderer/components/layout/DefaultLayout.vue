<script setup lang="ts">
import { storeToRefs } from 'pinia'
import HeaderBar from '@/renderer/components/elements/HeaderBar.vue'
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
