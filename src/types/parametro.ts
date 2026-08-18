/**
 * Valores hoje fixos como constantes espalhadas pelo código, centralizados
 * aqui pra virar de fato configurável pela tela de admin — ver
 * docs/roteiro-fase-2.md.
 */
export interface Parametro {
  /** Seção 4, Etapa 3: "SLA de validação: 5 dias úteis (configurável)". */
  slaDiasUteis: number
  /** Seção 7.1: a partir de quantos cliques em "Quero saber mais" o contador vira público. */
  interesseContadorMinimo: number
  /** Seção 6.1: mínimo de interessados pra uma atividade contar no bônus de engajamento. */
  interesseMinimoEngajamento: number
  /** Seção 6.1: bônus por concluir antes do prazo. */
  bonusAntecipacaoPercentual: number
  /** Seção 6.1: bônus por atividade engajada (limitado por `bonusEngajamentoMaximo`). */
  bonusEngajamentoPorAtividade: number
  bonusEngajamentoMaximo: number
  /** Seção 6.1: bônus por conclusão colaborativa (com área parceira). */
  bonusColaboracaoPercentual: number
}
