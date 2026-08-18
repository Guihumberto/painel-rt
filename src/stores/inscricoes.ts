import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Inscricao, InscricaoFormInput } from '@/types/inscricao'

const STORAGE_KEY = 'painel-rt:inscricoes'
const STORAGE_KEY_MINHAS = 'painel-rt:minhas-inscricoes'

function lerInscricoes(): Inscricao[] {
  try {
    const bruto = localStorage.getItem(STORAGE_KEY)
    return bruto ? (JSON.parse(bruto) as Inscricao[]) : []
  } catch {
    return []
  }
}

function lerMinhas(): string[] {
  try {
    const bruto = localStorage.getItem(STORAGE_KEY_MINHAS)
    return bruto ? (JSON.parse(bruto) as string[]) : []
  } catch {
    return []
  }
}

export const useInscricoesStore = defineStore('inscricoes', () => {
  const inscricoes = ref<Inscricao[]>(lerInscricoes())
  const meusEventoIds = ref<string[]>(lerMinhas())

  function inscritosDe(eventoId: string): Inscricao[] {
    return inscricoes.value
      .filter((i) => i.eventoId === eventoId)
      .sort((a, b) => (a.criadoEm < b.criadoEm ? -1 : 1))
  }

  function estaInscrito(eventoId: string): boolean {
    return meusEventoIds.value.includes(eventoId)
  }

  /**
   * Uma inscrição por evento por navegador — mesmo mock de identidade do
   * `useInterestStore` (um clique por servidor), até existir SSO real
   * confirmando presença de verdade.
   */
  function inscrever(eventoId: string, dados: InscricaoFormInput): void {
    if (estaInscrito(eventoId)) return
    const inscricao: Inscricao = {
      id: `insc-${eventoId}-${Date.now()}`,
      eventoId,
      criadoEm: new Date().toISOString(),
      ...dados,
    }
    inscricoes.value = [...inscricoes.value, inscricao]
    meusEventoIds.value = [...meusEventoIds.value, eventoId]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(inscricoes.value))
    localStorage.setItem(STORAGE_KEY_MINHAS, JSON.stringify(meusEventoIds.value))
  }

  return { inscricoes, inscritosDe, estaInscrito, inscrever }
})
