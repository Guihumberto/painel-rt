<script setup lang="ts">
import type { Publicacao } from '@/types/publication'
import type { Selo } from '@/types/badge'
import { SELO_INFO } from '@/constants/selos'

defineProps<{ publicacoes: Publicacao[]; selos: Selo[] }>()

function formatar(data: string): string {
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' }).format(
    new Date(`${data}T12:00:00`),
  )
}
</script>

<template>
  <div class="panel p-6">
    <h2 class="font-display text-lg font-bold text-ink">Histórico de publicações e selos</h2>

    <ol class="mt-4 flex flex-col gap-3">
      <li
        v-for="selo in selos"
        :key="selo.id"
        class="flex items-center gap-3 border-l-2 border-brass py-1 pl-3 text-sm"
      >
        <span class="font-mono text-xs text-ink-soft">{{ formatar(selo.conquistadoEm) }}</span>
        <span class="text-brass" aria-hidden="true">{{ SELO_INFO[selo.tipo].icone }}</span>
        <span class="font-semibold text-ink">Selo "{{ selo.titulo }}"</span>
      </li>
      <li
        v-for="publicacao in publicacoes"
        :key="publicacao.id"
        class="flex items-start gap-3 border-l-2 border-status-good py-1 pl-3 text-sm"
      >
        <span class="shrink-0 font-mono text-xs text-ink-soft">{{
          formatar(publicacao.publicadoEm)
        }}</span>
        <router-link
          :to="{
            name: 'atividade',
            params: { areaId: publicacao.areaIds[0], activityId: publicacao.atividadeId },
          }"
          class="text-ink hover:underline"
        >
          {{ publicacao.tituloNoticia }}
        </router-link>
      </li>
      <li v-if="selos.length === 0 && publicacoes.length === 0" class="text-sm text-ink-soft">
        Ainda sem publicações ou selos registrados.
      </li>
    </ol>
  </div>
</template>
