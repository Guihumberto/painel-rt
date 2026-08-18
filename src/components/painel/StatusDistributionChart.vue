<script setup lang="ts">
import { computed } from 'vue'
import type { VisaoExecucao } from '@/composables/useExecutionOverview'

const props = defineProps<{ visao: VisaoExecucao }>()

const segmentos = computed(() =>
  props.visao.porStatus.map((item) => ({
    ...item,
    percentual: props.visao.total > 0 ? (item.valor / props.visao.total) * 100 : 0,
  })),
)
</script>

<template>
  <section class="panel animate-rise p-6" style="animation-delay: 120ms">
    <h2 class="font-display text-lg font-bold text-ink">Composição do plano</h2>
    <p class="mt-1 text-sm text-ink-soft">Como as {{ visao.total }} atividades se distribuem por status.</p>

    <div
      class="mt-5 flex h-6 w-full gap-[2px] overflow-hidden rounded-chip bg-paper-dim"
      role="img"
      :aria-label="`Composição do plano: ${segmentos.map((s) => `${s.label} ${s.valor}`).join(', ')}`"
    >
      <div
        v-for="segmento in segmentos"
        :key="segmento.estado"
        class="h-full transition-[width] duration-500 ease-out first:rounded-l-chip last:rounded-r-chip motion-reduce:transition-none"
        :style="{ width: `${segmento.percentual}%`, backgroundColor: segmento.cor }"
        :title="`${segmento.label}: ${segmento.valor} (${Math.round(segmento.percentual)}%)`"
      />
    </div>

    <ul class="mt-4 flex flex-wrap gap-x-5 gap-y-2">
      <li v-for="segmento in segmentos" :key="segmento.estado" class="flex items-center gap-2 text-xs">
        <span class="h-2.5 w-2.5 shrink-0 rounded-sm" :style="{ backgroundColor: segmento.cor }" />
        <span class="text-ink-soft">{{ segmento.label }}</span>
        <span class="font-mono font-semibold text-ink">{{ segmento.valor }}</span>
      </li>
    </ul>
  </section>
</template>
