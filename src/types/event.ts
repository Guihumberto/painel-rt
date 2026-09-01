export type EventoStatus = 'agendado' | 'realizado' | 'suspenso'

/** Item de pauta com responsável nomeado — reuniões de comitê (ex.: CTRT), não seminários. */
export interface AssuntoPauta {
  ordem: number
  titulo: string
  responsavel: string
}

export interface Evento {
  id: string
  titulo: string
  tipo: string
  data: string
  /** Horário local, formato "16h30" — só reuniões de comitê têm hora fixa divulgada. */
  hora?: string
  local: string
  modalidade?: string
  /** Numeração institucional da reunião, ex.: "14/2026". */
  numero?: string
  publicoAlvo?: string
  descricao: string
  status: EventoStatus
  /** Atividades apresentadas — fixo apenas para eventos já realizados. */
  atividadesIds?: string[]
  /** Pauta fixa com responsável nomeado — quando presente, tem prioridade sobre `atividadesIds`. */
  assuntos?: AssuntoPauta[]
  informes?: string[]
}
