<template>
  <MilkdownProvider>
    <ProsemirrorAdapterProvider>
      <MilkdownEditor
        :content="content"
        :unique="selectedFile.id"
        @on-change="onContentChange"
        @on-init="onEditorInit"
      />
    </ProsemirrorAdapterProvider>
  </MilkdownProvider>
</template>

<script lang="ts" setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { ProsemirrorAdapterProvider } from '@prosemirror-adapter/vue'
import { MilkdownProvider } from '@milkdown/vue'
import MilkdownEditor from './MilkdownEditor.vue'
import { useDirectoryStore } from '@/renderer/store/directory'
import { useAutoParseStore } from '@/renderer/store/auto-parse'
import { storeToRefs } from 'pinia'
const { update, handleSaveDoc } = useDirectoryStore()
const { selectedFile } = storeToRefs(useDirectoryStore())

const content = ref('')
// 该变量的引入为了解决循环设置编辑器内容的问题
let tempContent = ''
const onContentChange = (newContent: string) => {
  tempContent = newContent
  update({ ...selectedFile.value, content: content.value, isSaved: false })
}

const onEditorInit = (editor: any) => {
  tempContent = selectedFile.value.content
  content.value = selectedFile.value?.content
}

watch(
  () => selectedFile.value,
  (newVal) => {
    if (newVal) {
      tempContent = newVal.content
      content.value = newVal.content
    }
  }
)

// 自动黏贴是否在运行
const { isAutoPasteRunning, lastCopy } = storeToRefs(useAutoParseStore())
watch(
  () => lastCopy.value,
  (newval) => {
    if (isAutoPasteRunning.value && newval) {
      tempContent = `${tempContent}\n- ${newval}`
      content.value = tempContent
    }
  }
)

// 注册一个保存事件
function keyEventSaveHandler(event: KeyboardEvent) {
  if (((event.metaKey || event.ctrlKey) && event.code === 'KeyS') || event.code === 'F5') {
    event.preventDefault()
    handleSaveDoc()
  }
}
onBeforeUnmount(() => {
  window.removeEventListener('keydown', keyEventSaveHandler)
})
onMounted(() => {
  window.addEventListener('keydown', keyEventSaveHandler)
})
</script>
