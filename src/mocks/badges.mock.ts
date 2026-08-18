import type { Selo } from '@/types/badge'
import { SELO_INFO } from '@/constants/selos'

/**
 * Diferente do resto do painel, isto ainda é "mock" no sentido literal —
 * mas só concede selo onde há um sinal real no guia da Reforma para
 * justificá-lo. Sem histórico real de ranking mensal, não há como sustentar
 * "100% em dia", "sequência" ou "maior evolução" sem inventar dado.
 */
const raw: Array<Pick<Selo, 'tipo' | 'areaId' | 'conquistadoEm'>> = [
  // COTRH é a única atividade do guia marcada "Finalizado" — primeira entrega real do plano.
  { tipo: 'primeira-a-concluir', areaId: 'cotrh', conquistadoEm: '2025-11-18' },
  // CEGPA participa dos grupos temáticos que conectam CSL e ASJUR no reequilíbrio econômico-financeiro.
  { tipo: 'ponte', areaId: 'cegpa', conquistadoEm: '2026-04-01' },
]

export const selos: Selo[] = raw.map((item, index) => ({
  id: `selo-${index + 1}`,
  ...item,
  titulo: SELO_INFO[item.tipo].titulo,
  descricao: SELO_INFO[item.tipo].descricao,
}))
