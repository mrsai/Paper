、<script lang="ts" setup>
import { editorViewCtx, rootDOMCtx, commandsCtx } from '@milkdown/core'
import { H1 } from '@icon-park/vue-next'
import { Ctx } from '@milkdown/ctx'
import { useSlash } from './useSlash'
import { SlashProvider, slashFactory } from '@milkdown/plugin-slash'
import { callCommand } from '@milkdown/utils'
import { useInstance } from '@milkdown/vue'
import { usePluginViewContext } from '@prosemirror-adapter/vue'
import { onMounted, onUnmounted, ref, VNodeRef, watch } from 'vue'
import { slash } from './index'
import IconWrap from '@/renderer/components/elements/IconWrap.vue'
import {
  commonmark,
  createCodeBlockCommand,
  wrapInHeadingCommand,
  insertHrCommand,
  wrapInBlockquoteCommand,
  wrapInBulletListCommand,
  wrapInOrderedListCommand
} from '@milkdown/preset-commonmark'
import { insertTableCommand } from '@milkdown/preset-gfm'

const { view, prevState } = usePluginViewContext()

const { loading, get, removeSlash, handleKeyDown, currentIndex } = useSlash()

const divRef = ref<VNodeRef>()

let slashProvider: SlashProvider

const addCodeBlock = (ctx: Ctx) => {
  removeSlash(ctx)
  ctx.get(commandsCtx).call(createCodeBlockCommand.key)
}

const list = ref([
  {
    prefix: 'H1',
    title: 'Large Heading',
    suffix: '',
    command: function (ctx: Ctx) {
      removeSlash(ctx)
      ctx.get(commandsCtx).call(wrapInHeadingCommand.key, 1)
    }
  },
  {
    prefix: 'H2',
    title: 'Medium Heading',
    suffix: '',
    command: function (ctx: Ctx) {
      removeSlash(ctx)
      ctx.get(commandsCtx).call(wrapInHeadingCommand.key, 2)
    }
  },
  {
    prefix: 'H3',
    title: 'Small Heading',
    suffix: '',
    command: function (ctx: Ctx) {
      removeSlash(ctx)
      ctx.get(commandsCtx).call(wrapInHeadingCommand.key, 3)
    }
  },
  {
    prefix: 'OrderedList',
    title: 'Ordered List',
    suffix: '',
    command: function (ctx: Ctx) {
      removeSlash(ctx)
      ctx.get(commandsCtx).call(wrapInOrderedListCommand.key)
    }
  },
  {
    prefix: 'ListTop',
    title: 'Unordered List',
    suffix: '',
    command: function (ctx: Ctx) {
      removeSlash(ctx)
      ctx.get(commandsCtx).call(wrapInBulletListCommand.key)
    }
  },
  {
    prefix: 'Quote',
    title: 'Quote',
    suffix: '',
    command: function (ctx: Ctx) {
      removeSlash(ctx)
      ctx.get(commandsCtx).call(wrapInBlockquoteCommand.key)
    }
  },
  {
    prefix: 'InsertTable',
    title: 'Table',
    suffix: '',
    command: function (ctx: Ctx) {
      removeSlash(ctx)
      ctx.get(commandsCtx).call(insertTableCommand.key)
    }
  },
  {
    prefix: 'CodeOne',
    title: 'Code',
    suffix: '',
    command: function (ctx: Ctx) {
      removeSlash(ctx)
      ctx.get(commandsCtx).call(createCodeBlockCommand.key)
    }
  },
  {
    prefix: 'DividingLine',
    title: 'Divider',
    suffix: '',
    command: function (ctx: Ctx) {
      removeSlash(ctx)
      ctx.get(commandsCtx).call(insertHrCommand.key)
    }
  }
])

const handleKeyDownFn = (e: KeyboardEvent) => handleKeyDown(e, list)

watch([view, prevState], () => {
  slashProvider?.update(view.value, prevState.value)
})

onUnmounted(() => {
  slashProvider.destroy()
})
onMounted(() => {
  slashProvider = new SlashProvider({
    content: divRef.value as any,
    debounce: 50,
    shouldShow(this: SlashProvider, view: any) {
      const currentText = this.getContent(view)
      if (currentText === '') {
        return false
      }
      // Display the menu if the last character is `/`.
      return !!(currentText?.endsWith('、') || currentText?.endsWith('/'))
    },
    tippyOptions: {
      onShow() {
        get()!.action((ctx) => {
          // setOpend(true)
          ctx.update(slash.key, (prev) => {
            return { ...prev, opened: true }
          })
          const root = ctx.get(rootDOMCtx)
          root?.addEventListener('keydown', handleKeyDownFn)
        })
      },
      onHide() {
        get()!.action((ctx) => {
          ctx.update(slash.key, (prev) => {
            return { ...prev, opened: false }
          })
          const root = ctx.get(rootDOMCtx)
          root?.removeEventListener('keydown', handleKeyDownFn)
        })
      },
      onMount() {
        // 解决初始化会抖动出现的问题
        if (divRef.value) {
          ;(divRef.value as any).style.display = 'block'
        }
      }
    }
  })
  slashProvider.update(view.value, prevState.value)
})
</script>

<template>
  <ul ref="divRef" class="slash-box">
    <li
      v-for="(item, index) in list"
      :key="item.title"
      :class="{ active: index === currentIndex }"
      @click="item.command"
      @keydown.enter="item.command"
    >
      <span class="prefix"
        ><IconWrap
          :icon="item.prefix"
          theme="multi-color"
          size="16"
          :fill="['#333', '#2F88FF', '#FFF', '#43CCF8']"
      /></span>
      <span>{{ item.title }}</span>
      <span class="suffix">{{ item.suffix }}</span>
    </li>
  </ul>
</template>
<style scoped>
.slash-box {
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.1);
  border: 3px solid #626aef;
  border-radius: 3px;
  display: none;
  background-color: #fff;
}
.slash-box li {
  display: flex;
  height: 40px;
  align-items: center;
  min-width: 20rem;
}
.prefix,
.suffix {
  padding: 0 20px;
}
.active {
  background: rgba(0, 0, 0, 0.1);
}
</style>
