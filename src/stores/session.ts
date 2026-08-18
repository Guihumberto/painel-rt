import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { Usuario } from '@/types/usuario'

const STORAGE_KEY = 'painel-rt:sessao'

function lerUsuario(): Usuario | null {
  try {
    const bruto = localStorage.getItem(STORAGE_KEY)
    return bruto ? (JSON.parse(bruto) as Usuario) : null
  } catch {
    return null
  }
}

/**
 * Sessão simulada — não há campo de senha porque, no fluxo real (SSO/Keycloak
 * da SEFAZ-MA), esta aplicação nunca coleta credenciais: só recebe um token de
 * volta. Ver docs/roteiro-fase-2.md, seção "SSO real (COTEC/Keycloak)".
 */
export const useSessionStore = defineStore('session', () => {
  const usuarioAtual = ref<Usuario | null>(lerUsuario())

  const estaLogado = computed(() => usuarioAtual.value !== null)

  function entrarComo(usuario: Usuario): void {
    usuarioAtual.value = usuario
    localStorage.setItem(STORAGE_KEY, JSON.stringify(usuario))
  }

  function sair(): void {
    usuarioAtual.value = null
    localStorage.removeItem(STORAGE_KEY)
  }

  return { usuarioAtual, estaLogado, entrarComo, sair }
})
