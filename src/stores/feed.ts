import { computed } from 'vue'
import { defineStore } from 'pinia'
import type { Publicacao } from '@/types/publication'
import { useActivitiesStore } from './activities'

/**
 * O feed é uma projeção das atividades concluídas — não tem fonte própria.
 * Isso evita manter uma lista separada de "notícias" que podia ficar
 * dessincronizada da atividade real que a originou.
 */
export const useFeedStore = defineStore('feed', () => {
  const activitiesStore = useActivitiesStore()

  const publicacoes = computed<Publicacao[]>(() =>
    activitiesStore.atividades
      .filter((a) => a.estado === 'concluida')
      .map((atividade) => {
        const publicadoEm = atividade.concluidaEm ?? atividade.dataFim
        return {
          id: `pub-${atividade.id}`,
          atividadeId: atividade.id,
          areaIds: [atividade.areaLiderId, ...atividade.areasParceirasIds],
          tituloNoticia: atividade.titulo,
          oQueMuda: atividade.resumoPublico ?? atividade.oQueMuda,
          impacto: atividade.impacto,
          publicadoEm,
          seloContexto: atividade.antecipada ? 'antecipada' : 'no-prazo',
          validadorResponsavel: atividade.validacoes.at(-1)?.validador ?? 'Validador Central',
          comprovacoesPublicas: atividade.comprovacoes.filter((c) => c.publica).map((c) => c.nome),
        } satisfies Publicacao
      })
      .sort((a, b) => (a.publicadoEm < b.publicadoEm ? 1 : -1)),
  )

  /** Mantido por compatibilidade com quem chama isto no onMounted — o feed já
   * é derivado das atividades, então só garante que elas estejam carregadas. */
  async function fetchPublicacoes(): Promise<void> {
    await activitiesStore.fetchAtividades()
  }

  function porArea(areaId: string): Publicacao[] {
    return publicacoes.value.filter((p) => p.areaIds.includes(areaId))
  }

  return { publicacoes, fetchPublicacoes, porArea }
})
