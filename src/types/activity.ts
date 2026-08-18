export type TipoPrazo = 'janela' | 'data-limite' | 'continua'

export type EstadoAtividade =
  | 'planejada'
  | 'em-andamento'
  | 'em-validacao'
  | 'concluida'
  | 'atrasada'

export type Peso = 1 | 2 | 3

/**
 * Classificação de cada atualização de andamento — não muda o `EstadoAtividade`
 * sozinha (só 'inicio' e 'conclusao' disparam transição de estado); 'paralisacao'
 * é só uma marcação de atenção na linha do tempo, deliberadamente, pra não
 * mexer em gráficos/ranking/filtros que já lêem `EstadoAtividade`.
 */
export type TipoAtualizacao = 'inicio' | 'atualizacao' | 'paralisacao' | 'conclusao'

export const TIPO_ATUALIZACAO_LABEL: Record<TipoAtualizacao, string> = {
  inicio: 'Início',
  atualizacao: 'Atualização',
  paralisacao: 'Paralisação',
  conclusao: 'Conclusão',
}

export interface Andamento {
  id: string
  atividadeId: string
  texto: string
  data: string
  autor: string
  tipo: TipoAtualizacao
}

export type TipoArtefato = 'pdf' | 'imagem' | 'link'

export interface Comprovacao {
  id: string
  atividadeId: string
  /** Aponta pro `Andamento` que gerou este artefato — ausente nos dados seedados legados. */
  andamentoId?: string
  tipo: TipoArtefato
  nome: string
  /** Usado quando `tipo === 'link'`; renderizado como link clicável. */
  url?: string
  data: string
  autor: string
  publica: boolean
}

export type DecisaoValidacao = 'aprovada' | 'aprovada-com-edicao' | 'devolvida'

export interface Validacao {
  id: string
  atividadeId: string
  decisao: DecisaoValidacao
  validador: string
  data: string
  observacao?: string
}

/**
 * Campos que o Responsável de área cadastra/edita — deliberadamente sem
 * `estado`, `validacoes`, `comprovacoes`, `andamentos`: essas mudam por ações
 * de fluxo próprias (registrar atualização, validar), não por edição direta
 * de formulário.
 */
export interface AtividadeFormInput {
  titulo: string
  descricao: string
  oQueMuda: string
  impacto: string
  tipoPrazo: TipoPrazo
  dataInicio?: string
  dataFim: string
  peso: Peso
  areasParceirasIds: string[]
}

/** Payload de uma atualização de andamento — sempre com um artefato junto. */
export interface AtualizacaoInput {
  tipo: TipoAtualizacao
  texto: string
  artefato: { tipo: TipoArtefato; nome: string; url?: string }
  /** Obrigatório quando `tipo === 'conclusao'` — texto separado para o feed público. */
  resumoPublico?: string
}

export interface Atividade {
  id: string
  areaLiderId: string
  areasParceirasIds: string[]
  titulo: string
  descricao: string
  tipoPrazo: TipoPrazo
  dataInicio?: string
  dataFim: string
  oQueMuda: string
  impacto: string
  peso: Peso
  estado: EstadoAtividade
  criadaEm: string
  concluidaEm?: string
  /** Preenchido quando a conclusão é enviada para validação — base para o SLA da fila do Validador. */
  entrouEmValidacaoEm?: string
  /** Texto para o feed público, preenchido na conclusão; some enquanto isso, `feed.ts` usa `oQueMuda`. */
  resumoPublico?: string
  antecipada: boolean
  andamentos: Andamento[]
  comprovacoes: Comprovacao[]
  /** Uma por ciclo de validação — pode devolver e ser concluída de novo depois, cada decisão fica. */
  validacoes: Validacao[]
  interessados: number
}

/** Payload de uma decisão de validação. */
export interface ValidacaoInput {
  decisao: DecisaoValidacao
  /** Opcional em aprovação, obrigatória em devolução (é a justificativa). */
  observacao?: string
  /** Só quando `decisao === 'aprovada-com-edicao'` — substitui `Atividade.resumoPublico`. */
  resumoPublico?: string
}
