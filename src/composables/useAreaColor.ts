const LIGHTNESS = 46
const CHROMA = 0.08

/**
 * Paleta fixa e curada — faixa "fria" do círculo cromático (teal a rosa-antigo),
 * deliberadamente fora das faixas já usadas por semântica (vermelho/âmbar/verde
 * dos status, dourado do brass), pra nunca ser confundida com elas. Cíclica:
 * com mais áreas que cores, tons se repetem — a sigla ao lado do tom é sempre
 * o identificador principal, a cor é só um reforço visual secundário.
 */
const PALETA_HUES = [175, 198, 220, 243, 265, 288, 310, 333]

export interface AreaColor {
  hue: number
  fg: string
  bg: string
}

export function useAreaColor(colorIndex: number): AreaColor {
  const hue = PALETA_HUES[colorIndex % PALETA_HUES.length]
  const cor = `oklch(${LIGHTNESS}% ${CHROMA} ${hue})`
  return { hue, fg: cor, bg: cor }
}
