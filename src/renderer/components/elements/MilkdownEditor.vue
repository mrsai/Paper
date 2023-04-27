<template>
  <Milkdown />
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  watch,
  onMounted,
  nextTick,
  withDefaults,
  defineProps,
  defineEmits
} from 'vue'
import { storeToRefs } from 'pinia'
import { Editor, rootCtx, defaultValueCtx } from '@milkdown/core'
import { nord } from '@milkdown/theme-nord'
import { Milkdown, useEditor } from '@milkdown/vue'
import { commonmark } from '@milkdown/preset-commonmark'
import { useDirectoryStore } from '@/renderer/store/directory'
import { openLocalFile, saveLocalFile } from '@/renderer/utils'
import { insert, replaceAll } from '@milkdown/utils'
import { listener, listenerCtx } from '@milkdown/plugin-listener'
import { useDebounceFn } from '@vueuse/core'

export default defineComponent({
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'MilkdownVue',
  components: {
    Milkdown
  },
  setup: () => {
    const { selectedFile, selectedKey } = storeToRefs(useDirectoryStore())
    const { update } = useDirectoryStore()
    const milkMdRef = ref(null as any)
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
    const emit = defineEmits(['on-changed'])
    useEditor((root) => {
      const it = Editor.make()
        .config(nord)
        .config((ctx) => {
          ctx.set(rootCtx, root)
        })
        .config((ctx: any) => {
          ctx.get(listenerCtx).markdownUpdated((ctx: any, markdown: any, prevMarkdown: any) => {
            // 解决初始化的问题
            console.log('is', isLoadANewArticle)

            if (!isLoadANewArticle) {
              update({
                ...selectedFile.value,
                content: markdown,
                isSaved: false
              })
            } else {
              isLoadANewArticle = false
            }
          })
        })
        .use(listener)
        .use(commonmark)
      editor.value = it
      return it
    })

    watch(
      () => selectedFile.value,
      (newVal) => {
        if (newVal) {
          openLocalFile(newVal).then((content) => {
            isLoadANewArticle = true
            update({ ...selectedFile.value, content })
            editor.value?.action(replaceAll(content))
          })
        }
      },
      { immediate: true }
    )

    onMounted(() => {
      // const t = setTimeout(() => {
      //   const el = document.querySelector('div.editor[role=textbox]')
      //   el?.addEventListener(
      //     'blur',
      //     () => {
      //       saveLocalFile(selectedFile.value).then(() => {
      //         update({ ...selectedFile.value, isSaved: true })
      //         clearTimeout(t)
      //       })
      //     },
      //     false
      //   )
      // }, 1000)
    })

    return {
      editor,
      selectedKey,
      selectedFile
    }
  }
})
</script>
