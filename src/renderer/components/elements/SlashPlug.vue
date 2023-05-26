<script lang="ts" setup>
import { editorViewCtx, rootDOMCtx, commandsCtx } from '@milkdown/core'
import { Ctx } from '@milkdown/ctx'
import { useSlash } from '../../hooks/useSlash'
import { SlashProvider, slashFactory } from '@milkdown/plugin-slash'
import {
  commonmark,
  createCodeBlockCommand,
  wrapInHeadingCommand
} from '@milkdown/preset-commonmark'
import { callCommand } from '@milkdown/utils'
import { useInstance } from '@milkdown/vue'
import { usePluginViewContext } from '@prosemirror-adapter/vue'
import { onMounted, onUnmounted, ref, VNodeRef, watch } from 'vue'
import { slash } from './slash'
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
    prefix: '',
    title: 'Large Heading',
    suffix: '',
    command: function (ctx: Ctx) {
      removeSlash(ctx)
      ctx.get(commandsCtx).call(wrapInHeadingCommand.key, 1)
    }
  },
  {
    prefix: '',
    title: 'Medium Heading',
    suffix: '',
    command: function (ctx: Ctx) {
      removeSlash(ctx)
      ctx.get(commandsCtx).call(wrapInHeadingCommand.key, 2)
    }
  },
  {
    prefix: '',
    title: 'Small Heading',
    suffix: '',
    command: function (ctx: Ctx) {
      removeSlash(ctx)
      ctx.get(commandsCtx).call(wrapInHeadingCommand.key, 3)
    }
  },
  {
    prefix: '',
    title: 'Checked List',
    suffix: '',
    command: function (ctx: Ctx) {
      removeSlash(ctx)
      ctx.get(commandsCtx).call(wrapInHeadingCommand.key, 3)
    }
  },
  {
    prefix: '',
    title: 'List',
    suffix: '',
    command: function (ctx: Ctx) {
      removeSlash(ctx)
      ctx.get(commandsCtx).call(wrapInHeadingCommand.key, 3)
    }
  },
  {
    prefix: '',
    title: 'Quote',
    suffix: '',
    command: function (ctx: Ctx) {
      removeSlash(ctx)
      ctx.get(commandsCtx).call(wrapInHeadingCommand.key, 3)
    }
  },
  // {
  //   prefix: '',
  //   title: 'Image',
  //   suffix: '',
  //   command: function (ctx: Ctx) {
  //     removeSlash(ctx)
  //     ctx.get(commandsCtx).call(insertImageCommand.key)
  //   }
  // },
  {
    prefix: '',
    title: 'Table',
    suffix: '',
    command: function (ctx: Ctx) {
      removeSlash(ctx)
      ctx.get(commandsCtx).call(wrapInHeadingCommand.key, 3)
    }
  },
  {
    prefix: '',
    title: 'Code',
    suffix: '',
    command: function (ctx: Ctx) {
      removeSlash(ctx)
      ctx.get(commandsCtx).call(wrapInHeadingCommand.key, 3)
    }
  },
  {
    prefix: '',
    title: 'Divider',
    suffix: '',
    command: function (ctx: Ctx) {
      removeSlash(ctx)
      ctx.get(commandsCtx).call(wrapInHeadingCommand.key, 3)
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
      <span class="prefix">{{ item.prefix }}</span>
      <span>{{ item.title }}</span>
      <span class="suffix">{{ item.suffix }}</span>
    </li>
  </ul>
</template>
<style scoped>
.slash-box {
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.1);
  border: 1px solid #626aef;
  border-radius: 3px;
  display: none;
}
.slash-box li {
  display: flex;
  height: 40px;
  align-items: center;
  min-width: 20rem;
}
.prefix,
.suffix {
  padding: 0 15px;
}
.active {
  background: #626aef;
  color: #fff;
}
</style>
