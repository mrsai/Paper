import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getSettings } from '../utils/index'

export const useSettingStore = defineStore('Setting', () => {
  const settings = ref<any>({})

  getSettings().then((res) => {
    settings.value = res
  })

  const updateSettings = (data: any) => {
    settings.value = data
  }
  return {
    settings,
    updateSettings
  }
})
