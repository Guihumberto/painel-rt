/** Dias entre hoje e a data do evento (AAAA-MM-DD) — negativo se já passou, 0 se é hoje. */
export function diasRestantesEvento(dataIso: string, hoje: Date = new Date()): number {
  const hojeMeiaNoite = new Date(hoje)
  hojeMeiaNoite.setHours(0, 0, 0, 0)
  const meiaNoiteEvento = new Date(`${dataIso}T00:00:00`)
  return Math.round((meiaNoiteEvento.getTime() - hojeMeiaNoite.getTime()) / 86_400_000)
}

export type EstadoTemporalEvento = 'hoje' | 'futuro' | 'passado'

/** Classifica o evento em relação a hoje — dirige a cor (latão/verde/neutro) dos indicadores de data. */
export function estadoTemporalEvento(diasRestantes: number): EstadoTemporalEvento {
  if (diasRestantes === 0) return 'hoje'
  return diasRestantes > 0 ? 'futuro' : 'passado'
}

export interface PartesDataEvento {
  dia: string
  mes: string
  ano: number
}

/** Dia/mês/ano soltos — alimenta o bloco de data ink+latão (o "carimbo") reaproveitado em vários lugares. */
export function partesDataEvento(dataIso: string): PartesDataEvento {
  const data = new Date(`${dataIso}T12:00:00`)
  return {
    dia: new Intl.DateTimeFormat('pt-BR', { day: '2-digit' }).format(data),
    mes: new Intl.DateTimeFormat('pt-BR', { month: 'short' }).format(data).replace('.', ''),
    ano: data.getFullYear(),
  }
}

/** Data por extenso, ex.: "terça-feira, 01 de setembro de 2026". */
export function dataExtensaEvento(dataIso: string): string {
  return new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' }).format(
    new Date(`${dataIso}T12:00:00`),
  )
}
