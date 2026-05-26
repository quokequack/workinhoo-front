import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
    },
    {
      path: '/inicio',
      name: 'logged-home',
      component: () => import('@/views/LoggedHomeView.vue'),
    },
  ],
})

export default router
