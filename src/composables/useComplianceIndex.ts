import { computed, type Ref } from 'vue'
import type { Atividade } from '@/types/activity'
import type { Parametro } from '@/types/parametro'

export interface ComplianceBreakdown {
  base: number
  bonusAntecipacao: number
  bonusEngajamento: number
  bonusColaboracao: number
  indice: number
  pesoTotal: number
  pesoConcluidoNoPrazo: number
}

/**
 * Seção 6.1: base ponderada por peso + bônus de antecipação, engajamento e
 * colaboração. Percentuais de bônus vêm de `Parametro` (`stores/parametros.ts`),
 * administráveis pela tela de admin.
 */
export function calcularIndiceCumprimento(atividades: Atividade[], parametro: Parametro): ComplianceBreakdown {
  const pesoTotal = atividades.reduce((soma, a) => soma + a.peso, 0)

  const concluidasNoPrazo = atividades.filter(
    (a) => a.estado === 'concluida' && (!a.concluidaEm || a.concluidaEm <= a.dataFim),
  )
  const pesoConcluidoNoPrazo = concluidasNoPrazo.reduce((soma, a) => soma + a.peso, 0)
  const base = pesoTotal > 0 ? pesoConcluidoNoPrazo / pesoTotal : 0

  const antecipadas = concluidasNoPrazo.filter((a) => a.antecipada)
  const bonusAntecipacao =
    pesoTotal > 0
      ? (antecipadas.reduce((soma, a) => soma + a.peso, 0) / pesoTotal) * parametro.bonusAntecipacaoPercentual
      : 0

  const engajadas = atividades.filter((a) => a.interessados >= parametro.interesseMinimoEngajamento)
  const bonusEngajamento = Math.min(
    engajadas.length * parametro.bonusEngajamentoPorAtividade,
    parametro.bonusEngajamentoMaximo,
  )

  const colaborativasConcluidas = concluidasNoPrazo.filter((a) => a.areasParceirasIds.length > 0)
  const bonusColaboracao =
    pesoTotal > 0
      ? (colaborativasConcluidas.reduce((soma, a) => soma + a.peso, 0) / pesoTotal) * parametro.bonusColaboracaoPercentual
      : 0

  const indice = Math.min(base + bonusAntecipacao + bonusEngajamento + bonusColaboracao, 1)

  return {
    base,
    bonusAntecipacao,
    bonusEngajamento,
    bonusColaboracao,
    indice,
    pesoTotal,
    pesoConcluidoNoPrazo,
  }
}

export function useComplianceIndex(atividades: Ref<Atividade[]>, parametro: Ref<Parametro>) {
  return computed(() => calcularIndiceCumprimento(atividades.value, parametro.value))
}
