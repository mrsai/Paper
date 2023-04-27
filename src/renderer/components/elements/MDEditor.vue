<template>
  <MilkdownProvider>
    <MilkdownEditor :content="content" @on-change="onContentChange"/>
  </MilkdownProvider>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { MilkdownProvider } from '@milkdown/vue'
import MilkdownEditor from './MilkdownEditor.vue'

const content = ref("")
const onContentChange = (newContent: string) => {
  content.value = newContent
}
</script>
