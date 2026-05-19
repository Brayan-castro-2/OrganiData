import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import LoginView from '../views/LoginView.vue';
import SignupView from '../views/SignupView.vue';
import DashboardView from '../views/DashboardView.vue';
import AprendeView from '../views/AprendeView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { requiresAuth: false }
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignupView,
      meta: { requiresAuth: false }
    },
    {
      path: '/',
      name: 'dashboard',
      component: DashboardView,
      meta: { requiresAuth: true }
    },
    {
      path: '/aprende',
      name: 'aprende',
      component: AprendeView,
      meta: { requiresAuth: true }
    },
    {
      path: '/historial',
      name: 'historial',
      component: () => import('../views/HistorialView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/avisos',
      name: 'avisos',
      component: () => import('../views/AvisosView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/comunidad',
      name: 'comunidad',
      component: () => import('../views/ComunidadView.vue'),
      meta: { requiresAuth: true }
    }
  ]
});

// Navigation Guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const publicRoutes = ['/login', '/signup'];

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login');
  } else if (publicRoutes.includes(to.path) && authStore.isAuthenticated) {
    next('/');
  } else {
    next();
  }
});

export default router;
