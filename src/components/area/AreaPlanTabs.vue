<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { Atividade } from '@/types/activity'
import type { Area } from '@/types/area'
import { foiDevolvida, getStatusAtividade, venceEsteMes, type StatusCor } from '@/composables/useStatusAtividade'
import { useAreasStore } from '@/stores/areas'
import AreaActivityRow from './AreaActivityRow.vue'

const props = defineProps<{
  atividades: Atividade[]
  /** Vazio = visão "todas as áreas" — cada linha ganha um selo com a área dela. */
  areaAtualId: string
  editavel?: boolean
  /** Quantidade inicial visível por aba, com botão "Ver mais" pra revelar o resto.
   * Sem isso, mostra tudo de uma vez (ok pra o plano de uma única área). */
  limitePagina?: number
}>()

const emit = defineEmits<{ editar: [atividade: Atividade] }>()

const areasStore = useAreasStore()

type Aba =
  | 'todas'
  | 'devolvida'
  | 'planejada'
  | 'em-andamento'
  | 'em-validacao'
  | 'atrasada'
  | 'vence-mes'
  | 'concluida'

const ABAS: Array<{ id: Aba; label: string; cor?: StatusCor }> = [
  { id: 'todas', label: 'Todas' },
  { id: 'devolvida', label: 'Devolvidas', cor: 'critical' },
  { id: 'planejada', label: 'Pendentes', cor: 'good' },
  { id: 'em-andamento', label: 'Em andamento', cor: 'good' },
  { id: 'em-validacao', label: 'Em validação', cor: 'warning' },
  { id: 'atrasada', label: 'Atrasadas', cor: 'critical' },
  { id: 'vence-mes', label: 'Vencem este mês', cor: 'warning' },
  { id: 'concluida', label: 'Concluídas', cor: 'good' },
]

const abaAtiva = ref<Aba>('todas')

const atividadesComStatus = computed(() =>
  props.atividades.map((atividade) => ({ atividade, status: getStatusAtividade(atividade) })),
)

function contagem(aba: Aba): number {
  if (aba === 'todas') return atividadesComStatus.value.length
  if (aba === 'devolvida') return props.atividades.filter(foiDevolvida).length
  if (aba === 'vence-mes') return props.atividades.filter((a) => venceEsteMes(a)).length
  return atividadesComStatus.value.filter((item) => item.status.estado === aba).length
}

const atividadesFiltradas = computed(() => {
  if (abaAtiva.value === 'todas') return atividadesComStatus.value.map((item) => item.atividade)
  if (abaAtiva.value === 'devolvida') return props.atividades.filter(foiDevolvida)
  if (abaAtiva.value === 'vence-mes') return props.atividades.filter((a) => venceEsteMes(a))
  return atividadesComStatus.value
    .filter((item) => item.status.estado === abaAtiva.value)
    .map((item) => item.atividade)
})

/**
 * Mostra todas as demais áreas envolvidas — inclui a líder quando a página
 * atual é a de uma área parceira (senão a tag mostraria "com [a própria área]").
 * Sem área atual (visão "todas as áreas"), não há o que excluir: só mostra a
 * tag em atividades de fato colaborativas, com todo mundo envolvido.
 */
function parceirasDe(atividade: Atividade): Area[] {
  const envolvidas = [atividade.areaLiderId, ...atividade.areasParceirasIds]
  const relevantes = props.areaAtualId
    ? envolvidas.filter((id) => id !== props.areaAtualId)
    : atividade.areasParceirasIds.length > 0
      ? envolvidas
      : []
  return relevantes.map((id) => areasStore.getById(id)).filter((area): area is Area => Boolean(area))
}

/** Selo de área por linha — só faz sentido quando a lista cruza várias áreas. */
function areaDe(atividade: Atividade): Area | undefined {
  return props.areaAtualId ? undefined : areasStore.getById(atividade.areaLiderId)
}

const quantidadeVisivel = ref(props.limitePagina ?? Infinity)
watch(abaAtiva, () => {
  quantidadeVisivel.value = props.limitePagina ?? Infinity
})

const atividadesVisiveis = computed(() => atividadesFiltradas.value.slice(0, quantidadeVisivel.value))
const temMais = computed(() => atividadesFiltradas.value.length > quantidadeVisivel.value)

function verMais(): void {
  quantidadeVisivel.value += props.limitePagina ?? 0
}
</script>

<template>
  <div>
    <div class="flex flex-wrap gap-1.5 border-b border-line pb-3">
      <button
        v-for="aba in ABAS"
        v-show="aba.id !== 'devolvida' || contagem(aba.id) > 0"
        :key="aba.id"
        type="button"
        class="rounded-chip px-3 py-1.5 text-xs font-semibold transition"
        :class="
          abaAtiva === aba.id
            ? aba.id === 'devolvida'
              ? 'bg-status-critical text-on-brand'
              : 'bg-brand text-on-brand'
            : aba.id === 'devolvida'
              ? 'bg-status-critical-bg text-status-critical hover:brightness-95'
              : 'bg-paper-dim text-ink-soft hover:bg-line'
        "
        @click="abaAtiva = aba.id"
      >
        {{ aba.label }} · {{ contagem(aba.id) }}
      </button>
    </div>

    <Transition name="fade" mode="out-in">
      <div :key="abaAtiva" class="mt-2 flex flex-col divide-y divide-line">
        <AreaActivityRow
          v-for="atividade in atividadesVisiveis"
          :key="atividade.id"
          :atividade="atividade"
          :parceiras="parceirasDe(atividade)"
          :area="areaDe(atividade)"
          :editavel="editavel"
          @editar="emit('editar', $event)"
        />
        <p v-if="atividadesFiltradas.length === 0" class="py-8 text-center text-sm text-ink-soft">
          Nenhuma atividade nesta categoria.
        </p>
        <button
          v-if="temMais"
          type="button"
          class="py-3 text-center text-sm font-semibold text-brass-ink hover:underline"
          @click="verMais"
        >
          Ver mais ({{ atividadesFiltradas.length - atividadesVisiveis.length }} restantes)
        </button>
      </div>
    </Transition>
  </div>
</template>
