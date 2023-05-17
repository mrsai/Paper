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
const { selectedFile } = storeToRefs(useDirectoryStore())

const content = ref("")
const onContentChange = (newContent: string) => {
  update({ ...selectedFile.value, content: newContent, isSaved: false })
}

const onEditorInit = (editor: any) => {
  content.value = selectedFile.value?.content
}

watch(
  () => selectedFile.value,
  (newVal) => {
    if (newVal){
      console.log(newVal)
      content.value = newVal.content
      // if(!newVal.content && newVal.path){
      //   openLocalFile(newVal).then((article) => {
      //     update({ ...selectedFile.value, article })
      //     content.value = article
      //   })
      // }else{
      //   content.value = newVal.content
      // }
    }
  }
)
</script>
