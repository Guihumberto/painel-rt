import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

export interface IdentidadeInstitucional {
  nomePainelPrefixo: string
  nomePainelDestaque: string
  comiteSigla: string
  comiteNome: string
  orgaoSigla: string
  orgaoNome: string
}

const PADRAO: IdentidadeInstitucional = {
  nomePainelPrefixo: 'Painel de Governança',
  nomePainelDestaque: '',
  comiteSigla: 'CTRT',
  comiteNome: 'Comitê Técnico da Reforma Tributária',
  orgaoSigla: 'SEFAZ/MA',
  orgaoNome: 'Secretaria de Fazenda do Estado do Maranhão',
}

/**
 * Identidade institucional (nome do painel, comitê, órgão) — centralizada
 * aqui em vez de espalhada em textos fixos pelos componentes, para que possa
 * ser administrada num só lugar (e futuramente editada por uma tela de
 * administração, sem tocar em componente). `nomePainelDestaque` é a palavra
 * final do nome que recebe o realce em latão no cabeçalho (ex.: "RT").
 */
export const useInstitucionalStore = defineStore('institucional', () => {
  const nomePainelPrefixo = ref(PADRAO.nomePainelPrefixo)
  const nomePainelDestaque = ref(PADRAO.nomePainelDestaque)
  const comiteSigla = ref(PADRAO.comiteSigla)
  const comiteNome = ref(PADRAO.comiteNome)
  const orgaoSigla = ref(PADRAO.orgaoSigla)
  const orgaoNome = ref(PADRAO.orgaoNome)

  const nomePainel = computed(() => `${nomePainelPrefixo.value} ${nomePainelDestaque.value}`)
  const comiteCompleto = computed(() => `${comiteSigla.value} · ${comiteNome.value}`)

  function atualizarIdentidade(patch: Partial<IdentidadeInstitucional>): void {
    if (patch.nomePainelPrefixo !== undefined) nomePainelPrefixo.value = patch.nomePainelPrefixo
    if (patch.nomePainelDestaque !== undefined) nomePainelDestaque.value = patch.nomePainelDestaque
    if (patch.comiteSigla !== undefined) comiteSigla.value = patch.comiteSigla
    if (patch.comiteNome !== undefined) comiteNome.value = patch.comiteNome
    if (patch.orgaoSigla !== undefined) orgaoSigla.value = patch.orgaoSigla
    if (patch.orgaoNome !== undefined) orgaoNome.value = patch.orgaoNome
  }

  return {
    nomePainelPrefixo,
    nomePainelDestaque,
    comiteSigla,
    comiteNome,
    orgaoSigla,
    orgaoNome,
    nomePainel,
    comiteCompleto,
    atualizarIdentidade,
  }
})
