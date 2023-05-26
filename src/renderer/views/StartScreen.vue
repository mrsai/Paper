<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useDirectoryStore } from '@/renderer/store/directory'
import { selectFolder,openLocalFile,pathParse } from '@/renderer/utils'
import {onBeforeUnmount, onMounted} from "vue";
const { selectedKey } = storeToRefs(useDirectoryStore())
const { createTemp } = useDirectoryStore()

const handleCreateFile = () => {
  const temp = createTemp({
    name: 'untitled',
    content: '# untitled\n ... '
  })
  selectedKey.value = temp.id
}

const openFileByPath = async (path) => {
  const {dir,name,ext} = await pathParse(path)
  const createData = { name, ext, path:dir}
  const content = await openLocalFile(createData)
  const temp = createTemp({...createData,content})
  selectedKey.value = temp.id
}
const handleOpenFile = async (event) => {
  event.preventDefault()
  const path = await selectFolder({properties: ['openFile']})
  path && await openFileByPath(path)
}
const dragoverHandler = (event)=> {
  event.preventDefault()
}

const dropHandler = async (event)=> {
  event.preventDefault()
  const path = event.dataTransfer.files[0].path
  path && await openFileByPath(path)
}
onBeforeUnmount(()=>{
  document.removeEventListener("dragover", dragoverHandler)
  document.removeEventListener("drop", dropHandler)
})
onMounted(()=>{
  document.addEventListener("dragover", dragoverHandler)
  document.addEventListener("drop", dropHandler)
})
</script>
<template>
  <div class="start-screen">
    <div class="logo no-select" @dblclick="handleOpenFile">PAPER<span class="blue">.</span></div>
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
