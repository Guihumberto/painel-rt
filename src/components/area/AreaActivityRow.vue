<script setup lang="ts">
import { computed } from 'vue'
import type { Atividade } from '@/types/activity'
import type { Area } from '@/types/area'
import StatusBadge from '@/components/shared/StatusBadge.vue'
import WeightIndicator from '@/components/shared/WeightIndicator.vue'
import CollaborativeTag from '@/components/shared/CollaborativeTag.vue'
import AreaAvatar from '@/components/shared/AreaAvatar.vue'
import { foiDevolvida } from '@/composables/useStatusAtividade'

const props = defineProps<{
  atividade: Atividade
  parceiras: Area[]
  editavel?: boolean
  /** Só passar quando a lista cruza várias áreas (ex.: visão "todas as áreas") — identifica de quem é a linha. */
  area?: Area
}>()

const emit = defineEmits<{ editar: [atividade: Atividade] }>()

const prazoFormatado = computed(() => {
  const formatador = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
  const fim = formatador.format(new Date(`${props.atividade.dataFim}T12:00:00`))
  if (props.atividade.dataInicio) {
    const inicio = formatador.format(new Date(`${props.atividade.dataInicio}T12:00:00`))
    return `${inicio} — ${fim}`
  }
  return `Até ${fim}`
})
</script>

<template>
  <router-link
    :to="{
      name: 'atividade',
      params: { areaId: atividade.areaLiderId, activityId: atividade.id },
    }"
    class="flex flex-col gap-2 rounded-sm px-3 py-3 transition hover:bg-paper-dim sm:flex-row sm:items-center sm:justify-between"
  >
    <div class="flex min-w-0 items-center gap-3">
      <AreaAvatar v-if="area" :area="area" size="sm" class="shrink-0" />
      <div class="min-w-0">
        <p class="truncate text-sm font-semibold text-ink">{{ atividade.titulo }}</p>
        <div class="mt-1 flex flex-wrap items-center gap-2 text-xs text-ink-soft">
          <span class="font-mono">{{ prazoFormatado }}</span>
          <WeightIndicator :peso="atividade.peso" />
          <CollaborativeTag :parceiras="parceiras" />
        </div>
      </div>
    </div>
    <div class="flex shrink-0 items-center gap-2 self-start sm:self-center">
      <span
        v-if="foiDevolvida(atividade)"
        class="rounded-chip bg-status-critical-bg px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-status-critical"
      >
        Devolvida
      </span>
      <StatusBadge :atividade="atividade" />
      <button
        v-if="editavel"
        type="button"
        class="rounded-sm border border-line px-2.5 py-1 text-xs font-semibold text-ink-soft transition hover:border-brass hover:text-ink"
        @click.prevent.stop="emit('editar', atividade)"
      >
        Editar
      </button>
    </div>
  </router-link>
</template>
