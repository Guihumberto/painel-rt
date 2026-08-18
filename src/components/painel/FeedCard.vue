<script setup lang="ts">
import type { Publicacao } from '@/types/publication'
import type { Area } from '@/types/area'
import AreaAvatar from '@/components/shared/AreaAvatar.vue'
import ActivityInterestButton from '@/components/activity/ActivityInterestButton.vue'

const props = defineProps<{ publicacao: Publicacao; areas: Area[] }>()

const dataFormatada = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' }).format(
  new Date(`${props.publicacao.publicadoEm}T12:00:00`),
)
</script>

<template>
  <article class="animate-rise panel p-5 sm:p-6">
    <header class="flex flex-wrap items-center justify-between gap-3">
      <div class="flex items-center gap-2">
        <AreaAvatar v-for="area in areas" :key="area.id" :area="area" size="sm" />
        <span class="text-sm font-semibold text-ink">
          {{ areas.map((a) => a.sigla).join(' + ') }}
        </span>
        <span class="font-mono text-xs text-ink-soft">{{ dataFormatada }}</span>
      </div>

      <span
        class="rounded-chip px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide"
        :class="
          publicacao.seloContexto === 'antecipada'
            ? 'bg-brass/15 text-brass-ink'
            : 'bg-status-good-bg text-status-good'
        "
      >
        {{ publicacao.seloContexto === 'antecipada' ? 'Antecipada' : 'No prazo' }}
      </span>
    </header>

    <router-link
      :to="{
        name: 'atividade',
        params: { areaId: areas[0].id, activityId: publicacao.atividadeId },
      }"
      class="mt-3 block"
    >
      <h3 class="font-display text-lg font-bold text-ink hover:underline">
        {{ publicacao.tituloNoticia }}
      </h3>
    </router-link>

    <dl class="mt-3 space-y-2 text-sm">
      <div>
        <dt class="font-mono text-[11px] uppercase tracking-wide text-ink-soft">O que muda</dt>
        <dd class="text-ink">{{ publicacao.oQueMuda }}</dd>
      </div>
      <div>
        <dt class="font-mono text-[11px] uppercase tracking-wide text-ink-soft">Impacto</dt>
        <dd class="text-ink">{{ publicacao.impacto }}</dd>
      </div>
    </dl>

    <p
      v-if="publicacao.comprovacoesPublicas.length > 0"
      class="mt-3 flex flex-wrap gap-1.5 text-xs text-ink-soft"
    >
      <span
        v-for="nome in publicacao.comprovacoesPublicas"
        :key="nome"
        class="inline-flex items-center gap-1.5 rounded border border-line px-2 py-0.5"
      >
        <span class="font-mono text-[9px] uppercase tracking-wide text-ink-soft/70">Anexo</span>
        {{ nome }}
      </span>
    </p>

    <footer class="mt-4 flex items-center justify-end border-t border-line pt-4">
      <ActivityInterestButton :atividade-id="publicacao.atividadeId" />
    </footer>
  </article>
</template>
