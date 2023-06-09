<script setup lang="ts">
import { useDirectoryStore } from '@/renderer/store/directory'
import { selectFolder } from '@/renderer/utils'
import { onBeforeUnmount, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// Open Files
const { handleCreateTemp, openFileByPath } = useDirectoryStore()
const handleOpenFile = async (event: MouseEvent) => {
  event.preventDefault()
  const path = await selectFolder({ properties: ['openFile'] })
  path && (await openFileByPath(path))
}

// Darg Events
const dragoverHandler = (event: MouseEvent) => {
  event.preventDefault()
}
const dropHandler = async (event: any) => {
  event.preventDefault()
  const path = event.dataTransfer.files[0].path
  path && (await openFileByPath(path))
}
onBeforeUnmount(() => {
  document.removeEventListener('dragover', dragoverHandler)
  document.removeEventListener('drop', dropHandler)
})
onMounted(() => {
  document.addEventListener('dragover', dragoverHandler)
  document.addEventListener('drop', dropHandler)
})
</script>
<template>
  <div class="start-screen">
    <div class="logo no-select" @dblclick="handleOpenFile">PAPER<span class="blue">.</span></div>
    <div class="flex-row justify-between button-groups">
      <div class="items-full start-items" @click="handleCreateTemp">{{
        $t('app.create-markdown')
      }}</div>
      <div class="items-full start-items" @click="handleOpenFile">{{
        $t('app.open-markdown')
      }}</div>
    </div>
  </div>
</template>
<style>
.button-groups {
  text-align: center;
  position: absolute;
  width: 100%;
  bottom: 0;
  z-index: 10;
}
.start-screen {
  position: relative;
  height: 100%;
}
.blue {
  color: #1890ff;
}
.logo {
  position: absolute;
  color: rgba(0, 0, 0, 0.1);
  font-size: 100px;
  left: 0;
  right: 0;
  text-align: center;
  padding: 50px;
}
.start-items {
  padding: 20px 0;
  transition: all 0.3s;
  cursor: pointer;
}
.start-items:hover {
  background-color: rgba(0, 0, 0, 0.1);
}
</style>
