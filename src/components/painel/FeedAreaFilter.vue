<script setup lang="ts">
import type { Area } from '@/types/area'

defineProps<{ areas: Area[] }>()
const selecionada = defineModel<string>('selecionada', { default: '' })
</script>

<template>
  <label class="flex min-w-0 flex-col gap-1.5 text-xs text-ink-soft sm:flex-row sm:items-center sm:gap-2">
    <span class="font-mono uppercase tracking-widest">Filtrar por área</span>
    <select
      v-model="selecionada"
      class="w-full min-w-0 rounded-md border border-line bg-card px-2.5 py-1.5 text-sm text-ink focus:border-brass focus:outline-none"
    >
      <option value="">Todas as áreas</option>
      <option v-for="area in areas" :key="area.id" :value="area.id">
        {{ area.sigla }} — {{ area.nome }}
      </option>
    </select>
  </label>
</template>
