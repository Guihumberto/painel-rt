<script setup lang="ts">
import { toRef } from 'vue'
import { useSplitFlap } from '@/composables/useSplitFlap'

const props = withDefaults(
  defineProps<{
    label: string
    value: number
    tone?: 'neutral' | 'good' | 'warning' | 'critical'
  }>(),
  { tone: 'neutral' },
)

const displayed = useSplitFlap(toRef(props, 'value'), 500)

const TONE_CLASSES: Record<string, string> = {
  neutral: 'text-ink',
  good: 'text-status-good',
  warning: 'text-status-warning',
  critical: 'text-status-critical',
}
</script>

<template>
  <div class="flex flex-col gap-1 p-4">
    <span class="font-mono text-[10px] uppercase tracking-widest text-ink-soft">{{ label }}</span>
    <span class="font-display text-2xl font-extrabold tabular-nums" :class="TONE_CLASSES[tone]">
      {{ displayed }}
    </span>
  </div>
</template>
