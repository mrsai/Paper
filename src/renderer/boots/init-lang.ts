import type { App } from 'vue'
import i18n from '@/renderer/plugins/i18n'
export const setupLanguage = (app: App<Element>) => {
  app.use(i18n)
}
