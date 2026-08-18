import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { Area } from '@/types/area'
import type { Selo } from '@/types/badge'
import { selos as selosMock } from '@/mocks/badges.mock'
import { fetchAreasRaw } from '@/services/ctrt-api'
import { transformarArea } from '@/services/ctrt-adapter'
import { useActivitiesStore } from './activities'
import { useParametrosStore } from './parametros'
import { calcularIndiceCumprimento } from '@/composables/useComplianceIndex'
import { getStatusAtividade } from '@/composables/useStatusAtividade'

export interface RankingEntry {
  area: Area
  posicao: number
  indice: number
  pesoTotal: number
  atrasadas: number
  selos: Selo[]
  destaqueDoMes: boolean
}

export const useAreasStore = defineStore('areas', () => {
  const areas = ref<Area[]>([])
  const loading = ref(false)
  const carregado = ref(false)

  async function fetchAreas(): Promise<void> {
    if (carregado.value || loading.value) return
    loading.value = true
    const dados = await fetchAreasRaw()
    areas.value = dados.map((area, indice) => transformarArea(area, indice))
    loading.value = false
    carregado.value = true
  }

  function getById(id: string): Area | undefined {
    return areas.value.find((a) => a.id === id)
  }

  /**
   * Ranking mensal ponderado (seção 6.1) — combina áreas + atividades. Fica
   * aqui, e não numa store própria, porque é só uma projeção derivada das
   * duas outras stores, sem estado próprio.
   */
  const ranking = computed<RankingEntry[]>(() => {
    const activitiesStore = useActivitiesStore()
    const parametrosStore = useParametrosStore()

    const entradas = areas.value.map((area) => {
      const atividadesArea = activitiesStore.atividades.filter(
        (a) => a.areaLiderId === area.id || a.areasParceirasIds.includes(area.id),
      )
      const { indice, pesoTotal } = calcularIndiceCumprimento(atividadesArea, parametrosStore.parametro)
      const atrasadas = atividadesArea.filter(
        (a) => getStatusAtividade(a).cor === 'critical',
      ).length

      return {
        area,
        indice,
        pesoTotal,
        atrasadas,
        selos: selosMock.filter((s) => s.areaId === area.id),
      }
    })

    return entradas
      .sort((a, b) => b.indice - a.indice)
      .map((entrada, i) => ({ ...entrada, posicao: i + 1, destaqueDoMes: i === 0 }))
  })

  return { areas, loading, carregado, fetchAreas, getById, ranking }
})
