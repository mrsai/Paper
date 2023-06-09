<template>
  <Milkdown />
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { Editor, rootCtx } from '@milkdown/core'
import { nord } from '@milkdown/theme-nord'
import { Milkdown, useEditor } from '@milkdown/vue'
import { commonmark } from '@milkdown/preset-commonmark'
import { replaceAll } from '@milkdown/utils'
import { listener, listenerCtx } from '@milkdown/plugin-listener'
import { usePluginViewFactory } from '@prosemirror-adapter/vue'
import { gfm } from '@milkdown/preset-gfm'
import { slash } from './slash'
import PSlash from './slash/PSlash.vue'

const editor = ref(null as Editor | null)
// const slash = slashFactory('slashMenu') satisfies MilkdownPlugin[]

const pluginViewFactory = usePluginViewFactory()

// 为了区分markdownUpdated这个监听函数中，编辑器是初始化的时候输出的内容，还是修改内容时候输出的内容，引入了这个参数
let isLoadANewArticle = false
// 这个优化影响保存，暂时先注释掉
// const debouncedUpdate = useDebounceFn((markdown: any) => {
//   update({ ...selectedFile.value, content: markdown, isSaved: false })
// }, 500)
// const props = defineProps({
//   content: '',
//   unique: ''
// })

const props = defineProps({
  content: {
    type: String,
    default: ''
  },
  unique: {
    type: String,
    default: ''
  }
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
          component: PSlash
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
    .use(gfm)

  it.create().then(() => {
    editor.value = it
    emit('on-init')
  })

  return it
})

watch(
  () => [props.unique, props.content],
  () => {
    isLoadANewArticle = true
    editor.value?.action(replaceAll(props.content))
  }
)
</script>
