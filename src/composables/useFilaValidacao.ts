import type { Atividade } from '@/types/activity'
import type { Area } from '@/types/area'
import { useAreasStore } from '@/stores/areas'
import { diasUteisDesde } from './useSla'

export interface ItemFilaValidacao {
  atividade: Atividade
  area: Area | undefined
  dias: number
}

/**
 * Atividades `em-validacao` de todas as áreas, com dias úteis de espera —
 * reaproveitado pela fila do Validador (`ValidacaoView.vue`) e pelo painel
 * do Auditor (`AuditoriaView.vue`), que só lê, sem oferecer as ações.
 */
export function filaDeValidacao(atividades: Atividade[]): ItemFilaValidacao[] {
  const areasStore = useAreasStore()
  return atividades
    .filter((a) => a.estado === 'em-validacao')
    .map((atividade) => ({
      atividade,
      area: areasStore.getById(atividade.areaLiderId),
      dias: atividade.entrouEmValidacaoEm ? diasUteisDesde(atividade.entrouEmValidacaoEm) : 0,
    }))
    .sort((a, b) => ((a.atividade.entrouEmValidacaoEm ?? '') < (b.atividade.entrouEmValidacaoEm ?? '') ? -1 : 1))
}
