<script setup lang="ts">
import { computed } from 'vue'
import type { Area } from '@/types/area'
import { useAreaColor } from '@/composables/useAreaColor'

const props = defineProps<{ area: Area; indiceAtual: number }>()

const MESES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul']
const LARGURA = 480
const ALTURA = 120
const MARGEM = 12

/** Série sintética de evolução mensal — placeholder até existir histórico real. */
const serie = computed(() => {
  const alvo = props.indiceAtual
  return MESES.map((_, i) => {
    const progresso = (i + 1) / MESES.length
    const ondulacao = Math.sin((i + props.area.colorIndex) * 1.7) * 0.06
    const valor = Math.max(0, Math.min(1, alvo * (0.35 + 0.65 * progresso) + ondulacao))
    return valor
  })
})

const cor = computed(() => useAreaColor(props.area.colorIndex))

const pontos = computed(() =>
  serie.value.map((valor, i) => {
    const x = MARGEM + (i / (serie.value.length - 1)) * (LARGURA - MARGEM * 2)
    const y = ALTURA - MARGEM - valor * (ALTURA - MARGEM * 2)
    return { x, y, valor, mes: MESES[i] }
  }),
)

const linha = computed(() => pontos.value.map((p) => `${p.x},${p.y}`).join(' '))
</script>

<template>
  <div class="panel p-6">
    <div class="flex items-baseline justify-between">
      <h2 class="font-display text-lg font-bold text-ink">Evolução do índice</h2>
      <span class="font-mono text-sm font-semibold tabular-nums text-ink-soft">
        {{ Math.round(indiceAtual * 100) }}% em jul
      </span>
    </div>

    <svg
      :viewBox="`0 0 ${LARGURA} ${ALTURA}`"
      class="mt-4 w-full"
      role="img"
      :aria-label="`Evolução do índice de cumprimento de ${area.nome} ao longo do ano`"
    >
      <line
        :x1="MARGEM"
        :x2="LARGURA - MARGEM"
        :y1="ALTURA - MARGEM"
        :y2="ALTURA - MARGEM"
        class="stroke-line"
        stroke-width="1"
      />
      <polyline
        :points="linha"
        fill="none"
        :stroke="cor.fg"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <g v-for="ponto in pontos" :key="ponto.mes">
        <circle :cx="ponto.x" :cy="ponto.y" r="3" :fill="cor.fg">
          <title>{{ ponto.mes }}: {{ Math.round(ponto.valor * 100) }}%</title>
        </circle>
      </g>
    </svg>

    <div class="mt-1 flex justify-between font-mono text-[10px] uppercase tracking-wide text-ink-soft">
      <span v-for="mes in MESES" :key="mes">{{ mes }}</span>
    </div>
  </div>
</template>
