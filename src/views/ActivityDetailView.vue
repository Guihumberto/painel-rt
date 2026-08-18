<script setup lang="ts">
import { computed, ref } from 'vue'
import { useActivitiesStore } from '@/stores/activities'
import { useAreasStore } from '@/stores/areas'
import { useFeedStore } from '@/stores/feed'
import { useSessionStore } from '@/stores/session'
import { useParametrosStore } from '@/stores/parametros'
import { diasUteisDesde } from '@/composables/useSla'
import { foiDevolvida, motivoDevolucao } from '@/composables/useStatusAtividade'
import ActivityHeader from '@/components/activity/ActivityHeader.vue'
import ActivityTimeline from '@/components/activity/ActivityTimeline.vue'
import ActivityAttachments from '@/components/activity/ActivityAttachments.vue'
import ActivityAuditTrail from '@/components/activity/ActivityAuditTrail.vue'
import AtualizacaoForm from '@/components/activity/AtualizacaoForm.vue'
import ValidacaoForm from '@/components/activity/ValidacaoForm.vue'
import type { Area } from '@/types/area'
import type { AtualizacaoInput, ValidacaoInput } from '@/types/activity'

const props = defineProps<{ areaId: string; activityId: string }>()

const activitiesStore = useActivitiesStore()
const areasStore = useAreasStore()
const feedStore = useFeedStore()
const sessionStore = useSessionStore()
const parametrosStore = useParametrosStore()

const atividade = computed(() => activitiesStore.getById(props.activityId))
const area = computed(() => (atividade.value ? areasStore.getById(atividade.value.areaLiderId) : undefined))
const parceiras = computed<Area[]>(() =>
  atividade.value
    ? atividade.value.areasParceirasIds
        .map((id) => areasStore.getById(id))
        .filter((a): a is Area => Boolean(a))
    : [],
)
const publicadoEm = computed(
  () => feedStore.publicacoes.find((p) => p.atividadeId === props.activityId)?.publicadoEm,
)

/**
 * Admin pode agir no lugar do Responsável (qualquer área) ou do Validador —
 * pedido explícito, seção 2 da especificação. Sem backend ainda, o registro
 * de "quem agiu em nome de quem" fica só no texto do autor gravado (ver
 * `autorAssinatura`); uma trilha de autoria estruturada de verdade (autor
 * real + em nome de quem) é trabalho de quando existir backend.
 */
const ehAdmin = computed(() => sessionStore.usuarioAtual?.perfil === 'admin')

const podeAtualizar = computed(() => {
  const usuario = sessionStore.usuarioAtual
  if (!usuario || !atividade.value) return false
  const podeComoResponsavel = usuario.perfil === 'responsavel' && usuario.areaId === atividade.value.areaLiderId
  return (
    (podeComoResponsavel || ehAdmin.value) &&
    atividade.value.estado !== 'em-validacao' &&
    atividade.value.estado !== 'concluida'
  )
})

const podeValidar = computed(() => {
  const usuario = sessionStore.usuarioAtual
  if (!usuario || !atividade.value) return false
  return (usuario.perfil === 'validador' || ehAdmin.value) && atividade.value.estado === 'em-validacao'
})

/** Nome gravado como autor — quando é o admin agindo no lugar de alguém,
 * deixa isso explícito no próprio texto (aparece na trilha de auditoria). */
function autorAssinatura(comoValidador: boolean): string {
  const usuario = sessionStore.usuarioAtual
  if (!usuario) return 'Desconhecido'
  if (usuario.perfil === 'admin') {
    return comoValidador ? `${usuario.nome} (como Validador)` : `${usuario.nome} (em nome de ${area.value?.sigla})`
  }
  return usuario.nome
}

const diasEsperando = computed(() => {
  if (!atividade.value?.entrouEmValidacaoEm) return undefined
  return diasUteisDesde(atividade.value.entrouEmValidacaoEm)
})

const formularioAberto = ref(false)

function salvarAtualizacao(dados: AtualizacaoInput): void {
  if (!atividade.value) return
  activitiesStore.registrarAtualizacao(atividade.value.id, dados, autorAssinatura(false))
  formularioAberto.value = false
}

function salvarValidacao(dados: ValidacaoInput): void {
  if (!atividade.value) return
  activitiesStore.aplicarValidacao(atividade.value.id, dados, autorAssinatura(true))
}
</script>

<template>
  <div v-if="atividade && area">
    <ActivityHeader :atividade="atividade" :area="area" :parceiras="parceiras" />

    <div class="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-8 sm:px-6">
      <div
        v-if="foiDevolvida(atividade)"
        class="rounded-card border border-status-critical/40 bg-status-critical-bg p-4"
      >
        <p class="text-sm font-semibold text-status-critical">Devolvida pelo Validador</p>
        <p v-if="motivoDevolucao(atividade)" class="mt-1 text-sm text-status-critical">
          {{ motivoDevolucao(atividade) }}
        </p>
      </div>

      <p
        v-if="diasEsperando !== undefined"
        class="self-start rounded-chip px-3 py-1.5 text-xs font-semibold"
        :class="
          diasEsperando > parametrosStore.parametro.slaDiasUteis
            ? 'bg-status-critical-bg text-status-critical'
            : 'bg-status-warning-bg text-status-warning'
        "
      >
        Esperando validação há {{ diasEsperando }} {{ diasEsperando === 1 ? 'dia útil' : 'dias úteis' }}
        (SLA: {{ parametrosStore.parametro.slaDiasUteis }} dias úteis)
      </p>

      <p v-if="ehAdmin && podeAtualizar" class="text-xs italic text-ink-soft">
        Você está agindo em nome do Responsável da {{ area.sigla }}.
      </p>

      <button
        v-if="podeAtualizar && !formularioAberto"
        type="button"
        class="self-start rounded-sm border border-brand bg-brand px-4 py-2 text-sm font-semibold text-on-brand transition hover:bg-brand-2"
        @click="formularioAberto = true"
      >
        + Registrar atualização
      </button>

      <AtualizacaoForm
        v-if="podeAtualizar && formularioAberto"
        :atividade="atividade"
        @salvar="salvarAtualizacao"
        @cancelar="formularioAberto = false"
      />

      <ActivityTimeline :andamentos="atividade.andamentos" :comprovacoes="atividade.comprovacoes" />
      <ActivityAttachments :comprovacoes="atividade.comprovacoes" />

      <p v-if="ehAdmin && podeValidar" class="text-xs italic text-ink-soft">
        Você está agindo como Validador.
      </p>

      <ValidacaoForm v-if="podeValidar" :atividade="atividade" @salvar="salvarValidacao" />

      <ActivityAuditTrail :atividade="atividade" :area="area" :publicado-em="publicadoEm" />
    </div>
  </div>

  <p v-else class="mx-auto max-w-4xl px-4 py-16 text-center text-sm text-ink-soft">
    {{ activitiesStore.carregado ? 'Atividade não encontrada.' : 'Carregando atividade…' }}
  </p>
</template>
