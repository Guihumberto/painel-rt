import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { AlteracaoAtividade } from '@/types/historico'
import type { Atividade, AtividadeFormInput } from '@/types/activity'

const STORAGE_KEY = 'painel-rt:historico'

function lerHistoricoLocal(): AlteracaoAtividade[] {
  try {
    const bruto = localStorage.getItem(STORAGE_KEY)
    return bruto ? (JSON.parse(bruto) as AlteracaoAtividade[]) : []
  } catch {
    return []
  }
}

const ROTULOS: Record<keyof AtividadeFormInput, string> = {
  titulo: 'Título',
  descricao: 'Descrição',
  oQueMuda: 'O que muda',
  impacto: 'Impacto',
  tipoPrazo: 'Tipo de prazo',
  dataInicio: 'Início',
  dataFim: 'Prazo final',
  peso: 'Peso',
  areasParceirasIds: 'Áreas parceiras',
}

function paraTexto(valor: unknown): string {
  if (Array.isArray(valor)) return valor.length > 0 ? valor.join(', ') : '—'
  return valor === undefined || valor === '' ? '—' : String(valor)
}

/** Data no formato AAAA-MM-DD, mesma convenção usada em todo o resto do
 * modelo (`Atividade.criadaEm`, `Andamento.data`, `Comprovacao.data`) —
 * um ISO completo aqui quebraria `formatar()` na trilha de auditoria. */
function hoje(): string {
  return new Date().toISOString().slice(0, 10)
}

/** Histórico de alterações de atividades — trilha de "o que mudou", separada
 * da própria `Atividade` pra não inchar o objeto principal com um log que
 * cresce indefinidamente. */
export const useHistoricoStore = defineStore('historico', () => {
  const registros = ref<AlteracaoAtividade[]>(lerHistoricoLocal())

  function salvarLocal(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(registros.value))
  }

  function registrarCriacao(atividadeId: string, autor: string): void {
    registros.value = [
      ...registros.value,
      {
        id: `${atividadeId}-hist-${Date.now()}`,
        atividadeId,
        campo: 'cadastro',
        rotuloCampo: 'Cadastro',
        valorAnterior: '—',
        valorNovo: 'Atividade cadastrada',
        autor,
        data: hoje(),
      },
    ]
    salvarLocal()
  }

  /** Compara `dados` contra os valores atuais de `atividade` — chamar
   * ANTES de sobrescrever os campos, senão o valor antigo já se perdeu. */
  function registrarEdicao(atividade: Atividade, dados: AtividadeFormInput, autor: string): void {
    const novos: AlteracaoAtividade[] = []
    ;(Object.keys(ROTULOS) as Array<keyof AtividadeFormInput>).forEach((campo) => {
      const antes = paraTexto(atividade[campo])
      const depois = paraTexto(dados[campo])
      if (antes === depois) return
      novos.push({
        id: `${atividade.id}-hist-${Date.now()}-${campo}`,
        atividadeId: atividade.id,
        campo,
        rotuloCampo: ROTULOS[campo],
        valorAnterior: antes,
        valorNovo: depois,
        autor,
        data: hoje(),
      })
    })
    if (novos.length === 0) return
    registros.value = [...registros.value, ...novos]
    salvarLocal()
  }

  function porAtividade(atividadeId: string): AlteracaoAtividade[] {
    return registros.value
      .filter((r) => r.atividadeId === atividadeId)
      .sort((a, b) => (a.data < b.data ? -1 : 1))
  }

  return { registros, registrarCriacao, registrarEdicao, porAtividade }
})
