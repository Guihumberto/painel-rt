import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Parametro } from '@/types/parametro'

const STORAGE_KEY = 'painel-rt:parametros'

const PADRAO: Parametro = {
  slaDiasUteis: 5,
  interesseContadorMinimo: 5,
  interesseMinimoEngajamento: 20,
  bonusAntecipacaoPercentual: 0.05,
  bonusEngajamentoPorAtividade: 0.01,
  bonusEngajamentoMaximo: 0.05,
  bonusColaboracaoPercentual: 0.15,
}

function lerLocal(): Parametro {
  try {
    const bruto = localStorage.getItem(STORAGE_KEY)
    return bruto ? { ...PADRAO, ...(JSON.parse(bruto) as Partial<Parametro>) } : PADRAO
  } catch {
    return PADRAO
  }
}

/** Parâmetros de pontuação/SLA administráveis — ver types/parametro.ts. */
export const useParametrosStore = defineStore('parametros', () => {
  const parametro = ref<Parametro>(lerLocal())

  function atualizar(patch: Partial<Parametro>): void {
    parametro.value = { ...parametro.value, ...patch }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(parametro.value))
  }

  return { parametro, atualizar }
})
