<script setup lang="ts">
import { computed } from 'vue'
import type { VisaoExecucao } from '@/composables/useExecutionOverview'

const props = defineProps<{ visao: VisaoExecucao }>()

const LARGURA = 600
const ALTURA = 160
const MARGEM_BAIXO = 24
const MARGEM_LATERAL = 8

const maiorValor = computed(() => Math.max(...props.visao.porMes.map((m) => m.valor), 1))

const barras = computed(() => {
  const n = props.visao.porMes.length
  const larguraUtil = LARGURA - MARGEM_LATERAL * 2
  const passo = larguraUtil / n
  const larguraBarra = Math.min(passo * 0.5, 24)
  const alturaMax = ALTURA - MARGEM_BAIXO - 16

  return props.visao.porMes.map((item, i) => {
    const centroX = MARGEM_LATERAL + passo * i + passo / 2
    const alturaBarra = (item.valor / maiorValor.value) * alturaMax
    return {
      ...item,
      x: centroX - larguraBarra / 2,
      largura: larguraBarra,
      y: ALTURA - MARGEM_BAIXO - alturaBarra,
      altura: Math.max(alturaBarra, item.valor > 0 ? 3 : 0),
      centroX,
    }
  })
})
</script>

<template>
  <section class="panel animate-rise p-6" style="animation-delay: 160ms">
    <div class="flex items-baseline justify-between">
      <div>
        <h2 class="font-display text-lg font-bold text-ink">Prazos ao longo do ano</h2>
        <p class="mt-1 text-sm text-ink-soft">Atividades com vencimento em cada mês de {{ new Date().getFullYear() }}.</p>
      </div>
    </div>

    <svg
      :viewBox="`0 0 ${LARGURA} ${ALTURA}`"
      class="mt-4 w-full"
      role="img"
      aria-label="Quantidade de atividades com prazo em cada mês do ano corrente"
    >
      <line
        :x1="MARGEM_LATERAL"
        :x2="LARGURA - MARGEM_LATERAL"
        :y1="ALTURA - MARGEM_BAIXO"
        :y2="ALTURA - MARGEM_BAIXO"
        class="stroke-line"
        stroke-width="1"
      />

      <g v-for="barra in barras" :key="barra.mes">
        <rect
          :x="barra.x"
          :y="barra.y"
          :width="barra.largura"
          :height="barra.altura"
          rx="4"
          class="transition-[height,y,fill] duration-500 ease-out motion-reduce:transition-none"
          :fill="barra.mesAtual ? 'var(--color-ink)' : 'var(--color-brass)'"
        >
          <title>{{ barra.mes }}: {{ barra.valor }} atividade{{ barra.valor === 1 ? '' : 's' }}</title>
        </rect>
        <text
          v-if="barra.valor > 0"
          :x="barra.centroX"
          :y="barra.y - 6"
          text-anchor="middle"
          class="fill-ink-soft font-mono text-[10px] tabular-nums transition-[y] duration-500 ease-out motion-reduce:transition-none"
        >
          {{ barra.valor }}
        </text>
        <text
          :x="barra.centroX"
          :y="ALTURA - 6"
          text-anchor="middle"
          class="font-mono text-[10px] uppercase tracking-wide"
          :class="barra.mesAtual ? 'fill-ink font-bold' : 'fill-ink-soft'"
        >
          {{ barra.mes }}
        </text>
      </g>
    </svg>
  </section>
</template>
