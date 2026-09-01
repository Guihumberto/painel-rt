<script setup lang="ts">
import { computed } from 'vue'
import type { Evento } from '@/types/event'

const props = defineProps<{ eventos: Evento[]; atualId: string; proximaId?: string }>()

const ordenados = computed(() => [...props.eventos].sort((a, b) => (a.data > b.data ? -1 : 1)))

function dataCurta(dataIso: string): string {
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
    .format(new Date(`${dataIso}T12:00:00`))
    .replace('.', '')
}

function rotulo(evento: Evento): string {
  if (evento.id === props.proximaId) return 'Próxima'
  if (evento.status === 'suspenso') return 'Suspensa'
  return evento.status === 'realizado' ? 'Realizada' : 'Agendada'
}

/** Estilo do marcador na régua: anel latão vazado = você está aqui; latão cheio = próxima; vermelho = suspensa; neutro = já realizada. */
function pontoClasse(evento: Evento): string {
  if (evento.id === props.atualId) return 'border-brass bg-card'
  if (evento.id === props.proximaId) return 'border-brass bg-brass'
  if (evento.status === 'suspenso') return 'border-status-critical bg-status-critical-bg'
  return 'border-line bg-paper-dim'
}
</script>

<template>
  <div class="panel p-5">
    <p class="font-mono text-[11px] uppercase tracking-widest text-ink-soft">Reuniões do CTRT</p>

    <!-- régua da série: isso é mesmo uma sequência cronológica, então o trilho é informação, não enfeite -->
    <div class="relative mt-4">
      <span class="absolute bottom-2 left-[5px] top-2 w-px bg-line" aria-hidden="true" />

      <ul class="flex flex-col gap-1">
        <li v-for="evento in ordenados" :key="evento.id" class="relative pl-6">
          <span
            class="absolute left-0 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border-2"
            :class="pontoClasse(evento)"
            aria-hidden="true"
          />

          <div
            v-if="evento.id === atualId"
            class="flex items-center justify-between gap-3 rounded-sm border border-brass/50 bg-paper-dim px-3 py-2.5"
          >
            <div class="min-w-0">
              <p class="truncate text-sm font-semibold text-ink">{{ evento.titulo }}</p>
              <p class="font-mono text-[11px] text-ink-soft">{{ dataCurta(evento.data) }} · você está aqui</p>
            </div>
          </div>

          <router-link
            v-else
            :to="{ name: 'evento-detalhe', params: { eventoId: evento.id } }"
            class="flex items-center justify-between gap-3 rounded-sm px-3 py-2.5 transition-colors duration-150 hover:bg-paper-dim"
          >
            <div class="min-w-0">
              <p class="truncate text-sm font-medium text-ink">{{ evento.titulo }}</p>
              <p class="font-mono text-[11px] text-ink-soft">{{ dataCurta(evento.data) }}</p>
            </div>
            <span
              class="shrink-0 rounded-chip px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
              :class="{
                'bg-brass/15 text-brass-ink': evento.id === proximaId,
                'bg-status-critical-bg text-status-critical': evento.id !== proximaId && evento.status === 'suspenso',
                'bg-paper-dim text-ink-soft': evento.id !== proximaId && evento.status !== 'suspenso',
              }"
            >
              {{ rotulo(evento) }}
            </span>
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>
