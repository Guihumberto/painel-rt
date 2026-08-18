import type { SeloTipo } from '@/types/badge'

export interface SeloInfo {
  titulo: string
  descricao: string
  icone: string
}

export const SELO_INFO: Record<SeloTipo, SeloInfo> = {
  '100-em-dia': {
    titulo: '100% em dia',
    descricao: 'Nenhuma pendência no mês.',
    icone: '✓',
  },
  'primeira-a-concluir': {
    titulo: 'Primeira a concluir',
    descricao: 'Primeira entrega validada do ciclo.',
    icone: '①',
  },
  sequencia: {
    titulo: 'Sequência',
    descricao: '3+ meses consecutivos sem atraso.',
    icone: '⟳',
  },
  'maior-evolucao': {
    titulo: 'Maior evolução',
    descricao: 'Maior salto no ranking do período.',
    icone: '↑',
  },
  ponte: {
    titulo: 'Ponte',
    descricao: 'Área que mais participa de entregas colaborativas.',
    icone: '⇄',
  },
}
