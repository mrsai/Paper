<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useDirectoryStore } from '@/renderer/store/directory'

const { selectedKey, selectedFile } = storeToRefs(useDirectoryStore())
const { createTemp } = useDirectoryStore()

const handleCreateFile = () => {
  const temp = createTemp({
    name: 'untitled',
    content: '# untitled',
  })
  selectedKey.value = temp.id
}
const handleOpenFile = () => {}
</script>
<template>
  <div class="start-screen">
    <div class="logo">PAPER<span class="blue">.</span></div>
    <div class="flex-row justify-between button-groups">
      <div class="items-full start-items" @click="handleCreateFile">新建文件</div>
      <div class="items-full start-items" @click="handleOpenFile">打开文件</div>
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
.blue{
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
