<script setup lang="ts">
import { toRef } from 'vue'
import { useSplitFlap } from '@/composables/useSplitFlap'

const props = withDefaults(
  defineProps<{
    label: string
    value: number
    suffix?: string
    tone?: 'neutral' | 'good' | 'warning' | 'critical'
  }>(),
  { tone: 'neutral' },
)

const displayed = useSplitFlap(toRef(props, 'value'))

const TONE_CLASSES: Record<string, string> = {
  neutral: 'text-on-brand',
  good: 'text-status-good',
  warning: 'text-status-warning',
  critical: 'text-status-critical',
}
</script>

<template>
  <div class="flex flex-col items-center gap-1.5 px-5 py-6 text-center sm:px-6">
    <span class="font-mono text-[10px] uppercase tracking-[0.18em] text-on-brand/50">{{ label }}</span>
    <span
      class="font-display text-3xl font-extrabold tabular-nums sm:text-4xl"
      :class="TONE_CLASSES[tone]"
    >
      {{ displayed }}{{ suffix }}
    </span>
  </div>
</template>
