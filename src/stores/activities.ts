import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type {
  Andamento,
  Atividade,
  AtividadeFormInput,
  AtualizacaoInput,
  Validacao,
  ValidacaoInput,
} from '@/types/activity'
import { fetchAtividadesRaw } from '@/services/ctrt-api'
import { transformarAtividade } from '@/services/ctrt-adapter'
import { criarAtividade } from '@/mocks/activity-builder'
import { useMapeamentosStore } from './mapeamentos'
import { useHistoricoStore } from './historico'

const STORAGE_KEY = 'painel-rt:atividades'

/** Formato como pode ter sido salvo por uma versão anterior do app — sem
 * backend/migração de verdade, o localStorage do navegador do usuário pode
 * ficar defasado em relação ao schema atual de `Atividade`. */
interface AtividadeLocalLegada extends Omit<Atividade, 'validacoes' | 'andamentos'> {
  validacao?: Validacao
  validacoes?: Validacao[]
  andamentos?: Array<Omit<Andamento, 'tipo'> & { tipo?: Andamento['tipo'] }>
}

/** Preenche campos que passaram a existir depois que o item foi salvo — ver
 * `AtividadeLocalLegada`. Sem isso, uma atividade cadastrada/atualizada numa
 * sessão anterior ao schema atual quebra qualquer leitura de `validacoes`
 * ou `andamento.tipo`. */
function normalizarAtividade(bruta: AtividadeLocalLegada): Atividade {
  return {
    ...bruta,
    validacoes: bruta.validacoes ?? (bruta.validacao ? [bruta.validacao] : []),
    andamentos: (bruta.andamentos ?? []).map((a) => ({ ...a, tipo: a.tipo ?? 'atualizacao' })),
  } as Atividade
}

function lerAtividadesLocais(): Atividade[] | null {
  try {
    const bruto = localStorage.getItem(STORAGE_KEY)
    if (!bruto) return null
    const itens = JSON.parse(bruto) as AtividadeLocalLegada[]
    return itens.map(normalizarAtividade)
  } catch {
    return null
  }
}

function hoje(): string {
  return new Date().toISOString().slice(0, 10)
}

export const useActivitiesStore = defineStore('activities', () => {
  const atividades = ref<Atividade[]>([])
  const loading = ref(false)
  const carregado = ref(false)

  /**
   * Substituto temporário até existir backend: qualquer mutação (criar,
   * editar) grava o array inteiro no localStorage. Trocar por chamadas de
   * API é trocar só estas duas funções, do mesmo jeito que trocar
   * `ctrt-api.ts` troca a fonte de leitura.
   */
  function salvarLocalAteExistirBackend(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(atividades.value))
  }

  async function fetchAtividades(): Promise<void> {
    if (carregado.value || loading.value) return
    loading.value = true

    const atividadesLocais = lerAtividadesLocais()
    if (atividadesLocais) {
      atividades.value = atividadesLocais
      loading.value = false
      carregado.value = true
      return
    }

    const mapeamentosStore = useMapeamentosStore()
    const [atividadesRaw] = await Promise.all([
      fetchAtividadesRaw(),
      mapeamentosStore.fetchMapeamentos(),
    ])

    const contadorPorArea = new Map<string, number>()
    atividades.value = atividadesRaw.map((raw) => {
      const indiceNaArea = contadorPorArea.get(raw.areaId) ?? 0
      contadorPorArea.set(raw.areaId, indiceNaArea + 1)
      return transformarAtividade(raw, indiceNaArea, mapeamentosStore.porArea(raw.areaId))
    })

    loading.value = false
    carregado.value = true
  }

  function getById(id: string): Atividade | undefined {
    return atividades.value.find((a) => a.id === id)
  }

  function porArea(areaId: string) {
    return computed(() =>
      atividades.value.filter(
        (a) => a.areaLiderId === areaId || a.areasParceirasIds.includes(areaId),
      ),
    )
  }

  function cadastrarAtividade(areaId: string, dados: AtividadeFormInput, autor: string): void {
    const id = `${areaId}-novo-${Date.now()}`
    const nova = criarAtividade(
      {
        areaLiderId: areaId,
        areasParceirasIds: dados.areasParceirasIds,
        titulo: dados.titulo,
        descricao: dados.descricao,
        tipoPrazo: dados.tipoPrazo,
        dataInicio: dados.dataInicio,
        dataFim: dados.dataFim,
        oQueMuda: dados.oQueMuda,
        impacto: dados.impacto,
        peso: dados.peso,
        estado: 'planejada',
        criadaEm: hoje(),
      },
      id,
    )
    atividades.value = [...atividades.value, nova]
    useHistoricoStore().registrarCriacao(id, autor)
    salvarLocalAteExistirBackend()
  }

  function atualizarAtividade(id: string, dados: AtividadeFormInput, autor: string): void {
    const atividade = getById(id)
    if (!atividade) return
    useHistoricoStore().registrarEdicao(atividade, dados, autor)
    atividade.titulo = dados.titulo
    atividade.descricao = dados.descricao
    atividade.oQueMuda = dados.oQueMuda
    atividade.impacto = dados.impacto
    atividade.tipoPrazo = dados.tipoPrazo
    atividade.dataInicio = dados.dataInicio
    atividade.dataFim = dados.dataFim
    atividade.peso = dados.peso
    atividade.areasParceirasIds = dados.areasParceirasIds
    salvarLocalAteExistirBackend()
  }

  /**
   * Registra uma atualização de andamento com artefato pareado. Só 'inicio'
   * e 'conclusao' mudam `estado` — 'paralisacao' é só uma marcação visível
   * na linha do tempo (ver types/activity.ts).
   */
  function registrarAtualizacao(atividadeId: string, input: AtualizacaoInput, autor: string): void {
    const atividade = getById(atividadeId)
    if (!atividade) return

    const data = hoje()
    const andamentoId = `${atividadeId}-and-${Date.now()}`
    atividade.andamentos = [
      ...atividade.andamentos,
      { id: andamentoId, atividadeId, texto: input.texto, data, autor, tipo: input.tipo },
    ]
    atividade.comprovacoes = [
      ...atividade.comprovacoes,
      {
        id: `${atividadeId}-comp-${Date.now()}`,
        atividadeId,
        andamentoId,
        tipo: input.artefato.tipo,
        nome: input.artefato.nome,
        url: input.artefato.url,
        data,
        autor,
        publica: input.tipo === 'conclusao',
      },
    ]

    if (input.tipo === 'inicio') {
      atividade.estado = 'em-andamento'
    }
    if (input.tipo === 'conclusao') {
      atividade.estado = 'em-validacao'
      atividade.entrouEmValidacaoEm = data
      atividade.resumoPublico = input.resumoPublico
    }

    salvarLocalAteExistirBackend()
  }

  /**
   * Etapa 3/4 da especificação: aprovar publica (estado vira 'concluida', o
   * que já basta pra feed/ranking/índice reagirem — são projeções do
   * estado); devolver manda de volta pro Responsável com a justificativa
   * registrada em `validacoes` (nunca sobrescrita — cada ciclo fica).
   */
  function aplicarValidacao(
    atividadeId: string,
    input: ValidacaoInput,
    validador: string,
  ): void {
    const atividade = getById(atividadeId)
    if (!atividade) return

    const data = hoje()
    atividade.validacoes = [
      ...atividade.validacoes,
      {
        id: `${atividadeId}-val-${Date.now()}`,
        atividadeId,
        decisao: input.decisao,
        validador,
        data,
        observacao: input.observacao,
      },
    ]

    if (input.decisao === 'aprovada' || input.decisao === 'aprovada-com-edicao') {
      atividade.estado = 'concluida'
      atividade.concluidaEm = data
      atividade.antecipada = data < atividade.dataFim
      if (input.decisao === 'aprovada-com-edicao' && input.resumoPublico) {
        atividade.resumoPublico = input.resumoPublico
      }
    } else {
      atividade.estado = 'em-andamento'
      atividade.entrouEmValidacaoEm = undefined
    }

    salvarLocalAteExistirBackend()
  }

  return {
    atividades,
    loading,
    carregado,
    fetchAtividades,
    getById,
    porArea,
    cadastrarAtividade,
    atualizarAtividade,
    registrarAtualizacao,
    aplicarValidacao,
  }
})
