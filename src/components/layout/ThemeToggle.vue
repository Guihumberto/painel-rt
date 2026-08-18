<script setup lang="ts">
import { useTemaStore } from '@/stores/tema'

const temaStore = useTemaStore()
</script>

<template>
  <button
    type="button"
    class="flex h-6 w-6 items-center justify-center rounded-sm text-sm transition hover:text-brass"
    :title="temaStore.tema === 'escuro' ? 'Ativar modo claro' : 'Ativar modo noturno'"
    :aria-label="temaStore.tema === 'escuro' ? 'Ativar modo claro' : 'Ativar modo noturno'"
    @click="temaStore.alternar()"
  >
    <span aria-hidden="true">{{ temaStore.tema === 'escuro' ? '☀' : '☾' }}</span>
  </button>
</template>
