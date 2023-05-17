<template>
  <Milkdown />
</template>

<script lang="ts" setup>
import {
  onMounted,
  ref,
  watch,
  withDefaults,
} from 'vue'

import { Editor, rootCtx,EditorStatus } from '@milkdown/core'
import { nord } from '@milkdown/theme-nord'
import { Milkdown, useEditor } from '@milkdown/vue'
import { commonmark } from '@milkdown/preset-commonmark'
import { replaceAll } from '@milkdown/utils'
import { listener, listenerCtx } from '@milkdown/plugin-listener'

const editor = ref(null as Editor | null)
// 为了区分markdownUpdated这个监听函数中，编辑器是初始化的时候输出的内容，还是修改内容时候输出的内容，引入了这个参数
let isLoadANewArticle = false
// 这个优化影响保存，暂时先注释掉
// const debouncedUpdate = useDebounceFn((markdown: any) => {
//   update({ ...selectedFile.value, content: markdown, isSaved: false })
// }, 500)
const props = withDefaults(defineProps<{ content?: string }>(), {
  content: ''
})
const emit = defineEmits(['on-change','on-init'])

useEditor((root) => {
  const it = Editor.make()
    .config(nord)
    .config((ctx) => {
      ctx.set(rootCtx, root)
    })
    .config((ctx: any) => {
      ctx.get(listenerCtx).markdownUpdated((ctx: any, markdown: any, prevMarkdown: any) => {
        if (!isLoadANewArticle) {
          emit('on-change', markdown)
        } else {
          isLoadANewArticle = false
        }
      })
    })
    .use(listener)
    .use(commonmark)

  it.create().then(() => {
    editor.value = it
    emit('on-init')
  });

  return it
})

watch(
  () => props.content,
  (newVal) => {
    isLoadANewArticle = true
    editor.value?.action(replaceAll(props.content))
  },
)

</script>
