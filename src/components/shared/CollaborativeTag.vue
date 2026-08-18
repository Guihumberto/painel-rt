<script setup lang="ts">
import type { Area } from '@/types/area'

defineProps<{ parceiras: Area[] }>()
</script>

<template>
  <span
    v-if="parceiras.length > 0"
    class="inline-flex items-center gap-1.5 rounded-chip bg-brand/5 px-2.5 py-1 text-xs font-medium text-ink-soft"
    title="Atividade colaborativa"
  >
    <span aria-hidden="true">⇄</span>
    com {{ parceiras.map((p) => p.sigla).join(', ') }}
  </span>
</template>
