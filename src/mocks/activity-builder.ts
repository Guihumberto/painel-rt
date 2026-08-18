import type {
  Andamento,
  Atividade,
  Comprovacao,
  EstadoAtividade,
  Peso,
  TipoPrazo,
  Validacao,
} from '@/types/activity'

export interface RawAtividade {
  areaLiderId: string
  areasParceirasIds?: string[]
  titulo: string
  descricao: string
  tipoPrazo: TipoPrazo
  dataInicio?: string
  dataFim: string
  oQueMuda: string
  impacto: string
  peso: Peso
  /** Nunca "atrasada" aqui — esse estado é derivado por data (ver useStatusAtividade). */
  estado: Exclude<EstadoAtividade, 'atrasada'>
  antecipada?: boolean
  concluidaEm?: string
  criadaEm?: string
  interessados?: number
  validador?: string
  edicaoNaValidacao?: boolean
}

const ANDAMENTO_TEXTOS = [
  'Levantamento inicial concluído e cronograma validado com a equipe.',
  'Etapa de execução iniciada; primeiros resultados parciais registrados.',
  'Consolidação dos entregáveis intermediários em curso.',
  'Ajustes finais e revisão de qualidade antes do encerramento.',
]

function deslocarData(base: string, dias: number): string {
  const data = new Date(`${base}T12:00:00`)
  data.setDate(data.getDate() + dias)
  return data.toISOString().slice(0, 10)
}

function criarAndamentos(raw: RawAtividade, atividadeId: string): Andamento[] {
  if (raw.estado === 'planejada') return []
  const quantidade = raw.estado === 'em-andamento' ? 2 : 3
  const inicio = raw.dataInicio ?? deslocarData(raw.dataFim, -90)
  return ANDAMENTO_TEXTOS.slice(0, quantidade).map((texto, i) => ({
    id: `${atividadeId}-and-${i + 1}`,
    atividadeId,
    texto,
    data: deslocarData(inicio, 18 * (i + 1)),
    autor: raw.areaLiderId.toUpperCase(),
    tipo: i === 0 ? 'inicio' : 'atualizacao',
  }))
}

function criarComprovacoes(raw: RawAtividade, atividadeId: string): Comprovacao[] {
  if (raw.estado !== 'em-validacao' && raw.estado !== 'concluida') return []
  return [
    {
      id: `${atividadeId}-comp-1`,
      atividadeId,
      tipo: 'pdf',
      nome: 'Relatório de execução.pdf',
      data: raw.concluidaEm ?? deslocarData(raw.dataFim, -5),
      autor: raw.areaLiderId.toUpperCase(),
      publica: raw.estado === 'concluida',
    },
  ]
}

function criarValidacoes(raw: RawAtividade, atividadeId: string): Validacao[] {
  if (raw.estado !== 'concluida') return []
  return [
    {
      id: `${atividadeId}-val-1`,
      atividadeId,
      decisao: raw.edicaoNaValidacao ? 'aprovada-com-edicao' : 'aprovada',
      validador: raw.validador ?? 'Validador Central',
      data: raw.concluidaEm ?? raw.dataFim,
      observacao: raw.edicaoNaValidacao
        ? 'Texto da notícia ajustado para maior clareza junto ao público.'
        : undefined,
    },
  ]
}

export function criarAtividade(raw: RawAtividade, id: string): Atividade {
  return {
    id,
    areaLiderId: raw.areaLiderId,
    areasParceirasIds: raw.areasParceirasIds ?? [],
    titulo: raw.titulo,
    descricao: raw.descricao,
    tipoPrazo: raw.tipoPrazo,
    dataInicio: raw.dataInicio,
    dataFim: raw.dataFim,
    oQueMuda: raw.oQueMuda,
    impacto: raw.impacto,
    peso: raw.peso,
    estado: raw.estado,
    criadaEm: raw.criadaEm ?? '2025-09-01',
    concluidaEm: raw.concluidaEm,
    antecipada: raw.antecipada ?? false,
    andamentos: criarAndamentos(raw, id),
    comprovacoes: criarComprovacoes(raw, id),
    validacoes: criarValidacoes(raw, id),
    interessados: raw.interessados ?? 0,
  }
}
