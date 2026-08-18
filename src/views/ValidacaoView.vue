<script setup lang="ts">
import { computed } from 'vue'
import { useActivitiesStore } from '@/stores/activities'
import { useParametrosStore } from '@/stores/parametros'
import { filaDeValidacao } from '@/composables/useFilaValidacao'
import AreaAvatar from '@/components/shared/AreaAvatar.vue'
import WeightIndicator from '@/components/shared/WeightIndicator.vue'

const activitiesStore = useActivitiesStore()
const parametrosStore = useParametrosStore()

const fila = computed(() => filaDeValidacao(activitiesStore.atividades))
</script>

<template>
  <div>
    <header class="border-b border-line bg-card">
      <div class="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <nav class="mb-4 flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-ink-soft">
          <router-link to="/" class="hover:text-ink">Painel</router-link>
          <span>/</span>
          <span class="text-ink">Validação</span>
        </nav>

        <h1 class="font-display text-2xl font-extrabold text-ink sm:text-3xl">Fila de validação</h1>
        <p class="mt-1 text-sm text-ink-soft">
          {{ fila.length }} atividade{{ fila.length === 1 ? '' : 's' }} aguardando decisão, de todas as áreas.
        </p>
      </div>
    </header>

    <div class="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div class="panel flex flex-col divide-y divide-line">
        <router-link
          v-for="{ atividade, area, dias } in fila"
          :key="atividade.id"
          :to="{ name: 'atividade', params: { areaId: atividade.areaLiderId, activityId: atividade.id } }"
          class="flex flex-col gap-2 px-4 py-3 transition hover:bg-paper-dim sm:flex-row sm:items-center sm:justify-between"
        >
          <div class="flex min-w-0 items-center gap-3">
            <AreaAvatar v-if="area" :area="area" size="sm" />
            <div class="min-w-0">
              <p class="truncate text-sm font-semibold text-ink">{{ atividade.titulo }}</p>
              <WeightIndicator :peso="atividade.peso" class="mt-1" />
            </div>
          </div>

          <span
            class="shrink-0 self-start rounded-chip px-2.5 py-1 text-xs font-semibold sm:self-center"
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
    </div>
  </div>
</template>
