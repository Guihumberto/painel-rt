<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAreasStore } from '@/stores/areas'
import { useSessionStore } from '@/stores/session'
import { useUsuariosStore } from '@/stores/usuarios'
import { PERFIL_LABEL, type Usuario } from '@/types/usuario'

const route = useRoute()
const router = useRouter()
const areasStore = useAreasStore()
const sessionStore = useSessionStore()
const usuariosStore = useUsuariosStore()

const usuariosComRotulo = computed(() =>
  usuariosStore.usuarios.map((usuario) => ({
    usuario,
    rotulo: usuario.areaId
      ? `${PERFIL_LABEL[usuario.perfil]} · ${areasStore.getById(usuario.areaId)?.sigla ?? usuario.areaId}`
      : PERFIL_LABEL[usuario.perfil],
  })),
)

function entrarComo(usuario: Usuario): void {
  sessionStore.entrarComo(usuario)
  const destino = typeof route.query.redirect === 'string' ? route.query.redirect : '/'
  router.push(destino)
}
</script>

<template>
  <div>
    <header class="border-b border-line bg-card">
      <div class="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <nav class="mb-4 flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-ink-soft">
          <router-link to="/" class="hover:text-ink">Painel</router-link>
          <span>/</span>
          <span class="text-ink">Entrar</span>
        </nav>

        <h1 class="font-display text-2xl font-extrabold text-ink sm:text-3xl">Entrar no painel</h1>
        <p class="mt-1 text-sm text-ink-soft">
          Acesso para responsáveis de área, validadores e administração.
        </p>
      </div>
    </header>

    <div class="mx-auto max-w-sm px-4 py-10 sm:px-6">
      <div class="panel p-6">
        <button
          type="button"
          disabled
          class="w-full cursor-not-allowed rounded-sm border border-line bg-paper px-4 py-2.5 text-sm font-semibold text-ink-soft opacity-60"
        >
          Entrar com SSO da SEFAZ-MA
        </button>
        <p class="mt-2 text-xs leading-relaxed text-ink-soft">
          Aguardando integração da COTEC com o SSO institucional (Keycloak/OIDC) — ver
          <code class="font-mono">docs/roteiro-fase-2.md</code>.
        </p>

        <div class="my-6 border-t border-line" />

        <p class="mb-3 font-mono text-[11px] uppercase tracking-widest text-ink-soft">
          Nesta demonstração, entre como
        </p>
        <div class="flex flex-wrap gap-1.5">
          <button
            v-for="{ usuario, rotulo } in usuariosComRotulo"
            :key="usuario.id"
            type="button"
            class="rounded-sm border border-line bg-card px-2.5 py-1.5 text-xs font-semibold text-ink transition duration-150 hover:border-brass active:scale-95 motion-reduce:active:scale-100"
            @click="entrarComo(usuario)"
          >
            {{ rotulo }}
          </button>
        </div>
      </div>

      <p class="mt-4 text-center font-mono text-[11px] uppercase tracking-widest text-ink-soft">
        Ambiente de demonstração — sem SSO real integrado ainda
      </p>
    </div>
  </div>
</template>
