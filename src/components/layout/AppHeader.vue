<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useInstitucionalStore } from '@/stores/institucional'
import { useSessionStore } from '@/stores/session'
import { PERFIL_LABEL } from '@/types/usuario'
import ThemeToggle from './ThemeToggle.vue'

const institucional = useInstitucionalStore()
const sessionStore = useSessionStore()

const hoje = computed(() =>
  new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date()),
)

/**
 * Acima disso o cabeçalho encolhe pra uma barra compacta — fixo no topo,
 * nunca rola pra fora, só reduz (mesmo padrão de apps profissionais).
 *
 * Dois limiares em vez de um só, de propósito: como o cabeçalho muda de
 * altura ao encolher, isso desloca o conteúdo abaixo dele, o que pode mexer
 * de novo em `scrollY` bem na hora em que ele cruza o limiar — sem essa
 * "zona morta" entre os dois valores, isso faz o cabeçalho piscar
 * (encolhe → scroll ajusta → expande → cruza o limiar → encolhe → ...).
 */
const LIMIAR_ENCOLHER = 64
const LIMIAR_EXPANDIR = 24
const rolado = ref(false)

function aoRolar(): void {
  if (!rolado.value && window.scrollY > LIMIAR_ENCOLHER) {
    rolado.value = true
  } else if (rolado.value && window.scrollY < LIMIAR_EXPANDIR) {
    rolado.value = false
  }
}

onMounted(() => window.addEventListener('scroll', aoRolar, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', aoRolar))
</script>

<template>
  <header class="sticky top-0 z-50 border-b-4 border-brass bg-brand text-on-brand">
    <div
      class="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 transition-[padding] duration-300 sm:px-6"
      :class="rolado ? 'py-2' : 'py-4'"
    >
      <router-link to="/" class="group flex items-center gap-3">
        <span
          class="flex shrink-0 items-center justify-center rounded-sm border border-brass/40 bg-brand-2 font-display font-black tracking-tight text-brass transition-all duration-300"
          :class="rolado ? 'h-8 w-8 text-[10px]' : 'h-10 w-10 text-[11px]'"
          aria-hidden="true"
        >
          {{ institucional.comiteSigla }}
        </span>

        <span class="flex flex-col leading-tight">
          <span
            class="font-display font-extrabold uppercase tracking-tight text-on-brand transition-all duration-300"
            :class="rolado ? 'text-base' : 'text-lg sm:text-2xl'"
          >
            {{ institucional.nomePainelPrefixo }}
            <span class="text-brass">{{ institucional.nomePainelDestaque }}</span>
          </span>
          <span
            v-if="!rolado"
            class="hidden font-mono text-[10px] uppercase tracking-[0.16em] text-on-brand/50 sm:block"
          >
            {{ institucional.comiteCompleto }}
          </span>
        </span>
      </router-link>

      <Transition name="fade" mode="out-in">
        <div
          v-if="!rolado"
          key="completo"
          class="flex flex-wrap items-center gap-x-4 gap-y-1.5 font-mono text-[11px] uppercase tracking-widest text-on-brand/60"
        >
          <span class="hidden capitalize sm:inline">{{ hoje }}</span>
          <span class="flex items-center gap-1.5 text-on-brand/80">
            <span class="h-1.5 w-1.5 animate-pulse rounded-full bg-status-good" />
            Edição contínua
          </span>

          <span v-if="sessionStore.usuarioAtual" class="flex flex-wrap items-center gap-x-3 gap-y-1.5 border-l border-on-brand/20 pl-4 text-on-brand/80">
            <router-link
              v-if="sessionStore.usuarioAtual.perfil === 'responsavel' || sessionStore.usuarioAtual.perfil === 'admin'"
              to="/minha-area"
              class="text-brass hover:underline"
            >
              Minha área
            </router-link>
            <router-link
              v-if="sessionStore.usuarioAtual.perfil === 'validador' || sessionStore.usuarioAtual.perfil === 'admin'"
              to="/validacao"
              class="text-brass hover:underline"
            >
              Fila de validação
            </router-link>
            <router-link v-if="sessionStore.usuarioAtual.perfil === 'admin'" to="/admin" class="text-brass hover:underline">
              Administração
            </router-link>
            <router-link
              v-if="sessionStore.usuarioAtual.perfil === 'auditor' || sessionStore.usuarioAtual.perfil === 'admin'"
              to="/auditoria"
              class="text-brass hover:underline"
            >
              Auditoria
            </router-link>
            <span>{{ sessionStore.usuarioAtual.nome }} · {{ PERFIL_LABEL[sessionStore.usuarioAtual.perfil] }}</span>
            <button type="button" class="text-brass hover:underline" @click="sessionStore.sair()">Sair</button>
          </span>
          <router-link v-else to="/login" class="border-l border-on-brand/20 pl-4 text-brass hover:underline">
            Entrar →
          </router-link>
          <ThemeToggle class="border-l border-on-brand/20 pl-4" />
        </div>

        <div v-else key="compacto" class="flex items-center gap-3 font-mono text-[11px] uppercase tracking-widest">
          <button
            v-if="sessionStore.usuarioAtual"
            type="button"
            class="text-brass hover:underline"
            @click="sessionStore.sair()"
          >
            Sair
          </button>
          <router-link v-else to="/login" class="text-brass hover:underline">Entrar →</router-link>
          <ThemeToggle />
        </div>
      </Transition>
    </div>
  </header>
</template>
