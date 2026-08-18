<script setup lang="ts">
import { computed } from 'vue'
import type { Evento } from '@/types/event'
import type { Atividade } from '@/types/activity'
import { useAreasStore } from '@/stores/areas'
import { diasRestantesEvento, estadoTemporalEvento } from '@/composables/useEventoData'

const props = defineProps<{ evento: Evento; pauta: Atividade[] }>()

const areasStore = useAreasStore()

const dataEvento = computed(() => new Date(`${props.evento.data}T12:00:00`))
const diasRestantes = computed(() => diasRestantesEvento(props.evento.data))
const estado = computed(() => estadoTemporalEvento(diasRestantes.value))

const dia = computed(() => new Intl.DateTimeFormat('pt-BR', { day: '2-digit' }).format(dataEvento.value))
const mes = computed(() => new Intl.DateTimeFormat('pt-BR', { month: 'short' }).format(dataEvento.value).replace('.', ''))
const ano = computed(() => dataEvento.value.getFullYear())

const rotuloContagem = computed(() => {
  if (diasRestantes.value === 0) return 'hoje'
  if (diasRestantes.value === 1) return 'em 1 dia'
  return `em ${diasRestantes.value} dias`
})

function siglaDe(atividade: Atividade): string {
  return areasStore.getById(atividade.areaLiderId)?.sigla ?? atividade.areaLiderId.toUpperCase()
}
</script>

<template>
  <div class="border border-line bg-card">
    <router-link :to="{ name: 'evento-detalhe', params: { eventoId: evento.id } }" class="block transition hover:bg-paper-dim">
      <div class="flex gap-4 p-4">
        <!-- bloco de data: âncora visual do card, mesmo par ink+latão do mastro e do placar -->
        <div class="flex shrink-0 flex-col items-center justify-center gap-0.5 rounded-sm bg-brand px-3.5 py-2.5">
          <span class="font-display text-4xl font-black leading-none tabular-nums text-brass sm:text-5xl">
            {{ dia }}
          </span>
          <span class="font-mono text-[10px] font-semibold uppercase tracking-[0.15em] text-on-brand/70">
            {{ mes }}
          </span>
          <span class="font-mono text-[9px] text-on-brand/40">{{ ano }}</span>
        </div>

        <div class="min-w-0 flex-1">
          <span class="inline-flex items-center gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-brass-ink">
            <span v-if="estado === 'hoje'" class="h-1.5 w-1.5 animate-pulse rounded-full bg-status-good" aria-hidden="true" />
            Próximo evento · {{ rotuloContagem }}
          </span>
          <h2 class="mt-1 font-display text-base font-bold leading-snug text-ink">{{ evento.titulo }}</h2>
          <p class="mt-0.5 text-xs text-ink-soft">{{ evento.local }}</p>
        </div>
      </div>
    </router-link>

    <div class="border-t border-line px-4 py-3">
      <p class="text-sm text-ink-soft">{{ evento.descricao }}</p>

      <div v-if="evento.assuntos && evento.assuntos.length > 0" class="mt-3 border-t border-line pt-3">
        <p class="font-mono text-[10px] uppercase tracking-widest text-ink-soft">Pauta</p>
        <ul class="mt-1.5 flex flex-col gap-1">
          <li v-for="assunto in evento.assuntos" :key="assunto.ordem" class="truncate text-xs text-ink">
            <span class="font-semibold text-ink-soft">{{ assunto.ordem }}.</span>
            {{ assunto.titulo }}
          </li>
        </ul>
      </div>

      <div v-else-if="pauta.length > 0" class="mt-3 border-t border-line pt-3">
        <p class="font-mono text-[10px] uppercase tracking-widest text-ink-soft">Pauta provisória</p>
        <ul class="mt-1.5 flex flex-col gap-1">
          <li v-for="atividade in pauta" :key="atividade.id" class="truncate text-xs text-ink">
            <span class="font-semibold text-ink-soft">{{ siglaDe(atividade) }}</span>
            — {{ atividade.titulo }}
          </li>
        </ul>
      </div>

      <div class="mt-3 flex flex-wrap items-center gap-4">
        <router-link
          :to="{ name: 'evento-detalhe', params: { eventoId: evento.id } }"
          class="inline-flex items-center gap-1.5 text-sm font-semibold text-ink hover:text-brass-ink"
        >
          Ver programação completa
          <span aria-hidden="true">→</span>
        </router-link>
        <router-link
          :to="{ name: 'eventos' }"
          class="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-soft hover:text-brass-ink"
        >
          Histórico de eventos
        </router-link>
      </div>
    </div>
  </div>
</template>
