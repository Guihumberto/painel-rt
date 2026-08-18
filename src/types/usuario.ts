/**
 * Nomes de campo espelham as claims do JWT que o SSO real da SEFAZ-MA (Keycloak/OIDC)
 * devolve — ver docs/roteiro-fase-2.md, seção "SSO real (COTEC/Keycloak)" — para que a
 * futura troca da sessão simulada por um token real seja direta.
 */
export type Perfil = 'responsavel' | 'validador' | 'admin' | 'auditor'

export interface Usuario {
  id: string
  nome: string
  matricula: string
  email: string
  perfil: Perfil
  areaId?: string
}

export const PERFIL_LABEL: Record<Perfil, string> = {
  responsavel: 'Responsável',
  validador: 'Validador',
  admin: 'Administrador',
  auditor: 'Auditor',
}

/** Campos que o Administrador cadastra/edita ao gerenciar um usuário. */
export type UsuarioFormInput = Omit<Usuario, 'id'>
