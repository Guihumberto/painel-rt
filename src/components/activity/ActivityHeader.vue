<script setup lang="ts">
import { computed } from 'vue'
import type { Atividade } from '@/types/activity'
import type { Area } from '@/types/area'
import StatusBadge from '@/components/shared/StatusBadge.vue'
import WeightIndicator from '@/components/shared/WeightIndicator.vue'
import CollaborativeTag from '@/components/shared/CollaborativeTag.vue'
import AreaAvatar from '@/components/shared/AreaAvatar.vue'
import ActivityInterestButton from './ActivityInterestButton.vue'

const props = defineProps<{ atividade: Atividade; area: Area; parceiras: Area[] }>()

const TIPO_PRAZO_LABEL: Record<Atividade['tipoPrazo'], string> = {
  janela: 'Janela de execução',
  'data-limite': 'Data-limite',
  continua: 'Contínua / anual',
}

const prazoFormatado = computed(() => {
  const formatador = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
  const fim = formatador.format(new Date(`${props.atividade.dataFim}T12:00:00`))
  if (props.atividade.dataInicio) {
    const inicio = formatador.format(new Date(`${props.atividade.dataInicio}T12:00:00`))
    return `${inicio} até ${fim}`
  }
  return fim
})
</script>

<template>
  <header class="border-b border-line bg-card">
    <div class="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <nav class="mb-4 flex flex-wrap items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-ink-soft">
        <router-link to="/" class="hover:text-ink">Painel</router-link>
        <span>/</span>
        <router-link :to="{ name: 'area', params: { areaId: area.id } }" class="hover:text-ink">
          {{ area.sigla }}
        </router-link>
        <span>/</span>
        <span class="truncate text-ink">Atividade</span>
      </nav>

      <div class="flex items-center gap-2">
        <AreaAvatar :area="area" size="sm" />
        <span class="text-sm font-semibold text-ink-soft">{{ area.nome }}</span>
      </div>

      <h1 class="mt-3 font-display text-2xl font-extrabold text-ink sm:text-3xl">
        {{ atividade.titulo }}
      </h1>
      <p class="mt-2 max-w-2xl text-sm text-ink-soft">{{ atividade.descricao }}</p>

      <div class="mt-4 flex flex-wrap items-center gap-2.5">
        <StatusBadge :atividade="atividade" />
        <WeightIndicator :peso="atividade.peso" />
        <CollaborativeTag :parceiras="parceiras" />
        <span class="font-mono text-xs text-ink-soft">
          {{ TIPO_PRAZO_LABEL[atividade.tipoPrazo] }} · {{ prazoFormatado }}
        </span>
      </div>

      <dl class="mt-6 grid gap-4 sm:grid-cols-2">
        <div class="rounded-sm bg-paper-dim p-4">
          <dt class="font-mono text-[11px] uppercase tracking-wide text-ink-soft">O que muda</dt>
          <dd class="mt-1 text-sm text-ink">{{ atividade.oQueMuda }}</dd>
        </div>
        <div class="rounded-sm bg-paper-dim p-4">
          <dt class="font-mono text-[11px] uppercase tracking-wide text-ink-soft">Impacto</dt>
          <dd class="mt-1 text-sm text-ink">{{ atividade.impacto }}</dd>
        </div>
      </dl>

      <div class="mt-6">
        <ActivityInterestButton :atividade-id="atividade.id" />
      </div>
    </div>
  </header>
</template>
