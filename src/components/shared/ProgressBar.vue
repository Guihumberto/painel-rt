<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{ value: number; color?: string; trackClass?: string }>(),
  { color: 'var(--color-brass)', trackClass: 'bg-line' },
)

const percentual = computed(() => Math.round(Math.min(Math.max(props.value, 0), 1) * 100))
</script>

<template>
  <div
    class="h-1.5 w-full overflow-hidden rounded-full"
    :class="trackClass"
    role="progressbar"
    :aria-valuenow="percentual"
    aria-valuemin="0"
    aria-valuemax="100"
  >
    <div
      class="h-full rounded-full transition-[width] duration-700 ease-out"
      :style="{ width: `${percentual}%`, backgroundColor: color }"
    />
  </div>
</template>
