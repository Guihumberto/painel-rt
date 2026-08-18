import type { BlocoDoc, CategoriaDoc } from '@/types/documentacao'

const DIACRITICOS = /[̀-ͯ]/g

function normalizar(texto: string): string {
  return texto.normalize('NFD').replace(DIACRITICOS, '').toLowerCase()
}

function textoDoBloco(bloco: BlocoDoc): string {
  if (bloco.tipo === 'lista' || bloco.tipo === 'passos') return bloco.itens.join(' ')
  return bloco.texto
}

/** Filtra por título/resumo/conteúdo dos blocos, sem diferenciar acento/caixa;
 * categoria some da lista se nenhum artigo dela sobrar. Termo vazio devolve tudo. */
export function buscar(categorias: CategoriaDoc[], termo: string): CategoriaDoc[] {
  const alvo = normalizar(termo.trim())
  if (!alvo) return categorias

  return categorias
    .map((categoria) => ({
      ...categoria,
      artigos: categoria.artigos.filter((artigo) => {
        const textoCompleto = normalizar(
          [artigo.titulo, artigo.resumo, ...artigo.blocos.map(textoDoBloco)].join(' '),
        )
        return textoCompleto.includes(alvo)
      }),
    }))
    .filter((categoria) => categoria.artigos.length > 0)
}
