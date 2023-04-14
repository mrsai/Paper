<template>
  <Milkdown />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Editor, rootCtx, defaultValueCtx } from '@milkdown/core'
import { nord } from '@milkdown/theme-nord'
import { Milkdown, useEditor } from '@milkdown/vue'
import { commonmark } from '@milkdown/preset-commonmark'

export default defineComponent({
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'MilkdownVue',
  components: {
    Milkdown
  },
  setup: () => {
    const markdown = `# Milkdown Vue Commonmark

> You're scared of a world where you're needed.

This is a demo for using Milkdown with **Vue**.`
    useEditor((root) =>
      Editor.make()
        .config(nord)
        .config((ctx) => {
          ctx.set(rootCtx, root)
          ctx.set(defaultValueCtx, markdown)
        })
        .use(commonmark)
    )
  }
})
</script>
