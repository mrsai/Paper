import { createI18n } from 'vue-i18n'
import en from '@/renderer/locales/en.json'
import zhHans from '@/renderer/locales/zh-hans.json'
// import ko from '@/renderer/locales/ko.json'
// import zhHans from '@/renderer/locales/zh-hans.json'
// import de from '@/renderer/locales/de.json'
// import es from '@/renderer/locales/es.json'
// import ja from '@/renderer/locales/ja.json'
// import fr from '@/renderer/locales/fr.json'
// import ru from '@/renderer/locales/ru.json'
// import pt from '@/renderer/locales/pt.json'
// import { getCurrentLocale } from '@/renderer/utils'

export default createI18n({
  legacy: false,
  locale: 'zhHans',
  fallbackLocale: 'en',
  globalInjection: true,
  messages: {
    en,
    zhHans,
  }
})
