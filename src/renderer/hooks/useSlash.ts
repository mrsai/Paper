import { slashFactory } from '@milkdown/plugin-slash'
import { editorViewCtx, rootDOMCtx } from '@milkdown/core'
import { Ctx, MilkdownPlugin } from '@milkdown/ctx'
import { useInstance } from '@milkdown/vue'
import { ref } from 'vue'
export const useSlash = () => {
  const [loading, get] = useInstance()
  const currentIndex = ref(0)

  function handleKeyDown(e: KeyboardEvent, list: any) {
    const key = e.key
    if (key === 'ArrowDown') {
      currentIndex.value = (currentIndex.value + 1) % list.value.length
    }
    if (key === 'ArrowUp') {
      currentIndex.value = (currentIndex.value - 1 + list.value.length) % list.value.length
    }
    if (key === 'Enter') {
      get()?.action(list.value[currentIndex.value].command)
    }
  }

  const removeSlash = (ctx: Ctx) => {
    const view = ctx.get(editorViewCtx)
    view.dispatch(view.state.tr.delete(view.state.selection.from - 1, view.state.selection.from))
    // view.dispatch(
    //   view.state.tr.deleteRange(view.state.selection.from - 1, view.state.selection.from)
    // )
  }

  return { loading, get, currentIndex, handleKeyDown, removeSlash }
}
