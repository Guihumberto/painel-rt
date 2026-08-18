/**
 * Seção 4 da especificação: "SLA de validação: 5 dias úteis (configurável)"
 * — o valor em si mora em `Parametro.slaDiasUteis` (stores/parametros.ts),
 * administrável; aqui fica só o cálculo puro de dias úteis.
 */

/** Conta dias úteis (pula sáb/dom) entre `dataInicioIso` (AAAA-MM-DD) e `hoje`. */
export function diasUteisDesde(dataInicioIso: string, hoje: Date = new Date()): number {
  const cursor = new Date(`${dataInicioIso}T00:00:00`)
  let contador = 0
  while (cursor < hoje) {
    cursor.setDate(cursor.getDate() + 1)
    const diaSemana = cursor.getDay()
    if (diaSemana !== 0 && diaSemana !== 6) contador++
  }
  return contador
}
