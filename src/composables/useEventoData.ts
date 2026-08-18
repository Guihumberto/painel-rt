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
