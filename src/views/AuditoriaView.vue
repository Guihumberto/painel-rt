<script setup lang="ts">
import { computed } from 'vue'
import { useActivitiesStore } from '@/stores/activities'
import { useAreasStore } from '@/stores/areas'
import { useParametrosStore } from '@/stores/parametros'
import { foiDevolvida, getStatusAtividade, motivoDevolucao } from '@/composables/useStatusAtividade'
import { filaDeValidacao } from '@/composables/useFilaValidacao'
import AreaAvatar from '@/components/shared/AreaAvatar.vue'

const activitiesStore = useActivitiesStore()
const areasStore = useAreasStore()
const parametrosStore = useParametrosStore()

const devolvidas = computed(() =>
  activitiesStore.atividades
    .filter(foiDevolvida)
    .map((atividade) => ({ atividade, area: areasStore.getById(atividade.areaLiderId) })),
)

const atrasadas = computed(() =>
  activitiesStore.atividades
    .filter((a) => getStatusAtividade(a).estado === 'atrasada')
    .map((atividade) => ({ atividade, area: areasStore.getById(atividade.areaLiderId) }))
    .sort((a, b) => (a.atividade.dataFim < b.atividade.dataFim ? -1 : 1)),
)

const fila = computed(() => filaDeValidacao(activitiesStore.atividades))

function formatar(data: string): string {
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).format(
    new Date(`${data}T12:00:00`),
  )
}
</script>

<template>
  <div>
    <header class="border-b border-line bg-card">
      <div class="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <nav class="mb-4 flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-ink-soft">
          <router-link to="/" class="hover:text-ink">Painel</router-link>
          <span>/</span>
          <span class="text-ink">Auditoria</span>
        </nav>

        <h1 class="font-display text-2xl font-extrabold text-ink sm:text-3xl">Auditoria</h1>
        <p class="mt-1 text-sm text-ink-soft">
          Devoluções, atrasos e fila de validação consolidados de todas as áreas — só leitura.
        </p>
      </div>
    </header>

    <div class="mx-auto flex max-w-4xl flex-col gap-8 px-4 py-8 sm:px-6">
      <section class="panel p-6">
        <h2 class="font-display text-lg font-bold text-ink">
          Devolvidas aguardando reenvio
          <span class="font-mono text-sm font-normal text-ink-soft">· {{ devolvidas.length }}</span>
        </h2>
        <div class="mt-4 flex flex-col divide-y divide-line">
          <router-link
            v-for="{ atividade, area } in devolvidas"
            :key="atividade.id"
            :to="{ name: 'atividade', params: { areaId: atividade.areaLiderId, activityId: atividade.id } }"
            class="flex items-start gap-3 py-3 transition hover:bg-paper-dim"
          >
            <AreaAvatar v-if="area" :area="area" size="sm" class="mt-0.5 shrink-0" />
            <div class="min-w-0">
              <p class="truncate text-sm font-semibold text-ink">{{ atividade.titulo }}</p>
              <p v-if="motivoDevolucao(atividade)" class="mt-0.5 text-xs text-status-critical">
                {{ motivoDevolucao(atividade) }}
              </p>
            </div>
          </router-link>
          <p v-if="devolvidas.length === 0" class="py-8 text-center text-sm text-ink-soft">
            Nenhuma atividade devolvida no momento.
          </p>
        </div>
      </section>

      <section class="panel p-6">
        <h2 class="font-display text-lg font-bold text-ink">
          Atrasadas
          <span class="font-mono text-sm font-normal text-ink-soft">· {{ atrasadas.length }}</span>
        </h2>
        <div class="mt-4 flex flex-col divide-y divide-line">
          <router-link
            v-for="{ atividade, area } in atrasadas"
            :key="atividade.id"
            :to="{ name: 'atividade', params: { areaId: atividade.areaLiderId, activityId: atividade.id } }"
            class="flex items-center justify-between gap-3 py-3 transition hover:bg-paper-dim"
          >
            <div class="flex min-w-0 items-center gap-3">
              <AreaAvatar v-if="area" :area="area" size="sm" />
              <p class="truncate text-sm font-semibold text-ink">{{ atividade.titulo }}</p>
            </div>
            <span class="shrink-0 rounded-chip bg-status-critical-bg px-2.5 py-1 text-xs font-semibold text-status-critical">
              Prazo: {{ formatar(atividade.dataFim) }}
            </span>
          </router-link>
          <p v-if="atrasadas.length === 0" class="py-8 text-center text-sm text-ink-soft">
            Nenhuma atividade atrasada no momento.
          </p>
        </div>
      </section>

      <section class="panel p-6">
        <h2 class="font-display text-lg font-bold text-ink">
          Aguardando validação
          <span class="font-mono text-sm font-normal text-ink-soft">· {{ fila.length }}</span>
        </h2>
        <div class="mt-4 flex flex-col divide-y divide-line">
          <router-link
            v-for="{ atividade, area, dias } in fila"
            :key="atividade.id"
            :to="{ name: 'atividade', params: { areaId: atividade.areaLiderId, activityId: atividade.id } }"
            class="flex items-center justify-between gap-3 py-3 transition hover:bg-paper-dim"
          >
            <div class="flex min-w-0 items-center gap-3">
              <AreaAvatar v-if="area" :area="area" size="sm" />
              <p class="truncate text-sm font-semibold text-ink">{{ atividade.titulo }}</p>
            </div>
            <span
              class="shrink-0 rounded-chip px-2.5 py-1 text-xs font-semibold"
              :class="
                dias > parametrosStore.parametro.slaDiasUteis
                  ? 'bg-status-critical-bg text-status-critical'
                  : 'bg-status-warning-bg text-status-warning'
              "
            >
              {{ dias }} {{ dias === 1 ? 'dia útil' : 'dias úteis' }}
            </span>
          </router-link>
          <p v-if="fila.length === 0" class="py-8 text-center text-sm text-ink-soft">
            Nenhuma atividade aguardando validação.
          </p>
        </div>
      </section>
    </div>
  </div>
</template>
