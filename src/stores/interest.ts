import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useActivitiesStore } from './activities'

const STORAGE_KEY = 'painel-rt:interesses'

function lerClicados(): string[] {
  try {
    const bruto = localStorage.getItem(STORAGE_KEY)
    return bruto ? (JSON.parse(bruto) as string[]) : []
  } catch {
    return []
  }
}

export const useInterestStore = defineStore('interest', () => {
  const clicados = ref<string[]>(lerClicados())

  function jaClicou(atividadeId: string): boolean {
    return clicados.value.includes(atividadeId)
  }

  /**
   * Um clique por atividade por navegador — mock do "um clique por servidor"
   * (seção 7.1), até existir autenticação real vinda do backend.
   */
  function registrarInteresse(atividadeId: string): void {
    if (jaClicou(atividadeId)) return
    const activitiesStore = useActivitiesStore()
    const atividade = activitiesStore.getById(atividadeId)
    if (!atividade) return

    atividade.interessados += 1
    clicados.value = [...clicados.value, atividadeId]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(clicados.value))
  }

  return { clicados, jaClicou, registrarInteresse }
})
