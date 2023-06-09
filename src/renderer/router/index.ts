import { createRouter, createWebHashHistory } from 'vue-router'
import DefaultLayoutVue from '@/renderer/components/layout/DefaultLayout.vue'

export default createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      component: DefaultLayoutVue,
      meta: {
        titleKey: 'title.main'
      },
      redirect: '/home',
      children: [
        {
          path: 'home',
          component: () => import('@/renderer/views/HomeScreen.vue'),
          meta: {
            titleKey: 'title.home'
          }
        },
        {
          path: 'message',
          component: () => import('@/renderer/views/HomeScreen.vue'),
          meta: {
            titleKey: 'title.message'
          }
        },
        {
          path: '/settings',
          component: () => import('@/renderer/views/SettingsScreen.vue'),
          meta: {
            titleKey: 'title.settings'
          }
        },
        {
          path: '/error',
          component: () => import('@/renderer/views/ErrorScreen.vue'),
          meta: {
            titleKey: 'title.error'
          }
        }
      ]
    },

    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ]
})
