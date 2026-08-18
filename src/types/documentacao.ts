export type BlocoDoc =
  | { tipo: 'paragrafo'; texto: string }
  | { tipo: 'subtitulo'; texto: string }
  | { tipo: 'lista'; itens: string[] }
  | { tipo: 'passos'; itens: string[] }
  | { tipo: 'destaque'; texto: string }

export interface ArtigoDoc {
  id: string
  titulo: string
  /** Uma frase — aparece na sidebar e é usada na busca. */
  resumo: string
  blocos: BlocoDoc[]
}

export interface CategoriaDoc {
  id: string
  titulo: string
  artigos: ArtigoDoc[]
}
