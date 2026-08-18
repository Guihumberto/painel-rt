<script setup lang="ts">
import type { BlocoDoc } from '@/types/documentacao'

defineProps<{ bloco: BlocoDoc }>()
</script>

<template>
  <p v-if="bloco.tipo === 'paragrafo'" class="text-sm leading-relaxed text-ink">
    {{ bloco.texto }}
  </p>

  <h3 v-else-if="bloco.tipo === 'subtitulo'" class="font-display text-base font-bold text-ink">
    {{ bloco.texto }}
  </h3>

  <ul v-else-if="bloco.tipo === 'lista'" class="flex flex-col gap-1.5">
    <li v-for="(item, i) in bloco.itens" :key="i" class="flex gap-2 text-sm leading-relaxed text-ink">
      <span class="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-brass" aria-hidden="true" />
      {{ item }}
    </li>
  </ul>

  <ol v-else-if="bloco.tipo === 'passos'" class="flex flex-col gap-2">
    <li v-for="(item, i) in bloco.itens" :key="i" class="flex gap-3 text-sm leading-relaxed text-ink">
      <span
        class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand font-mono text-[11px] font-bold text-on-brand"
      >
        {{ i + 1 }}
      </span>
      {{ item }}
    </li>
  </ol>

  <p v-else-if="bloco.tipo === 'destaque'" class="rounded-card border border-brass/40 bg-brass/10 p-4 text-sm leading-relaxed text-ink">
    {{ bloco.texto }}
  </p>
</template>
