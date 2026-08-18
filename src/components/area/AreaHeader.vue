<script setup lang="ts">
import { computed } from 'vue'
import type { RankingEntry } from '@/stores/areas'
import AreaAvatar from '@/components/shared/AreaAvatar.vue'
import ProgressBar from '@/components/shared/ProgressBar.vue'
import SeloChip from '@/components/shared/SeloChip.vue'

const props = defineProps<{ entrada: RankingEntry }>()

const percentual = computed(() => Math.round(props.entrada.indice * 100))
</script>

<template>
  <header class="border-b border-line bg-card">
    <div class="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <nav class="mb-4 flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-ink-soft">
        <router-link to="/" class="hover:text-ink">Painel</router-link>
        <span>/</span>
        <span class="text-ink">{{ entrada.area.sigla }}</span>
      </nav>

      <div class="flex flex-wrap items-start justify-between gap-6">
        <div class="flex items-start gap-4">
          <AreaAvatar :area="entrada.area" size="lg" />
          <div>
            <h1 class="font-display text-2xl font-extrabold text-ink sm:text-3xl">
              {{ entrada.area.nome }}
            </h1>
            <p class="mt-1 text-sm text-ink-soft">
              Responsável: {{ entrada.area.responsaveis.join(', ') }}
            </p>
            <div class="mt-3 flex flex-wrap gap-1.5">
              <SeloChip v-for="selo in entrada.selos" :key="selo.id" :selo="selo" />
            </div>
          </div>
        </div>

        <div class="min-w-[12rem] text-right">
          <p class="font-mono text-xs uppercase tracking-widest text-ink-soft">
            {{ entrada.posicao }}º no ranking geral
          </p>
          <p class="font-display text-4xl font-extrabold tabular-nums text-ink">{{ percentual }}%</p>
          <ProgressBar :value="entrada.indice" class="mt-2 w-48" />
        </div>
      </div>
    </div>
  </header>
</template>
