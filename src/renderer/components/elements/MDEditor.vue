<template>
  <MilkdownProvider>
    <MilkdownEditor :content="content" @on-change="onContentChange" @on-init="onEditorInit"/>
  </MilkdownProvider>
</template>

<script lang="ts" setup>
import {ref, watch} from 'vue'
import { MilkdownProvider } from '@milkdown/vue'
import MilkdownEditor from './MilkdownEditor.vue'
import {useDirectoryStore} from "@/renderer/store/directory";
import {openLocalFile} from "@/renderer/utils";
import {storeToRefs} from "pinia";
const { update } = useDirectoryStore()
const { selectedFile, selectedKey } = storeToRefs(useDirectoryStore())

const content = ref("")
const onContentChange = (newContent: string) => {
  update({ ...selectedFile.value, content: newContent, isSaved: false })
}

const onEditorInit = (editor: any) => {
  // hack: 编辑器初始化时间太长，导致content的值还没更新，所以这里延迟一下
  // 这个可能有一定的概率出现问题，后期在修复。
  setTimeout(()=>{
    content.value = selectedFile.value?.content
  })
}

watch(
  () => selectedFile.value,
  (newVal) => {
    if (newVal){
      if(!newVal.content && newVal.path){
        openLocalFile(newVal).then((article) => {
          update({ ...selectedFile.value, article })
          content.value = article
        })
      }
    }
  },
  { immediate: true }
)
</script>
