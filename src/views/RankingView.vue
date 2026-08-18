<script setup lang="ts">
import { useAreasStore } from '@/stores/areas'
import RankingTable from '@/components/painel/RankingTable.vue'

const areasStore = useAreasStore()
</script>

<template>
  <div>
    <header class="border-b border-line bg-card">
      <div class="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <nav class="mb-4 flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-ink-soft">
          <router-link to="/" class="hover:text-ink">Painel</router-link>
          <span>/</span>
          <span class="text-ink">Ranking</span>
        </nav>

        <h1 class="font-display text-2xl font-extrabold text-ink sm:text-3xl">Ranking completo</h1>
        <p class="mt-1 text-sm text-ink-soft">
          As 21 áreas ordenadas pelo índice de cumprimento ponderado por peso.
        </p>
      </div>
    </header>

    <div class="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <RankingTable :entradas="areasStore.ranking" :mostrar-cabecalho="false" />
    </div>
  </div>
</template>
