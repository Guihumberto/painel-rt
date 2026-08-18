export interface Inscricao {
  id: string
  eventoId: string
  nome: string
  email: string
  criadoEm: string
}

export type InscricaoFormInput = Pick<Inscricao, 'nome' | 'email'>
