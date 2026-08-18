<script setup lang="ts">
import type { Publicacao } from '@/types/publication'
import type { Area } from '@/types/area'
import AreaAvatar from '@/components/shared/AreaAvatar.vue'

const props = defineProps<{ publicacao: Publicacao; areas: Area[] }>()

const dataFormatada = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' }).format(
  new Date(`${props.publicacao.publicadoEm}T12:00:00`),
)
</script>

<template>
  <router-link
    :to="{
      name: 'atividade',
      params: { areaId: areas[0].id, activityId: publicacao.atividadeId },
    }"
    class="animate-rise flex items-start gap-3 rounded-sm p-3 transition hover:bg-paper-dim"
  >
    <AreaAvatar :area="areas[0]" />

    <div class="min-w-0 flex-1">
      <div class="flex items-center justify-between gap-2">
        <span class="truncate text-xs font-semibold text-ink-soft">
          {{ areas.map((a) => a.sigla).join(' + ') }}
        </span>
        <span class="shrink-0 font-mono text-[11px] text-ink-soft/70">{{ dataFormatada }}</span>
      </div>
      <p class="mt-0.5 line-clamp-2 text-sm font-semibold leading-snug text-ink">
        {{ publicacao.tituloNoticia }}
      </p>
      <span
        class="mt-1.5 inline-flex items-center rounded-chip px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
        :class="
          publicacao.seloContexto === 'antecipada'
            ? 'bg-brass/15 text-brass-ink'
            : 'bg-status-good-bg text-status-good'
        "
      >
        {{ publicacao.seloContexto === 'antecipada' ? 'Antecipada' : 'No prazo' }}
      </span>
    </div>
  </router-link>
</template>
