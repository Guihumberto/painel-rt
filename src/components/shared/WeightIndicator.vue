<script setup lang="ts">
import type { Peso } from '@/types/activity'

defineProps<{ peso: Peso }>()
</script>

<template>
  <span class="inline-flex items-center gap-2" :title="`Peso ${peso} de 3`">
    <span class="flex items-center gap-0.5">
      <span
        v-for="n in 3"
        :key="n"
        class="h-3 w-1.5 rounded-sm"
        :class="n <= peso ? 'bg-brass' : 'bg-line'"
      />
    </span>
    <span class="font-mono text-[11px] uppercase tracking-wide text-ink-soft">Peso {{ peso }}</span>
  </span>
</template>
