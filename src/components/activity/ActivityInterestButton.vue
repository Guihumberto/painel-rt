<script setup lang="ts">
import { computed } from 'vue'
import { useActivitiesStore } from '@/stores/activities'
import { useInterestStore } from '@/stores/interest'
import { useParametrosStore } from '@/stores/parametros'

const props = defineProps<{ atividadeId: string }>()

const activitiesStore = useActivitiesStore()
const interestStore = useInterestStore()
const parametrosStore = useParametrosStore()

const atividade = computed(() => activitiesStore.getById(props.atividadeId))
const jaClicou = computed(() => interestStore.jaClicou(props.atividadeId))
const mostrarContador = computed(
  () => (atividade.value?.interessados ?? 0) >= parametrosStore.parametro.interesseContadorMinimo,
)

function clicar(): void {
  interestStore.registrarInteresse(props.atividadeId)
}
</script>

<template>
  <button
    type="button"
    :disabled="jaClicou"
    class="inline-flex items-center gap-2 rounded-chip border px-3.5 py-1.5 text-xs font-semibold transition"
    :class="
      jaClicou
        ? 'cursor-default border-brass/50 bg-brass/10 text-brass-ink'
        : 'border-line text-ink hover:border-brass hover:bg-brass/10 hover:text-brass-ink'
    "
    :title="jaClicou ? 'Você já demonstrou interesse nesta atividade' : 'Um clique por pessoa'"
    @click="clicar"
  >
    <span aria-hidden="true">{{ jaClicou ? '★' : '☆' }}</span>
    Quero saber mais
    <span v-if="mostrarContador" class="font-mono text-[11px] text-ink-soft">
      · {{ atividade?.interessados }}
    </span>
  </button>
</template>
