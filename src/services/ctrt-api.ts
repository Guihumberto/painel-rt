import type { AreaRaw, AtividadeRaw, MapeamentoRaw } from './ctrt-types'

/**
 * Simula chamadas a um backend real: os dados vivem em `public/data/*.json` e
 * são buscados por HTTP, como uma API responderia. Trocar por uma API de
 * verdade depois é só trocar a URL abaixo — nada mais no app muda.
 */
async function fetchJson<T>(caminho: string): Promise<T> {
  const resposta = await fetch(caminho)
  if (!resposta.ok) {
    throw new Error(`Falha ao buscar ${caminho}: ${resposta.status}`)
  }
  return resposta.json() as Promise<T>
}

export function fetchAreasRaw(): Promise<AreaRaw[]> {
  return fetchJson<AreaRaw[]>('/data/areas.json')
}

export function fetchMapeamentosRaw(): Promise<MapeamentoRaw[]> {
  return fetchJson<MapeamentoRaw[]>('/data/mapeamentos.json')
}

export function fetchAtividadesRaw(): Promise<AtividadeRaw[]> {
  return fetchJson<AtividadeRaw[]>('/data/atividades.json')
}
