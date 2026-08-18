import { ref } from 'vue'
import { defineStore } from 'pinia'

export type Tema = 'claro' | 'escuro'

const STORAGE_KEY = 'painel-rt:tema'

function lerEscolhaSalva(): Tema | null {
  try {
    const bruto = localStorage.getItem(STORAGE_KEY)
    return bruto === 'claro' || bruto === 'escuro' ? bruto : null
  } catch {
    return null
  }
}

function prefereEscuro(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

/**
 * Tema claro/escuro — antes de qualquer escolha explícita, segue
 * `prefers-color-scheme` do sistema (nada gravado, `index.html` também não
 * aplica `data-theme`, então o CSS cuida sozinho via media query). Ao
 * alternar, grava a escolha em localStorage e passa a aplicar
 * `data-theme` no `<html>`, que vence a preferência do sistema dos dois lados.
 */
export const useTemaStore = defineStore('tema', () => {
  const escolhaSalva = ref<Tema | null>(lerEscolhaSalva())
  const tema = ref<Tema>(escolhaSalva.value ?? (prefereEscuro() ? 'escuro' : 'claro'))

  function alternar(): void {
    tema.value = tema.value === 'escuro' ? 'claro' : 'escuro'
    escolhaSalva.value = tema.value
    localStorage.setItem(STORAGE_KEY, tema.value)
    document.documentElement.setAttribute('data-theme', tema.value)
  }

  return { tema, alternar }
})
