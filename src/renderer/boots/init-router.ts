import type { App } from 'vue'
import router from '@/renderer/router'
export const setupRouter = (app: App<Element>) => {
  app.use(router)
}
