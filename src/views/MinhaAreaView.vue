<script setup lang="ts">
import { computed, ref } from 'vue'
import { useAreasStore } from '@/stores/areas'
import { useActivitiesStore } from '@/stores/activities'
import { useSessionStore } from '@/stores/session'
import type { Atividade, AtividadeFormInput } from '@/types/activity'
import { foiDevolvida } from '@/composables/useStatusAtividade'
import { useAreaColor } from '@/composables/useAreaColor'
import AreaPlanTabs from '@/components/area/AreaPlanTabs.vue'
import AtividadeForm from '@/components/area/AtividadeForm.vue'

const areasStore = useAreasStore()
const activitiesStore = useActivitiesStore()
const sessionStore = useSessionStore()

/** Admin escolhe a área — não tem `areaId` próprio (ver roteiro-fase-2.md,
 * "Registrar ação 'no lugar de'"). */
const ehAdmin = computed(() => sessionStore.usuarioAtual?.perfil === 'admin')
const areaEscolhidaAdmin = ref('')

const areaId = computed(() => (ehAdmin.value ? areaEscolhidaAdmin.value : sessionStore.usuarioAtual?.areaId ?? ''))
const area = computed(() => areasStore.getById(areaId.value))
const atividadesDaArea = computed(() => activitiesStore.porArea(areaId.value).value)
const atividadesDevolvidas = computed(() => atividadesDaArea.value.filter(foiDevolvida))
const areasParceirasDisponiveis = computed(() =>
  areasStore.areas.filter((a) => a.id !== areaId.value),
)

const formularioAberto = ref(false)
const atividadeEmEdicao = ref<Atividade | null>(null)

function abrirCriacao(): void {
  atividadeEmEdicao.value = null
  formularioAberto.value = true
}

function abrirEdicao(atividade: Atividade): void {
  atividadeEmEdicao.value = atividade
  formularioAberto.value = true
}

function fecharFormulario(): void {
  formularioAberto.value = false
  atividadeEmEdicao.value = null
}

function autorAssinatura(): string {
  const usuario = sessionStore.usuarioAtual
  if (!usuario) return 'Desconhecido'
  return ehAdmin.value ? `${usuario.nome} (em nome de ${area.value?.sigla})` : usuario.nome
}

function salvar(dados: AtividadeFormInput): void {
  const autor = autorAssinatura()
  if (atividadeEmEdicao.value) {
    activitiesStore.atualizarAtividade(atividadeEmEdicao.value.id, dados, autor)
  } else {
    activitiesStore.cadastrarAtividade(areaId.value, dados, autor)
  }
  fecharFormulario()
}
</script>

<template>
  <div v-if="ehAdmin && !areaId">
    <header class="border-b border-line bg-card">
      <div class="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <nav class="mb-4 flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-ink-soft">
          <router-link to="/" class="hover:text-ink">Painel</router-link>
          <span>/</span>
          <span class="text-ink">Minha área</span>
        </nav>

        <h1 class="font-display text-2xl font-extrabold text-ink sm:text-3xl">Agir em nome de uma área</h1>
        <p class="mt-1 text-sm text-ink-soft">
          Escolha a área — você vai poder cadastrar e editar atividades como se fosse o Responsável dela.
        </p>
      </div>
    </header>

    <div class="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div class="flex flex-wrap gap-1.5">
        <button
          v-for="a in areasStore.areas"
          :key="a.id"
          type="button"
          class="flex items-center gap-1.5 rounded-sm border border-line bg-card px-2.5 py-1.5 text-xs font-semibold text-ink transition hover:border-brass"
          @click="areaEscolhidaAdmin = a.id"
        >
          <span class="h-2 w-2 shrink-0 rounded-full" :style="{ backgroundColor: useAreaColor(a.colorIndex).fg }" />
          {{ a.sigla }}
        </button>
      </div>
    </div>
  </div>

  <div v-else-if="area">
    <header class="border-b border-line bg-card">
      <div class="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <nav class="mb-4 flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-ink-soft">
          <router-link to="/" class="hover:text-ink">Painel</router-link>
          <span>/</span>
          <span class="text-ink">Minha área</span>
        </nav>

        <h1 class="font-display text-2xl font-extrabold text-ink sm:text-3xl">{{ area.nome }}</h1>
        <p class="mt-1 text-sm text-ink-soft">
          {{ atividadesDaArea.length }} atividades sob responsabilidade da {{ area.sigla }}.
        </p>
        <button
          v-if="ehAdmin"
          type="button"
          class="mt-2 font-mono text-[11px] uppercase tracking-widest text-brass hover:underline"
          @click="areaEscolhidaAdmin = ''"
        >
          ← Trocar área
        </button>
      </div>
    </header>

    <div class="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-8 sm:px-6">
      <div
        v-if="atividadesDevolvidas.length > 0"
        class="rounded-card border border-status-critical/40 bg-status-critical-bg p-4"
      >
        <p class="text-sm font-semibold text-status-critical">
          {{ atividadesDevolvidas.length }} atividade{{ atividadesDevolvidas.length === 1 ? '' : 's' }}
          devolvida{{ atividadesDevolvidas.length === 1 ? '' : 's' }} pelo Validador — veja o motivo e reenvie.
        </p>
        <ul class="mt-2 flex flex-col gap-1">
          <li v-for="atividade in atividadesDevolvidas" :key="atividade.id">
            <router-link
              :to="{ name: 'atividade', params: { areaId: atividade.areaLiderId, activityId: atividade.id } }"
              class="text-sm text-status-critical underline hover:no-underline"
            >
              {{ atividade.titulo }}
            </router-link>
          </li>
        </ul>
      </div>

      <p v-if="ehAdmin" class="text-xs italic text-ink-soft">
        Você está agindo em nome do Responsável da {{ area.sigla }}.
      </p>

      <button
        v-if="!formularioAberto"
        type="button"
        class="self-start rounded-sm border border-brand bg-brand px-4 py-2 text-sm font-semibold text-on-brand transition hover:bg-brand-2"
        @click="abrirCriacao"
      >
        + Nova atividade
      </button>

      <AtividadeForm
        v-if="formularioAberto"
        :key="atividadeEmEdicao?.id ?? 'novo'"
        :atividade="atividadeEmEdicao ?? undefined"
        :areas-parceiras-disponiveis="areasParceirasDisponiveis"
        @salvar="salvar"
        @cancelar="fecharFormulario"
      />

      <section class="panel p-6">
        <h2 class="font-display text-lg font-bold text-ink">Plano de atividades</h2>
        <div class="mt-4">
          <AreaPlanTabs
            :atividades="atividadesDaArea"
            :area-atual-id="areaId"
            editavel
            @editar="abrirEdicao"
          />
        </div>
      </section>
    </div>
  </div>

  <p v-else class="mx-auto max-w-4xl px-4 py-16 text-center text-sm text-ink-soft">
    {{ areasStore.carregado ? 'Área não encontrada para este usuário.' : 'Carregando…' }}
  </p>
</template>
