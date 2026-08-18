<script setup lang="ts">
import ScoreboardTile from './ScoreboardTile.vue'

interface Item {
  label: string
  value: number
  suffix?: string
  tone?: 'neutral' | 'good' | 'warning' | 'critical'
}

defineProps<{ items: Item[] }>()
</script>

<template>
  <div class="animate-rise overflow-hidden rounded-card border border-brand bg-brand">
    <div class="grid grid-cols-2 divide-y divide-on-brand/10 sm:grid-cols-4 sm:divide-y-0 sm:divide-x">
      <ScoreboardTile v-for="item in items" :key="item.label" v-bind="item" />
    </div>
  </div>
</template>
