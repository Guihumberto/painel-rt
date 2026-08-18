<script setup lang="ts">
import { computed } from 'vue'
import { useAreasStore } from '@/stores/areas'
import { useActivitiesStore } from '@/stores/activities'
import { useFeedStore } from '@/stores/feed'
import AreaHeader from '@/components/area/AreaHeader.vue'
import AreaIndexSparkline from '@/components/area/AreaIndexSparkline.vue'
import AreaBadgeHistory from '@/components/area/AreaBadgeHistory.vue'
import AreaPlanTabs from '@/components/area/AreaPlanTabs.vue'

const props = defineProps<{ areaId: string }>()

const areasStore = useAreasStore()
const activitiesStore = useActivitiesStore()
const feedStore = useFeedStore()

const entrada = computed(() => areasStore.ranking.find((e) => e.area.id === props.areaId))
const atividadesDaArea = computed(() => activitiesStore.porArea(props.areaId).value)
const publicacoesDaArea = computed(() => feedStore.porArea(props.areaId))
</script>

<template>
  <div v-if="entrada">
    <AreaHeader :entrada="entrada" />

    <div class="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6">
      <AreaIndexSparkline :area="entrada.area" :indice-atual="entrada.indice" />

      <div class="grid min-w-0 grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <section class="min-w-0 panel p-6">
          <h2 class="font-display text-lg font-bold text-ink">Plano de atividades</h2>
          <div class="mt-4">
            <AreaPlanTabs :atividades="atividadesDaArea" :area-atual-id="props.areaId" />
          </div>
        </section>

        <AreaBadgeHistory :publicacoes="publicacoesDaArea" :selos="entrada.selos" />
      </div>
    </div>
  </div>

  <p v-else class="mx-auto max-w-6xl px-4 py-16 text-center text-sm text-ink-soft">
    {{ areasStore.carregado ? 'Área não encontrada.' : 'Carregando dados da área…' }}
  </p>
</template>
