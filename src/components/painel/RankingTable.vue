<script setup lang="ts">
import type { RankingEntry } from '@/stores/areas'
import RankingRow from './RankingRow.vue'

withDefaults(defineProps<{ entradas: RankingEntry[]; mostrarCabecalho?: boolean }>(), {
  mostrarCabecalho: true,
})
</script>

<template>
  <section class="animate-rise panel p-6" style="animation-delay: 140ms">
    <div v-if="mostrarCabecalho" class="flex items-baseline justify-between">
      <h2 class="font-display text-lg font-bold text-ink">Ranking completo</h2>
      <span class="font-mono text-xs uppercase tracking-widest text-ink-soft">21 áreas</span>
    </div>

    <div class="flex flex-col divide-y divide-line" :class="mostrarCabecalho ? 'mt-4' : 'mt-0'">
      <RankingRow v-for="entrada in entradas" :key="entrada.area.id" :entrada="entrada" />
    </div>
  </section>
</template>
