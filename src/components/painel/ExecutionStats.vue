<script setup lang="ts">
import { computed } from 'vue'
import type { VisaoExecucao } from '@/composables/useExecutionOverview'
import ExecutionStatTile from './ExecutionStatTile.vue'

const props = defineProps<{ visao: VisaoExecucao }>()

const mesAtual = new Intl.DateTimeFormat('pt-BR', { month: 'long' }).format(new Date())

const tiles = computed(() => [
  { label: 'Total do plano', value: props.visao.total, tone: 'neutral' as const },
  { label: 'Concluídas', value: props.visao.concluidas, tone: 'good' as const },
  { label: 'Em andamento', value: props.visao.emAndamento, tone: 'neutral' as const },
  { label: 'Atrasadas', value: props.visao.atrasadas, tone: 'critical' as const },
  { label: 'Faltam concluir', value: props.visao.faltam, tone: 'neutral' as const },
  { label: `Vencem em ${mesAtual}`, value: props.visao.venceEsteMes, tone: 'warning' as const },
])
</script>

<template>
  <section
    class="panel animate-rise grid grid-cols-2 divide-y divide-line sm:grid-cols-3 sm:divide-y-0 sm:divide-x lg:grid-cols-6"
    style="animation-delay: 80ms"
  >
    <ExecutionStatTile
      v-for="tile in tiles"
      :key="tile.label"
      :label="tile.label"
      :value="tile.value"
      :tone="tile.tone"
    />
  </section>
</template>
