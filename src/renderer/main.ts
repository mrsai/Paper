import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from '@/renderer/App.vue'
import router from '@/renderer/router'
import i18n from '@/renderer/plugins/i18n'

import ElementPlus from 'element-plus'
import 'element-plus/theme-chalk/dark/css-vars.css'
import '@/renderer/assets/styles/dark-vars.css'

// Add API key defined in contextBridge to window object type
import '@imengyu/vue3-context-menu/lib/vue3-context-menu.css'
import '@/renderer/assets/styles/index.scss'
declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    mainApi?: any
  }
}

const app = createApp(App)

app.use(i18n).use(router).use(createPinia()).use(ElementPlus, { zIndex: 3000 })

app.mount('#app')
