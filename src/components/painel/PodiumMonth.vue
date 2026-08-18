<script setup lang="ts">
import { computed } from 'vue'
import type { RankingEntry } from '@/stores/areas'
import { useAreaColor } from '@/composables/useAreaColor'

const props = defineProps<{ entradas: RankingEntry[] }>()

/** Disposição visual do pódio: 2º-1º-3º. */
const ORDEM_VISUAL = [1, 0, 2] as const

/** Altura por posição visual (2º/1º/3º) — degraus de um pódio real. */
const ALTURA_CLASSE = ['h-52 sm:h-60', 'h-64 sm:h-72', 'h-44 sm:h-52']

const cartoes = computed(() =>
  ORDEM_VISUAL.map((i) => props.entradas[i])
    .filter((e): e is RankingEntry => Boolean(e))
    .map((entrada) => ({
      entrada,
      // 1º lugar sempre em latão (identidade de celebração do painel); 2º/3º
      // usam a cor de identidade da própria área, igual ao resto do app.
      bg: entrada.destaqueDoMes ? 'var(--color-brass)' : useAreaColor(entrada.area.colorIndex).fg,
    })),
)

const mesAtual = computed(() =>
  new Intl.DateTimeFormat('pt-BR', { month: 'long' }).format(new Date()),
)
</script>

<template>
  <section class="animate-rise panel p-6" style="animation-delay: 80ms">
    <header class="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h2 class="flex items-center gap-1.5 font-display text-lg font-bold text-ink">
          <span class="text-brass" aria-hidden="true">★</span>
          Pódio do mês
        </h2>
        <span class="mt-1.5 block h-1 w-10 rounded-chip bg-brass" />
        <p class="mt-2 text-sm text-ink-soft">
          As três áreas com maior índice de cumprimento em {{ mesAtual }}.
        </p>
      </div>
      <router-link
        :to="{ name: 'ranking' }"
        class="inline-flex shrink-0 items-center gap-1 rounded-chip bg-paper-dim px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-widest text-ink-soft transition hover:bg-line hover:text-ink"
      >
        Ver ranking completo
        <span aria-hidden="true">→</span>
      </router-link>
    </header>

    <div class="mt-6 grid grid-cols-3 items-end gap-2.5 sm:gap-4">
      <router-link
        v-for="({ entrada, bg }, i) in cartoes"
        :key="entrada.area.id"
        :to="{ name: 'area', params: { areaId: entrada.area.id } }"
        class="group relative flex flex-col justify-between overflow-hidden rounded-xl p-3 transition hover:brightness-105 sm:p-5"
        :class="ALTURA_CLASSE[i]"
        :style="{ backgroundColor: bg }"
      >
        <span
          class="pointer-events-none absolute -right-2 -top-5 select-none font-display text-8xl font-black text-white/15 sm:-top-6 sm:text-9xl"
          aria-hidden="true"
        >
          {{ entrada.posicao }}
        </span>

        <span
          v-if="entrada.destaqueDoMes"
          class="relative z-10 inline-flex w-fit items-center gap-1 rounded-chip bg-white/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white"
        >
          <span aria-hidden="true">★</span> Destaque
        </span>

        <p class="relative z-10 font-display text-4xl font-black text-white sm:text-5xl">
          {{ Math.round(entrada.indice * 100) }}%
        </p>

        <div class="relative z-10 text-center">
          <p class="text-xs font-bold uppercase tracking-wide text-white">{{ entrada.area.sigla }}</p>
          <p class="mt-0.5 text-[11px] leading-snug text-white/80">{{ entrada.area.nome }}</p>
        </div>
      </router-link>
    </div>
  </section>
</template>
