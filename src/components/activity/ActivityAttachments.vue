<script setup lang="ts">
import type { Comprovacao } from '@/types/activity'

defineProps<{ comprovacoes: Comprovacao[] }>()

const ROTULO_TIPO: Record<Comprovacao['tipo'], string> = {
  pdf: 'PDF',
  imagem: 'IMG',
  link: 'LINK',
}
</script>

<template>
  <div class="panel p-6">
    <h2 class="font-display text-lg font-bold text-ink">Comprovações</h2>

    <ul v-if="comprovacoes.length > 0" class="mt-4 flex flex-col gap-2">
      <li
        v-for="comprovacao in comprovacoes"
        :key="comprovacao.id"
        class="flex items-center justify-between gap-3 rounded-sm border border-line px-3 py-2 text-sm"
      >
        <span class="flex items-center gap-2 truncate text-ink">
          <span
            class="shrink-0 rounded border border-line px-1.5 py-0.5 font-mono text-[10px] text-ink-soft"
            >{{ ROTULO_TIPO[comprovacao.tipo] }}</span
          >
          <a
            v-if="comprovacao.tipo === 'link' && comprovacao.url"
            :href="comprovacao.url"
            target="_blank"
            rel="noopener noreferrer"
            class="truncate text-brass hover:underline"
          >
            {{ comprovacao.nome }}
          </a>
          <span v-else class="truncate">{{ comprovacao.nome }}</span>
        </span>
        <span
          class="shrink-0 rounded-chip px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
          :class="comprovacao.publica ? 'bg-status-good-bg text-status-good' : 'bg-paper-dim text-ink-soft'"
        >
          {{ comprovacao.publica ? 'Pública' : 'Em análise' }}
        </span>
      </li>
    </ul>
    <p v-else class="mt-4 text-sm text-ink-soft">Nenhuma comprovação anexada ainda.</p>
  </div>
</template>
