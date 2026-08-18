import { createRouter, createWebHistory } from 'vue-router'
import { useSessionStore } from '@/stores/session'
import type { Perfil } from '@/types/usuario'

declare module 'vue-router' {
  interface RouteMeta {
    requerPerfil?: Perfil
  }
}

export const router = createRouter({
  history: createWebHistory(),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    // Só troca de query na mesma rota (ex.: artigo da documentação, ?a=...) —
    // não é uma página nova, não deve jogar o scroll pro topo.
    if (to.path === from.path) return false
    return { top: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'painel',
      component: () => import('@/views/PainelMacroView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
    },
    {
      path: '/minha-area',
      name: 'minha-area',
      component: () => import('@/views/MinhaAreaView.vue'),
      meta: { requerPerfil: 'responsavel' },
    },
    {
      path: '/validacao',
      name: 'validacao',
      component: () => import('@/views/ValidacaoView.vue'),
      meta: { requerPerfil: 'validador' },
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('@/views/AdminView.vue'),
      meta: { requerPerfil: 'admin' },
    },
    {
      path: '/admin/parametros',
      name: 'admin-parametros',
      component: () => import('@/views/AdminParametrosView.vue'),
      meta: { requerPerfil: 'admin' },
    },
    {
      path: '/admin/usuarios',
      name: 'admin-usuarios',
      component: () => import('@/views/AdminUsuariosView.vue'),
      meta: { requerPerfil: 'admin' },
    },
    {
      path: '/auditoria',
      name: 'auditoria',
      component: () => import('@/views/AuditoriaView.vue'),
      meta: { requerPerfil: 'auditor' },
    },
    {
      path: '/documentacao',
      name: 'documentacao',
      component: () => import('@/views/DocumentacaoView.vue'),
    },
    {
      path: '/feed',
      name: 'feed',
      component: () => import('@/views/FeedView.vue'),
    },
    {
      path: '/eventos',
      name: 'eventos',
      component: () => import('@/views/EventsView.vue'),
    },
    {
      path: '/eventos/:eventoId',
      name: 'evento-detalhe',
      component: () => import('@/views/EventoDetalheView.vue'),
      props: true,
    },
    {
      path: '/ranking',
      name: 'ranking',
      component: () => import('@/views/RankingView.vue'),
    },
    {
      path: '/areas/:areaId',
      name: 'area',
      component: () => import('@/views/AreaView.vue'),
      props: true,
    },
    {
      path: '/areas/:areaId/atividades/:activityId',
      name: 'atividade',
      component: () => import('@/views/ActivityDetailView.vue'),
      props: true,
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
    },
  ],
})

router.beforeEach((to) => {
  const perfilExigido = to.meta.requerPerfil
  if (!perfilExigido) return true

  const sessionStore = useSessionStore()
  const perfilAtual = sessionStore.usuarioAtual?.perfil
  // Admin passa por qualquer guarda de perfil — pode agir no lugar de
  // Responsável ou Validador (ver ActivityDetailView.vue/MinhaAreaView.vue).
  if (perfilAtual !== perfilExigido && perfilAtual !== 'admin') {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
  return true
})
