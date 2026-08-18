import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Usuario, UsuarioFormInput } from '@/types/usuario'
import { USUARIOS_DEMONSTRACAO } from '@/mocks/usuarios.mock'

const STORAGE_KEY = 'painel-rt:usuarios'

function lerLocal(): Usuario[] {
  try {
    const bruto = localStorage.getItem(STORAGE_KEY)
    return bruto ? (JSON.parse(bruto) as Usuario[]) : USUARIOS_DEMONSTRACAO
  } catch {
    return USUARIOS_DEMONSTRACAO
  }
}

/** Usuários de demonstração — sem SSO real integrado ainda (ver
 * docs/roteiro-fase-2.md), o CRUD daqui é quem alimenta as opções de login. */
export const useUsuariosStore = defineStore('usuarios', () => {
  const usuarios = ref<Usuario[]>(lerLocal())

  function salvarLocal(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(usuarios.value))
  }

  function getById(id: string): Usuario | undefined {
    return usuarios.value.find((u) => u.id === id)
  }

  function criarUsuario(dados: UsuarioFormInput): void {
    usuarios.value = [...usuarios.value, { id: `usuario-${Date.now()}`, ...dados }]
    salvarLocal()
  }

  function atualizarUsuario(id: string, dados: UsuarioFormInput): void {
    const usuario = getById(id)
    if (!usuario) return
    Object.assign(usuario, dados)
    salvarLocal()
  }

  function excluirUsuario(id: string): void {
    usuarios.value = usuarios.value.filter((u) => u.id !== id)
    salvarLocal()
  }

  return { usuarios, getById, criarUsuario, atualizarUsuario, excluirUsuario }
})
