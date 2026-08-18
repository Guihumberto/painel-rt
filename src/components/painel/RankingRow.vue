<script setup lang="ts">
import { computed } from 'vue'
import type { RankingEntry } from '@/stores/areas'
import { useAreaColor } from '@/composables/useAreaColor'
import ProgressBar from '@/components/shared/ProgressBar.vue'
import SeloChip from '@/components/shared/SeloChip.vue'

const props = defineProps<{ entrada: RankingEntry }>()

const percentual = computed(() => Math.round(props.entrada.indice * 100))
const cor = computed(() => useAreaColor(props.entrada.area.colorIndex))
</script>

<template>
  <router-link
    :to="{ name: 'area', params: { areaId: entrada.area.id } }"
    class="grid grid-cols-[2rem_4.5rem_1fr_auto] items-center gap-3 rounded-sm px-3 py-3 transition hover:bg-paper-dim sm:grid-cols-[2rem_5.5rem_1fr_8rem_auto] sm:gap-4"
  >
    <span class="font-display text-lg font-bold text-ink-soft tabular-nums">{{ entrada.posicao }}</span>

    <span class="flex min-w-0 items-center gap-2">
      <span class="h-3.5 w-1 shrink-0 rounded-sm" :style="{ backgroundColor: cor.fg }" />
      <span class="truncate font-mono text-xs font-bold uppercase tracking-wide text-ink-soft">
        {{ entrada.area.sigla }}
      </span>
    </span>

    <div class="min-w-0">
      <p class="truncate text-sm font-semibold text-ink">{{ entrada.area.nome }}</p>
      <div class="mt-1 flex flex-wrap items-center gap-1.5">
        <SeloChip v-for="selo in entrada.selos.slice(0, 2)" :key="selo.id" :selo="selo" />
      </div>
    </div>

    <div class="hidden min-w-[7rem] items-center gap-3 sm:flex">
      <ProgressBar :value="entrada.indice" class="flex-1" />
    </div>

    <div class="flex flex-col items-end gap-1">
      <span class="font-mono text-sm font-semibold text-ink">{{ percentual }}%</span>
      <span
        v-if="entrada.atrasadas > 0"
        class="whitespace-nowrap rounded-chip bg-status-critical-bg px-2 py-0.5 text-[11px] font-semibold text-status-critical"
      >
        {{ entrada.atrasadas }} atrasada{{ entrada.atrasadas > 1 ? 's' : '' }}
      </span>
      <span
        v-else
        class="whitespace-nowrap rounded-chip bg-status-good-bg px-2 py-0.5 text-[11px] font-semibold text-status-good"
      >
        Em dia
      </span>
    </div>
  </router-link>
</template>
