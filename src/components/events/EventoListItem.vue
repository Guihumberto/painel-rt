<script setup lang="ts">
import { computed } from 'vue'
import type { Evento } from '@/types/event'
import type { Atividade } from '@/types/activity'
import { useAreasStore } from '@/stores/areas'
import AreaAvatar from '@/components/shared/AreaAvatar.vue'

const props = defineProps<{ evento: Evento; atividades: Atividade[] }>()

const areasStore = useAreasStore()

const dataFormatada = computed(() =>
  new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }).format(
    new Date(`${props.evento.data}T12:00:00`),
  ),
)

function areaDe(atividade: Atividade) {
  return areasStore.getById(atividade.areaLiderId)
}
</script>

<template>
  <article class="panel p-5 sm:p-6">
    <header class="flex flex-wrap items-center justify-between gap-2">
      <div class="flex items-center gap-2">
        <span
          class="rounded-chip px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide"
          :class="
            evento.status === 'agendado'
              ? 'bg-brass/15 text-brass-ink'
              : 'bg-paper-dim text-ink-soft'
          "
        >
          {{ evento.status === 'agendado' ? 'Agendado' : 'Realizado' }}
        </span>
        <span class="font-mono text-xs uppercase tracking-widest text-ink-soft">{{ evento.tipo }}</span>
      </div>
      <span class="font-mono text-xs text-ink-soft">{{ dataFormatada }}</span>
    </header>

    <router-link :to="{ name: 'evento-detalhe', params: { eventoId: evento.id } }" class="group">
      <h3 class="mt-2 font-display text-lg font-bold text-ink group-hover:text-brass-ink">{{ evento.titulo }}</h3>
    </router-link>
    <p class="mt-1 text-sm text-ink-soft">{{ evento.local }}</p>
    <p class="mt-2 text-sm text-ink">{{ evento.descricao }}</p>

    <div v-if="evento.assuntos && evento.assuntos.length > 0" class="mt-4 border-t border-line pt-4">
      <p class="font-mono text-[11px] uppercase tracking-widest text-ink-soft">Pauta</p>
      <ul class="mt-2 flex flex-col gap-1.5">
        <li v-for="assunto in evento.assuntos" :key="assunto.ordem" class="text-sm text-ink">
          <span class="font-semibold text-ink-soft">{{ assunto.ordem }}.</span> {{ assunto.titulo }}
        </li>
      </ul>
    </div>

    <div v-else-if="atividades.length > 0" class="mt-4 border-t border-line pt-4">
      <p class="font-mono text-[11px] uppercase tracking-widest text-ink-soft">
        {{ evento.status === 'agendado' ? 'Pauta provisória' : 'Apresentações' }}
      </p>
      <ul class="mt-2 flex flex-col gap-2">
        <li v-for="atividade in atividades" :key="atividade.id">
          <router-link
            :to="{
              name: 'atividade',
              params: { areaId: atividade.areaLiderId, activityId: atividade.id },
            }"
            class="flex items-center gap-2.5 rounded-sm p-1.5 transition hover:bg-paper-dim"
          >
            <AreaAvatar v-if="areaDe(atividade)" :area="areaDe(atividade)!" size="sm" />
            <span class="truncate text-sm font-medium text-ink">{{ atividade.titulo }}</span>
          </router-link>
        </li>
      </ul>
    </div>

    <router-link
      :to="{ name: 'evento-detalhe', params: { eventoId: evento.id } }"
      class="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-ink hover:text-brass-ink"
    >
      Ver programação completa
      <span aria-hidden="true">→</span>
    </router-link>
  </article>
</template>
