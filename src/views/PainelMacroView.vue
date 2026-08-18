<script setup lang="ts">
import { computed, ref } from 'vue'
import { useAreasStore } from '@/stores/areas'
import { useActivitiesStore } from '@/stores/activities'
import { useFeedStore } from '@/stores/feed'
import { useEventsStore } from '@/stores/events'
import { getStatusAtividade } from '@/composables/useStatusAtividade'
import { useExecutionOverview } from '@/composables/useExecutionOverview'
import ScoreboardStrip from '@/components/painel/ScoreboardStrip.vue'
import AreaSelectorGrid from '@/components/painel/AreaSelectorGrid.vue'
import ExecutionStats from '@/components/painel/ExecutionStats.vue'
import StatusDistributionChart from '@/components/painel/StatusDistributionChart.vue'
import ExecutionByMonthChart from '@/components/painel/ExecutionByMonthChart.vue'
import PodiumMonth from '@/components/painel/PodiumMonth.vue'
import AreaPlanTabs from '@/components/area/AreaPlanTabs.vue'
import FeedList from '@/components/painel/FeedList.vue'
import EventoDestaque from '@/components/events/EventoDestaque.vue'

const areasStore = useAreasStore()
const activitiesStore = useActivitiesStore()
const feedStore = useFeedStore()
const eventsStore = useEventsStore()

/** Única fonte de seleção de área da tela — dirige o KPI, os gráficos e o feed juntos. */
const areaSelecionada = ref('')

const areaAtual = computed(() =>
  areaSelecionada.value ? areasStore.getById(areaSelecionada.value) : undefined,
)

function pertenceAArea(atividade: { areaLiderId: string; areasParceirasIds: string[] }, areaId: string): boolean {
  return atividade.areaLiderId === areaId || atividade.areasParceirasIds.includes(areaId)
}

const contagensPorArea = computed(() => {
  const contagens: Record<string, number> = {}
  for (const area of areasStore.areas) {
    contagens[area.id] = activitiesStore.atividades.filter((a) => pertenceAArea(a, area.id)).length
  }
  return contagens
})

const atividadesEmFoco = computed(() =>
  areaSelecionada.value
    ? activitiesStore.atividades.filter((a) => pertenceAArea(a, areaSelecionada.value))
    : activitiesStore.atividades,
)

const visaoExecucao = useExecutionOverview(atividadesEmFoco)

const indicadores = computed(() => {
  const atividades = activitiesStore.atividades
  const concluidas = atividades.filter((a) => a.estado === 'concluida').length
  const aguardandoValidacao = atividades.filter((a) => a.estado === 'em-validacao').length
  const atrasadas = atividades.filter((a) => getStatusAtividade(a).cor === 'critical').length

  return [
    { label: 'Total de atividades', value: atividades.length, tone: 'neutral' as const },
    { label: 'Concluídas', value: concluidas, tone: 'good' as const },
    { label: 'Aguardando validação', value: aguardandoValidacao, tone: 'warning' as const },
    { label: 'Atrasadas', value: atrasadas, tone: 'critical' as const },
  ]
})

const FEED_RESUMO_LIMITE = 6

const publicacoesFiltradas = computed(() =>
  areaSelecionada.value ? feedStore.porArea(areaSelecionada.value) : feedStore.publicacoes,
)
const publicacoesResumo = computed(() => publicacoesFiltradas.value.slice(0, FEED_RESUMO_LIMITE))

const proximoEvento = computed(() => eventsStore.proximos[0])
const pautaProximoEvento = computed(() =>
  proximoEvento.value ? eventsStore.atividadesDe(proximoEvento.value) : [],
)
</script>

<template>
  <div class="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6">
    <ScoreboardStrip :items="indicadores" />

    <section class="animate-rise flex flex-col gap-3" style="animation-delay: 40ms">
      <h2 class="font-mono text-xs font-semibold uppercase tracking-widest text-ink-soft">
        Ver por área
      </h2>
      <AreaSelectorGrid
        v-model:selecionada="areaSelecionada"
        :areas="areasStore.areas"
        :contagens="contagensPorArea"
        :total-geral="activitiesStore.atividades.length"
      />
    </section>

    <Transition name="fade" mode="out-in">
      <div :key="areaAtual?.id ?? 'geral'" class="flex flex-wrap items-center justify-between gap-3">
        <h2 class="font-display text-xl font-bold text-ink">
          {{ areaAtual ? `${areaAtual.sigla} — ${areaAtual.nome}` : 'Visão geral da execução' }}
        </h2>
        <router-link
          v-if="areaAtual"
          :to="{ name: 'area', params: { areaId: areaAtual.id } }"
          class="inline-flex items-center gap-1.5 text-sm font-semibold text-ink hover:text-brass-ink"
        >
          Ver página completa da área
          <span aria-hidden="true">→</span>
        </router-link>
      </div>
    </Transition>

    <ExecutionStats :visao="visaoExecucao" />

    <div class="grid min-w-0 grid-cols-1 gap-8 lg:grid-cols-2">
      <StatusDistributionChart :visao="visaoExecucao" />
      <ExecutionByMonthChart :visao="visaoExecucao" />
    </div>

    <!-- Pódio compara as 21 áreas entre si — só faz sentido na visão geral, sem área filtrada. -->
    <Transition name="fade-rise">
      <PodiumMonth v-if="!areaAtual" :entradas="areasStore.ranking.slice(0, 3)" />
    </Transition>

    <Transition name="fade" mode="out-in">
      <section :key="areaSelecionada" class="min-w-0 panel p-6">
        <h2 class="font-display text-lg font-bold text-ink">Plano de atividades</h2>
        <div class="mt-4">
          <AreaPlanTabs
            :atividades="atividadesEmFoco"
            :area-atual-id="areaSelecionada"
            :limite-pagina="areaAtual ? undefined : 8"
          />
        </div>
      </section>
    </Transition>

    <div class="grid min-w-0 grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <div class="flex min-w-0 flex-col gap-4">
        <h2 class="font-display text-lg font-bold text-ink">
          Feed de notícias
          <span class="font-mono text-xs font-normal text-ink-soft">· {{ publicacoesFiltradas.length }}</span>
        </h2>

        <FeedList :publicacoes="publicacoesResumo" />

        <router-link
          :to="{ name: 'feed', query: areaSelecionada ? { area: areaSelecionada } : {} }"
          class="inline-flex items-center justify-center gap-1.5 rounded-chip border border-line bg-card px-4 py-2.5 text-sm font-semibold text-ink transition hover:border-brass hover:text-brass-ink"
        >
          Ver todos os feeds
          <span aria-hidden="true">→</span>
        </router-link>
      </div>

      <div class="lg:sticky lg:top-20">
        <EventoDestaque v-if="proximoEvento" :evento="proximoEvento" :pauta="pautaProximoEvento" />
      </div>
    </div>
  </div>
</template>
