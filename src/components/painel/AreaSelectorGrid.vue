<script setup lang="ts">
import { computed } from 'vue'
import type { Area } from '@/types/area'
import { useAreaColor } from '@/composables/useAreaColor'

const props = defineProps<{
  areas: Area[]
  contagens: Record<string, number>
  totalGeral: number
}>()

const selecionada = defineModel<string>('selecionada', { default: '' })

const areasComCor = computed(() =>
  props.areas.map((area) => ({ area, cor: useAreaColor(area.colorIndex).fg })),
)

function selecionar(id: string): void {
  selecionada.value = selecionada.value === id ? '' : id
}
</script>

<template>
  <div class="flex flex-wrap gap-1.5">
    <button
      type="button"
      class="flex items-center gap-2 rounded-sm border px-3 py-1.5 text-xs font-semibold transition duration-150 active:scale-95 motion-reduce:active:scale-100"
      :class="
        selecionada === ''
          ? 'border-brand bg-brand text-on-brand'
          : 'border-line bg-card text-ink hover:border-brass'
      "
      @click="selecionada = ''"
    >
      Todas as áreas
      <span class="font-mono tabular-nums" :class="selecionada === '' ? 'text-on-brand/70' : 'text-ink-soft'">
        {{ totalGeral }}
      </span>
    </button>

    <button
      v-for="{ area, cor } in areasComCor"
      :key="area.id"
      type="button"
      class="flex items-center gap-1.5 rounded-sm border px-2.5 py-1.5 text-xs font-semibold transition duration-150 active:scale-95 motion-reduce:active:scale-100"
      :class="
        selecionada === area.id
          ? 'border-brand bg-brand text-on-brand'
          : 'border-line bg-card text-ink hover:border-brass'
      "
      :title="area.nome"
      @click="selecionar(area.id)"
    >
      <span class="h-2 w-2 shrink-0 rounded-full" :style="{ backgroundColor: cor }" />
      {{ area.sigla }}
      <span class="font-mono tabular-nums" :class="selecionada === area.id ? 'text-on-brand/70' : 'text-ink-soft'">
        {{ contagens[area.id] ?? 0 }}
      </span>
    </button>
  </div>
</template>
