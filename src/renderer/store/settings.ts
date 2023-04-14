import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getSettings, saveSettings } from '../utils/index'

export const useSettingStore = defineStore('Setting', () => {
  const settings = ref<any>({})
  try {
    getSettings()
      .then((res) => (settings.value = res))
      .catch()
  } catch (error) {
    console.log('getSettings error', error)
  }

  const saveSetting = async () => await saveSettings(settings.value)

  return {
    settings,
    saveSetting
  }
})
