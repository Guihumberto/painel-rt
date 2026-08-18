export type SeloTipo =
  | '100-em-dia'
  | 'primeira-a-concluir'
  | 'sequencia'
  | 'maior-evolucao'
  | 'ponte'

export interface Selo {
  id: string
  tipo: SeloTipo
  areaId: string
  titulo: string
  descricao: string
  conquistadoEm: string
}
