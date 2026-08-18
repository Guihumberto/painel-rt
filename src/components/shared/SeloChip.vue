<script setup lang="ts">
import type { Selo } from '@/types/badge'
import { SELO_INFO } from '@/constants/selos'

const props = defineProps<{ selo: Selo }>()
</script>

<template>
  <span
    class="inline-flex items-center gap-1.5 rounded-chip border border-brass/40 bg-brass/10 px-2.5 py-1 text-xs font-semibold text-brass-ink"
    :title="selo.descricao"
  >
    <span class="text-brass" aria-hidden="true">{{ SELO_INFO[props.selo.tipo].icone }}</span>
    {{ selo.titulo }}
  </span>
</template>
