<script setup lang="ts">
import { toRef } from 'vue'
import type { Atividade } from '@/types/activity'
import { useStatusAtividade } from '@/composables/useStatusAtividade'

const props = defineProps<{ atividade: Atividade }>()
const status = useStatusAtividade(toRef(props, 'atividade'))

const DOT_CLASSES: Record<string, string> = {
  good: 'bg-status-good',
  warning: 'bg-status-warning',
  critical: 'bg-status-critical',
}

const BADGE_CLASSES: Record<string, string> = {
  good: 'bg-status-good-bg text-status-good',
  warning: 'bg-status-warning-bg text-status-warning',
  critical: 'bg-status-critical-bg text-status-critical',
}
</script>

<template>
  <span
    class="inline-flex items-center gap-1.5 rounded-chip px-2.5 py-1 text-xs font-semibold"
    :class="BADGE_CLASSES[status.cor]"
  >
    <span class="h-1.5 w-1.5 shrink-0 rounded-full" :class="DOT_CLASSES[status.cor]" />
    {{ status.label }}
  </span>
</template>
