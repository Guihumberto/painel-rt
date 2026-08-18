export type SeloContexto = 'no-prazo' | 'antecipada'

export interface Publicacao {
  id: string
  atividadeId: string
  areaIds: string[]
  tituloNoticia: string
  oQueMuda: string
  impacto: string
  publicadoEm: string
  seloContexto: SeloContexto
  validadorResponsavel: string
  comprovacoesPublicas: string[]
}
