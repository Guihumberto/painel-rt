import type { Usuario } from '@/types/usuario'

/**
 * Usuários de demonstração — não há SSO real integrado ainda (ver
 * docs/roteiro-fase-2.md), então o "login" apenas escolhe um destes.
 */
export const USUARIOS_DEMONSTRACAO: Usuario[] = [
  {
    id: 'demo-responsavel',
    nome: 'Responsável de Demonstração',
    matricula: '00000000001',
    email: 'responsavel.demo@sefaz.ma.gov.br',
    perfil: 'responsavel',
    areaId: 'cotec',
  },
  {
    id: 'demo-validador',
    nome: 'Validador de Demonstração',
    matricula: '00000000002',
    email: 'validador.demo@sefaz.ma.gov.br',
    perfil: 'validador',
  },
  {
    id: 'demo-admin',
    nome: 'Administrador de Demonstração',
    matricula: '00000000003',
    email: 'admin.demo@sefaz.ma.gov.br',
    perfil: 'admin',
  },
  {
    id: 'demo-auditor',
    nome: 'Auditor de Demonstração',
    matricula: '00000000004',
    email: 'auditor.demo@sefaz.ma.gov.br',
    perfil: 'auditor',
  },
]
