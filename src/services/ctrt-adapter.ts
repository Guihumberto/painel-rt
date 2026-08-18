import type { Area } from '@/types/area'
import type { Atividade, Peso, TipoPrazo } from '@/types/activity'
import type { Mapeamento } from '@/types/mapeamento'
import { hashDeterministico } from '@/utils/hash'
import { criarAtividade, type RawAtividade } from '@/mocks/activity-builder'
import type { AreaRaw, AtividadeRaw, MapeamentoRaw } from './ctrt-types'

/** Áreas explicitamente coautoras, identificadas à mão a partir de menções
 * diretas no texto do guia (ex.: "Grupo Temático CEGPA, ASJUR, CSL") — não é
 * varredura automática porque a sigla de uma delas ("Cadastro") também é uma
 * palavra comum do português, o que geraria falsos positivos. */
const COLABORACOES: Record<string, string[]> = {
  'asjur-1': ['cegpa', 'csl'],
  'csl-2': ['cegpa', 'asjur'],
  'cegpa-1': ['csl', 'asjur'],
  'cadastro-3': ['cotec'],
}

const MESES: Record<string, number> = {
  jan: 1, janeiro: 1,
  fev: 2, fevereiro: 2,
  mar: 3, março: 3, marco: 3,
  abr: 4, abril: 4,
  mai: 5, maio: 5,
  jun: 6, junho: 6,
  jul: 7, julho: 7,
  ago: 8, agosto: 8,
  set: 9, setembro: 9,
  out: 10, outubro: 10,
  nov: 11, novembro: 11,
  dez: 12, dezembro: 12,
}

function pad(n: number): string {
  return String(n).padStart(2, '0')
}

/** Última data DD/MM/AAAA (ou DD.MM.AAAA) mencionada no texto. */
function extrairDataNumerica(texto: string): string | undefined {
  const matches = [...texto.matchAll(/(\d{1,2})[/.](\d{1,2})[/.](\d{4})/g)]
  if (matches.length === 0) return undefined
  const ultima = matches[matches.length - 1]
  const [, d, m, y] = ultima
  return `${y}-${pad(Number(m))}-${pad(Number(d))}`
}

/** "Mês/AAAA", ex.: "Abril/2026", "jan/2026". */
function extrairMesAno(texto: string): string | undefined {
  const match = texto.match(/([a-zçãé]+)\s*\/\s*(\d{4})/i)
  if (!match) return undefined
  const mes = MESES[match[1].toLowerCase()]
  if (!mes) return undefined
  return `${match[2]}-${pad(mes)}-01`
}

/** Ano isolado, ex.: "2027", "até 2027". */
function extrairAno(texto: string): string | undefined {
  const match = texto.match(/\b(20\d{2})\b/)
  if (!match) return undefined
  return `${match[1]}-12-31`
}

const SEM_DATA_RE = /não informad|pendente de defini|aguardando legisla|indetermin|sem data/i

/** Converte uma data do jeito que o documento real escreve para AAAA-MM-DD. */
export function parseDataAproximada(raw: string | null | undefined): string | undefined {
  if (!raw) return undefined
  if (SEM_DATA_RE.test(raw)) return undefined
  return extrairDataNumerica(raw) ?? extrairMesAno(raw) ?? extrairAno(raw)
}

const CONCLUIDA_RE = /finalizad|realizad/i
const CONTINUA_RE = /permanente|contínu|continu/i
/** "Aguardando legislação", "pendente de definição nacional" etc. — a atividade
 * está travada esperando algo externo, então ainda não começou de fato. */
const PENDENTE_RE = /aguardando|pendente de defini/i

const HORIZONTE_SEM_DATA = '2032-12-31'

interface DatasDerivadas {
  dataInicio?: string
  dataFim: string
  tipoPrazo: TipoPrazo
  estado: 'concluida' | 'planejada' | 'em-andamento'
  concluidaEm?: string
}

/**
 * Estado, quando não é explicitamente "concluída": "planejada" (ainda não
 * começou — texto diz que está esperando algo, ou a data de início é futura)
 * ou "em-andamento" (já começou). "Atrasada" não é decidido aqui — é
 * sobreposto automaticamente por `useStatusAtividade` quando o prazo já
 * passou, então uma atividade "planejada" com prazo vencido também aparece
 * atrasada, corretamente.
 */
function derivarEstadoNaoConcluido(
  textoCompleto: string,
  dataInicio: string | undefined,
  hoje: Date,
): 'planejada' | 'em-andamento' {
  if (PENDENTE_RE.test(textoCompleto)) return 'planejada'
  if (dataInicio && new Date(`${dataInicio}T00:00:00`) > hoje) return 'planejada'
  return 'em-andamento'
}

function derivarDatas(raw: AtividadeRaw, hoje: Date): DatasDerivadas {
  const dataInicio = parseDataAproximada(raw.dataInicio)
  const fimParseado = parseDataAproximada(raw.dataFim)
  const textoCompleto = `${raw.dataInicio ?? ''} ${raw.dataFim ?? ''}`

  // "Finalizado" / "Realizado em ..." é o único sinal real de conclusão no
  // documento-fonte — nenhuma outra atividade é tratada como concluída por
  // suposição, mesmo que o prazo já tenha passado (isso apenas a deixa
  // "atrasada", que é a leitura honesta de um prazo real já vencido).
  if (raw.dataFim && CONCLUIDA_RE.test(raw.dataFim)) {
    const concluidaEm = extrairDataNumerica(raw.dataFim) ?? fimParseado ?? dataInicio
    return {
      dataInicio,
      dataFim: concluidaEm ?? HORIZONTE_SEM_DATA,
      tipoPrazo: dataInicio ? 'janela' : 'data-limite',
      estado: 'concluida',
      concluidaEm,
    }
  }

  if (CONTINUA_RE.test(textoCompleto)) {
    return {
      dataInicio,
      dataFim: fimParseado ?? HORIZONTE_SEM_DATA,
      tipoPrazo: 'continua',
      estado: derivarEstadoNaoConcluido(textoCompleto, dataInicio, hoje),
    }
  }

  if (fimParseado) {
    return {
      dataInicio,
      dataFim: fimParseado,
      tipoPrazo: dataInicio ? 'janela' : 'data-limite',
      estado: derivarEstadoNaoConcluido(textoCompleto, dataInicio, hoje),
    }
  }

  // Nem início nem fim identificáveis (ex.: "Pendente de definição nacional")
  // — tratada como ação de horizonte longo, sem prazo fechado ainda.
  return {
    dataInicio,
    dataFim: HORIZONTE_SEM_DATA,
    tipoPrazo: 'continua',
    estado: derivarEstadoNaoConcluido(textoCompleto, dataInicio, hoje),
  }
}

/**
 * Peso (1–3) não existe no documento-fonte — é uma heurística de
 * demonstração baseada na extensão do resultado esperado e no horizonte da
 * atividade, só para o índice de cumprimento ter alguma variação.
 */
function derivarPeso(raw: AtividadeRaw, datas: DatasDerivadas): Peso {
  const tamanhoTexto = raw.resultadoEsperado?.length ?? raw.titulo.length
  let spanDias = 0
  if (datas.dataInicio) {
    spanDias = (new Date(datas.dataFim).getTime() - new Date(datas.dataInicio).getTime()) / 86_400_000
  }
  if (tamanhoTexto > 180 || spanDias > 730) return 3
  if (tamanhoTexto > 60 || spanDias > 120) return 2
  return 1
}

function derivarInteressados(id: string): number {
  return hashDeterministico(id) % 42
}

/** Escolhe um impacto do mapeamento da área, alternando entre os disponíveis por atividade. */
function impactoDaArea(mapeamentos: Mapeamento[], indice: number): string {
  if (mapeamentos.length === 0) return 'Impacto institucional decorrente da Reforma Tributária.'
  const entrada = mapeamentos[indice % mapeamentos.length]
  return entrada.impacto ?? entrada.oportunidade ?? entrada.risco ?? 'Impacto institucional decorrente da Reforma Tributária.'
}

export function transformarArea(raw: AreaRaw, colorIndex: number): Area {
  return {
    id: raw.id,
    sigla: raw.sigla,
    nome: raw.nome,
    responsaveis: [`Equipe ${raw.sigla}`],
    colorIndex,
  }
}

export function transformarMapeamento(raw: MapeamentoRaw): Mapeamento {
  return {
    id: raw.id,
    areaId: raw.areaId,
    impacto: raw.impacto ?? undefined,
    risco: raw.risco ?? undefined,
    oportunidade: raw.oportunidade ?? undefined,
  }
}

export function transformarAtividade(
  raw: AtividadeRaw,
  indiceNaArea: number,
  mapeamentosDaArea: Mapeamento[],
  hoje: Date = new Date(),
): Atividade {
  const datas = derivarDatas(raw, hoje)
  const peso = derivarPeso(raw, datas)

  const rawAtividade: RawAtividade = {
    areaLiderId: raw.areaId,
    areasParceirasIds: COLABORACOES[raw.id],
    titulo: raw.titulo,
    descricao: raw.resultadoEsperado ?? raw.titulo,
    tipoPrazo: datas.tipoPrazo,
    dataInicio: datas.dataInicio,
    dataFim: datas.dataFim,
    oQueMuda: raw.resultadoEsperado ?? raw.titulo,
    impacto: impactoDaArea(mapeamentosDaArea, indiceNaArea),
    peso,
    estado: datas.estado,
    concluidaEm: datas.concluidaEm,
    interessados: derivarInteressados(raw.id),
  }

  return criarAtividade(rawAtividade, raw.id)
}
