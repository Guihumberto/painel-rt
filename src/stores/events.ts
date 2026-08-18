import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { Atividade } from '@/types/activity'
import type { Evento } from '@/types/event'
import { eventos as eventosMock } from '@/mocks/events.mock'
import { mockDelay } from '@/utils/mock-delay'
import { useActivitiesStore } from './activities'

export const useEventsStore = defineStore('events', () => {
  const eventos = ref<Evento[]>([])
  const loading = ref(false)
  const carregado = ref(false)

  async function fetchEventos(): Promise<void> {
    if (carregado.value || loading.value) return
    loading.value = true
    await mockDelay()
    eventos.value = eventosMock
    loading.value = false
    carregado.value = true
  }

  const proximos = computed(() =>
    eventos.value
      .filter((e) => e.status === 'agendado')
      .sort((a, b) => (a.data < b.data ? -1 : 1)),
  )

  const passados = computed(() =>
    eventos.value
      .filter((e) => e.status === 'realizado')
      .sort((a, b) => (a.data > b.data ? -1 : 1)),
  )

  /**
   * Pauta provisória do próximo seminário: as 3 atividades com mais cliques em
   * "Quero saber mais" que ainda não subiram ao palco — "as pessoas clicam
   * sabendo que o clique delas escolhe a pauta do próximo seminário" (seção 7.2).
   */
  const pautaProvisoria = computed<Atividade[]>(() => {
    const activitiesStore = useActivitiesStore()
    const jaApresentadas = new Set(
      eventos.value.flatMap((e) => e.atividadesIds ?? []),
    )
    return [...activitiesStore.atividades]
      .filter((a) => !jaApresentadas.has(a.id))
      .sort((a, b) => b.interessados - a.interessados)
      .slice(0, 3)
  })

  function atividadesDe(evento: Evento): Atividade[] {
    const activitiesStore = useActivitiesStore()
    if (evento.atividadesIds) {
      return evento.atividadesIds
        .map((id) => activitiesStore.getById(id))
        .filter((a): a is Atividade => Boolean(a))
    }
    return pautaProvisoria.value
  }

  return { eventos, loading, carregado, fetchEventos, proximos, passados, pautaProvisoria, atividadesDe }
})
