<script setup lang="ts">
import { computed } from 'vue'
import type { Area } from '@/types/area'
import { useAreaColor } from '@/composables/useAreaColor'

const props = withDefaults(defineProps<{ area: Area; size?: 'sm' | 'md' | 'lg' }>(), {
  size: 'md',
})

const cor = computed(() => useAreaColor(props.area.colorIndex))

const SIZE_CLASSES: Record<string, string> = {
  sm: 'px-1.5 py-0.5 text-[10px]',
  md: 'px-2 py-1 text-xs',
  lg: 'px-3 py-1.5 text-sm',
}
</script>

<template>
  <span
    class="inline-flex shrink-0 items-center justify-center rounded-chip font-display font-bold tracking-wide text-white"
    :class="SIZE_CLASSES[size]"
    :style="{ backgroundColor: cor.bg }"
  >
    {{ area.sigla }}
  </span>
</template>
