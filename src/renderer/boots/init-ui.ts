import type { App } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/theme-chalk/dark/css-vars.css'
import '@/renderer/assets/styles/vars.css'
import '@/renderer/assets/styles/dark-vars.css'
import 'element-plus/theme-chalk/src/message-box.scss'
import 'element-plus/theme-chalk/src/message.scss'

// Add API key defined in contextBridge to window object type
import '@imengyu/vue3-context-menu/lib/vue3-context-menu.css'
import '@/renderer/assets/styles/index.scss'

import '@milkdown/theme-nord/style.css'

export const setupUiLibrary = (app: App<Element>) => {
  app.use(ElementPlus, { zIndex: 3000 })
}
