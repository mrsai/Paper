import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getClipboard } from '@/renderer/utils'

export const useAutoParseStore = defineStore('AutoParse', () => {
  let timer: any = null
  const isAutoPasteRunning = ref(false)
  const lastCopy = ref('')

  const startAutoParse = (next?: Function) => {
    timer = setInterval(async () => {
      const res = await getClipboard()
      if (res !== lastCopy.value) {
        lastCopy.value = res
        next?.(res)
      }
    }, 500)
    console.log('cesee')

    isAutoPasteRunning.value = true
  }

  const stopAutoParse = () => {
    clearInterval(timer)
    isAutoPasteRunning.value = false
  }

  return {
    lastCopy,
    isAutoPasteRunning,
    startAutoParse,
    stopAutoParse
  }
})
