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
      path: '/cadastrar',
      name: 'register',
      component: () => import('@/views/RegisterView.vue'),
    },
    {
      path: '/entrar',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
    },
    {
      path: '/recuperar-senha',
      name: 'recover-password',
      component: () => import('@/views/RecoverPasswordView.vue'),
    },
  ],
})

export default router