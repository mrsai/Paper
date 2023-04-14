import { createApp } from 'vue'
import { setupStore } from '@/renderer/boots/init-store'
import { setupRouter } from '@/renderer/boots/init-router'
import { setupUiLibrary } from '@/renderer/boots/init-ui'
import { setupLanguage } from '@/renderer/boots/init-lang'
import { setupIcons } from '@/renderer/boots/init-icon'
import App from '@/renderer/App.vue'

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    mainApi?: any
  }
}

const run = async () => {
  const app = createApp(App)

  setupStore(app)
  setupRouter(app)
  setupUiLibrary(app)
  setupLanguage(app)
  setupIcons(app)

  app.mount('#app')
}

run()
