<template>
  <MilkdownProvider>
    <MilkdownEditor />
  </MilkdownProvider>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { MilkdownProvider } from '@milkdown/vue'
import MilkdownEditor from './MilkdownEditor.vue'

export default defineComponent({
  name: 'MilkdownEditorWrapper',
  components: {
    MilkdownProvider,
    MilkdownEditor
  },
  setup: () => {}
})
</script>
