import { computed, type Ref } from 'vue'
import type { Atividade, EstadoAtividade } from '@/types/activity'

export type StatusCor = 'good' | 'warning' | 'critical'

export interface StatusInfo {
  estado: EstadoAtividade
  cor: StatusCor
  label: string
}

const LABELS: Record<EstadoAtividade, string> = {
  planejada: 'Planejada',
  'em-andamento': 'Em andamento',
  'em-validacao': 'Em validação',
  concluida: 'Concluída',
  atrasada: 'Atrasada',
}

/**
 * "atrasada — calculado automaticamente pelo prazo; sobrepõe qualquer estado
 * não concluído" (spec seção 3.3) — o estado gravado no mock nunca é
 * "atrasada" diretamente, ele é derivado comparando o prazo com hoje.
 */
export function getStatusAtividade(atividade: Atividade, hoje = new Date()): StatusInfo {
  if (atividade.estado === 'concluida') {
    return { estado: 'concluida', cor: 'good', label: LABELS.concluida }
  }
  if (atividade.estado === 'em-validacao') {
    return { estado: 'em-validacao', cor: 'warning', label: LABELS['em-validacao'] }
  }
  if (new Date(atividade.dataFim) < hoje) {
    return { estado: 'atrasada', cor: 'critical', label: LABELS.atrasada }
  }
  return { estado: atividade.estado, cor: 'good', label: LABELS[atividade.estado] }
}

export function useStatusAtividade(atividade: Ref<Atividade>) {
  return computed(() => getStatusAtividade(atividade.value))
}

/**
 * Verdadeiro enquanto a devolução do Validador não foi respondida — a última
 * decisão registrada foi 'devolvida' e a área ainda não reenviou (reenviar
 * muda `estado` para 'em-validacao' de novo, o que já invalida esta checagem
 * sozinho, sem precisar de um campo extra). Não é um `EstadoAtividade` novo
 * de propósito — mesma decisão já tomada para 'paralisacao' (ver
 * types/activity.ts): evita mexer em gráficos/ranking/filtros existentes.
 */
export function foiDevolvida(atividade: Atividade): boolean {
  return atividade.estado === 'em-andamento' && atividade.validacoes.at(-1)?.decisao === 'devolvida'
}

/** Motivo da devolução mais recente, se houver (ver `foiDevolvida`). */
export function motivoDevolucao(atividade: Atividade): string | undefined {
  const ultima = atividade.validacoes.at(-1)
  return ultima?.decisao === 'devolvida' ? ultima.observacao : undefined
}

/** O prazo cai no mês/ano corrente e a atividade ainda não foi concluída —
 * mesma definição usada no KPI "Vencem em [mês]" (useExecutionOverview.ts). */
export function venceEsteMes(atividade: Atividade, hoje = new Date()): boolean {
  if (atividade.estado === 'concluida') return false
  const prazo = new Date(`${atividade.dataFim}T12:00:00`)
  return prazo.getFullYear() === hoje.getFullYear() && prazo.getMonth() === hoje.getMonth()
}
