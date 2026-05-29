import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
    },
    {
      path: '/perfil',
      name: 'profile',
      component: () => import('@/views/ProfileView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/prestadores/:id',
      component: () => import('@/views/provider/ProviderDetailsView.vue'),
      props: true,
      children: [
        {
          path: '',
          redirect: to => ({ name: 'provider-details-about', params: { id: to.params.id } }),
        },
        {
          path: 'sobre',
          name: 'provider-details-about',
          component: () => import('@/components/provider/tabs/TabSobre.vue'),
          props: true,
        },
        {
          path: 'portfolio',
          name: 'provider-details-portfolio',
          component: () => import('@/components/provider/tabs/TabPortfolio.vue'),
          props: true,
        },
        {
          path: 'avaliacoes',
          name: 'provider-details-reviews',
          component: () => import('@/components/provider/tabs/TabAvaliacoes.vue'),
          props: true,
        },
      ],
    },
  ],
})

router.beforeEach(async (to) => {
  const authStore = useAuthStore()

  if (!authStore.initialized) {
    await authStore.ensureUserLoaded()
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { name: 'home' }
  }

  return true
})

export default router