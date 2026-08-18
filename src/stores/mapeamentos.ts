import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Mapeamento } from '@/types/mapeamento'
import { fetchMapeamentosRaw } from '@/services/ctrt-api'
import { transformarMapeamento } from '@/services/ctrt-adapter'

export const useMapeamentosStore = defineStore('mapeamentos', () => {
  const mapeamentos = ref<Mapeamento[]>([])
  const loading = ref(false)
  const carregado = ref(false)

  async function fetchMapeamentos(): Promise<void> {
    if (carregado.value || loading.value) return
    loading.value = true
    const dados = await fetchMapeamentosRaw()
    mapeamentos.value = dados.map(transformarMapeamento)
    loading.value = false
    carregado.value = true
  }

  function porArea(areaId: string): Mapeamento[] {
    return mapeamentos.value.filter((m) => m.areaId === areaId)
  }

  return { mapeamentos, loading, carregado, fetchMapeamentos, porArea }
})
