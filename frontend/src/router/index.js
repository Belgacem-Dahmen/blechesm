import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js'

const routes = [
  // Public
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/public/HomeView.vue'),
  },
  {
    path: '/configurateur',
    name: 'configurator',
    component: () => import('@/views/public/ConfiguratorView.vue'),
  },
  {
    path: '/resultat',
    name: 'generation-result',
    component: () => import('@/views/public/GenerationResultView.vue'),
  },
  {
    path: '/devis',
    name: 'quote-request',
    component: () => import('@/views/public/QuoteRequestView.vue'),
  },
  {
    path: '/a-propos',
    name: 'about',
    component: () => import('@/views/public/AboutView.vue'),
  },
  {
    path: '/contact',
    name: 'contact',
    component: () => import('@/views/public/ContactView.vue'),
  },
  {
    path: '/mentions-legales',
    name: 'legal',
    component: () => import('@/views/public/LegalView.vue'),
  },

  // Admin
  {
    path: '/admin/login',
    name: 'admin-login',
    component: () => import('@/views/admin/AdminLoginView.vue'),
  },
  {
    path: '/admin',
    redirect: '/admin/dashboard',
    meta: { requiresAuth: true },
  },
  {
    path: '/admin/dashboard',
    name: 'admin-dashboard',
    component: () => import('@/views/admin/AdminDashboardView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/admin/demandes',
    name: 'admin-requests',
    component: () => import('@/views/admin/AdminRequestsView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/admin/demandes/:id',
    name: 'admin-request-detail',
    component: () => import('@/views/admin/AdminRequestDetailView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/admin/portfolio',
    name: 'admin-portfolio',
    component: () => import('@/views/admin/AdminPortfolioView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/admin/comptes',
    name: 'admin-accounts',
    component: () => import('@/views/admin/AdminAccountsView.vue'),
    meta: { requiresAuth: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0, behavior: 'smooth' }
  },
})

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    next({ name: 'admin-login' })
  } else {
    next()
  }
})

export default router
