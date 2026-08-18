/** Formato bruto tal como um backend real serviria (ver public/data/*.json). */

export interface AreaRaw {
  id: string
  sigla: string
  nome: string
  descricao: string
}

export interface MapeamentoRaw {
  id: string
  areaId: string
  impacto: string | null
  risco: string | null
  oportunidade: string | null
}

export interface AtividadeRaw {
  id: string
  areaId: string
  titulo: string
  resultadoEsperado: string | null
  /** Datas como no documento original — nem sempre "DD/MM/AAAA" (ex.: "Abril/2026", "Em andamento", "-"). */
  dataInicio: string | null
  dataFim: string | null
}
