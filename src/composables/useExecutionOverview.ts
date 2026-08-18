import { computed, type Ref } from 'vue'
import type { Atividade, EstadoAtividade } from '@/types/activity'
import { getStatusAtividade, venceEsteMes } from './useStatusAtividade'

export interface ContagemStatus {
  estado: EstadoAtividade
  label: string
  valor: number
  cor: string
}

export interface VisaoExecucao {
  total: number
  concluidas: number
  emAndamento: number
  planejadas: number
  emValidacao: number
  atrasadas: number
  faltam: number
  venceEsteMes: number
  porStatus: ContagemStatus[]
  porMes: Array<{ mes: string; valor: number; mesAtual: boolean }>
}

const LABEL_ESTADO: Record<EstadoAtividade, string> = {
  planejada: 'Pendentes',
  'em-andamento': 'Em andamento',
  'em-validacao': 'Em validação',
  concluida: 'Concluídas',
  atrasada: 'Atrasadas',
}

/** Reaproveita os tokens já usados no resto do painel — nenhuma cor nova. */
const COR_ESTADO: Record<EstadoAtividade, string> = {
  planejada: 'var(--color-ink-soft)',
  'em-andamento': 'var(--color-brass)',
  'em-validacao': 'var(--color-status-warning)',
  concluida: 'var(--color-status-good)',
  atrasada: 'var(--color-status-critical)',
}

const MESES_ABREV = [
  'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez',
]

export function useExecutionOverview(atividades: Ref<Atividade[]>) {
  return computed<VisaoExecucao>(() => {
    const hoje = new Date()
    const contagem: Record<EstadoAtividade, number> = {
      planejada: 0,
      'em-andamento': 0,
      'em-validacao': 0,
      concluida: 0,
      atrasada: 0,
    }

    let contadorVenceEsteMes = 0
    const anoAtual = hoje.getFullYear()
    const mesAtualIndice = hoje.getMonth()
    const contagemPorMes = Array.from({ length: 12 }, () => 0)

    for (const atividade of atividades.value) {
      const status = getStatusAtividade(atividade, hoje)
      contagem[status.estado]++

      const prazo = new Date(`${atividade.dataFim}T12:00:00`)
      if (venceEsteMes(atividade, hoje)) {
        contadorVenceEsteMes++
      }
      if (prazo.getFullYear() === anoAtual) {
        contagemPorMes[prazo.getMonth()]++
      }
    }

    const total = atividades.value.length

    return {
      total,
      concluidas: contagem.concluida,
      emAndamento: contagem['em-andamento'],
      planejadas: contagem.planejada,
      emValidacao: contagem['em-validacao'],
      atrasadas: contagem.atrasada,
      faltam: total - contagem.concluida,
      venceEsteMes: contadorVenceEsteMes,
      // Mantém as 5 categorias sempre presentes (mesmo com valor 0) para que a
      // barra empilhada anime largura em vez de remover/inserir segmentos ao
      // trocar de área.
      porStatus: (Object.keys(contagem) as EstadoAtividade[]).map((estado) => ({
        estado,
        label: LABEL_ESTADO[estado],
        valor: contagem[estado],
        cor: COR_ESTADO[estado],
      })),
      porMes: MESES_ABREV.map((mes, i) => ({
        mes,
        valor: contagemPorMes[i],
        mesAtual: i === mesAtualIndice,
      })),
    }
  })
}
