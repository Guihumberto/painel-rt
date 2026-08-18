<script setup lang="ts">
import type { Andamento, Comprovacao } from '@/types/activity'
import { TIPO_ATUALIZACAO_LABEL } from '@/types/activity'

const props = defineProps<{ andamentos: Andamento[]; comprovacoes: Comprovacao[] }>()

const COR_TIPO: Record<Andamento['tipo'], string> = {
  inicio: 'bg-brass/15 text-brass-ink',
  atualizacao: 'bg-status-good-bg text-status-good',
  paralisacao: 'bg-status-warning-bg text-status-warning',
  conclusao: 'bg-status-good-bg text-status-good',
}

function formatar(data: string): string {
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).format(
    new Date(`${data}T12:00:00`),
  )
}

function artefatoDe(andamentoId: string): Comprovacao | undefined {
  return props.comprovacoes.find((c) => c.andamentoId === andamentoId)
}
</script>

<template>
  <div class="panel p-6">
    <h2 class="font-display text-lg font-bold text-ink">Andamentos</h2>

    <ol v-if="andamentos.length > 0" class="mt-4 flex flex-col gap-4">
      <li v-for="andamento in andamentos" :key="andamento.id" class="relative border-l-2 border-line pl-4">
        <span class="absolute -left-[5px] top-1.5 h-2 w-2 rounded-full bg-brass" />
        <div class="flex flex-wrap items-center gap-2">
          <p class="font-mono text-[11px] uppercase tracking-wide text-ink-soft">
            {{ formatar(andamento.data) }}
          </p>
          <span
            class="rounded-chip px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
            :class="COR_TIPO[andamento.tipo]"
          >
            {{ TIPO_ATUALIZACAO_LABEL[andamento.tipo] }}
          </span>
        </div>
        <p class="mt-0.5 text-sm text-ink">{{ andamento.texto }}</p>
        <p v-if="artefatoDe(andamento.id)" class="mt-1 text-xs text-ink-soft">
          <span class="font-mono text-[10px] uppercase tracking-wide">Artefato:</span>
          <a
            v-if="artefatoDe(andamento.id)!.tipo === 'link' && artefatoDe(andamento.id)!.url"
            :href="artefatoDe(andamento.id)!.url"
            target="_blank"
            rel="noopener noreferrer"
            class="text-brass hover:underline"
          >
            {{ artefatoDe(andamento.id)!.nome }}
          </a>
          <span v-else>{{ artefatoDe(andamento.id)!.nome }}</span>
        </p>
      </li>
    </ol>
    <p v-else class="mt-4 text-sm text-ink-soft">Ainda não há registros de andamento.</p>
  </div>
</template>
