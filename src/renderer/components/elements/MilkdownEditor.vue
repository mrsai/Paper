<template>
  <Milkdown />
</template>

<script lang="ts" setup>
import { onMounted, ref, watch, withDefaults } from 'vue'

import { Editor, rootCtx, EditorStatus, defaultValueCtx } from '@milkdown/core'
import { nord } from '@milkdown/theme-nord'
import { Milkdown, useEditor } from '@milkdown/vue'
import { commonmark } from '@milkdown/preset-commonmark'
import { replaceAll } from '@milkdown/utils'
import { listener, listenerCtx } from '@milkdown/plugin-listener'
// import { Ctx, MilkdownPlugin } from '@milkdown/ctx'
import { usePluginViewFactory } from '@prosemirror-adapter/vue'
import SlashPlug from './SlashPlug.vue'
import { slash } from './slash'

const editor = ref(null as Editor | null)
// const slash = slashFactory('slashMenu') satisfies MilkdownPlugin[]

const pluginViewFactory = usePluginViewFactory()

// 为了区分markdownUpdated这个监听函数中，编辑器是初始化的时候输出的内容，还是修改内容时候输出的内容，引入了这个参数
let isLoadANewArticle = false
// 这个优化影响保存，暂时先注释掉
// const debouncedUpdate = useDebounceFn((markdown: any) => {
//   update({ ...selectedFile.value, content: markdown, isSaved: false })
// }, 500)
const props = withDefaults(defineProps<{ content?: string }>(), {
  content: ''
})
const emit = defineEmits(['on-change', 'on-init'])

useEditor((root) => {
  const it = Editor.make()
    .config(nord)
    .config((ctx) => {
      ctx.set(rootCtx, root)
      ctx.set(slash.key, {
        opened: false,
        props: {
          handleKeyDown: (view, event) => {
            if (!ctx.get(slash.key).opened) {
              return false
            }
            return ['ArrowDown', 'ArrowUp', 'Enter'].includes(event.key)
          }
        },
        view: pluginViewFactory({
          component: SlashPlug
        })
      })
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
    .use(slash)
    .use(listener)
    .use(commonmark)

  it.create().then(() => {
    editor.value = it
    emit('on-init')
  })

  return it
})

watch(
  () => props.content,
  (newVal) => {
    isLoadANewArticle = true
    editor.value?.action(replaceAll(props.content))
  }
)
</script>
