<script setup lang="ts">
import { computed } from 'vue'
import type { Atividade } from '@/types/activity'
import type { Area } from '@/types/area'
import { useHistoricoStore } from '@/stores/historico'

const props = defineProps<{ atividade: Atividade; area: Area; publicadoEm?: string }>()

const historicoStore = useHistoricoStore()

function formatar(data: string): string {
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).format(
    new Date(`${data}T12:00:00`),
  )
}

const passos = computed(() => {
  const itens = [
    { label: 'Cadastrada por', valor: props.area.sigla, data: props.atividade.criadaEm },
  ]

  for (const alteracao of historicoStore.porAtividade(props.atividade.id)) {
    if (alteracao.campo === 'cadastro') continue
    itens.push({
      label: `${alteracao.rotuloCampo} alterado por`,
      valor: `${alteracao.autor} ("${alteracao.valorAnterior}" → "${alteracao.valorNovo}")`,
      data: alteracao.data,
    })
  }

  const ultimaComprovacao = props.atividade.comprovacoes.at(-1)
  if (ultimaComprovacao) {
    itens.push({ label: 'Comprovada por', valor: ultimaComprovacao.autor, data: ultimaComprovacao.data })
  }
  const ROTULO_DECISAO: Record<string, string> = {
    aprovada: 'Validada por',
    'aprovada-com-edicao': 'Validada (com edição) por',
    devolvida: 'Devolvida por',
  }
  for (const validacao of props.atividade.validacoes) {
    itens.push({
      label: ROTULO_DECISAO[validacao.decisao],
      valor: validacao.observacao
        ? `${validacao.validador} — "${validacao.observacao}"`
        : validacao.validador,
      data: validacao.data,
    })
  }

  if (props.publicadoEm) {
    itens.push({ label: 'Publicada em', valor: 'Feed institucional', data: props.publicadoEm })
  }

  return itens
    .sort((a, b) => (a.data < b.data ? -1 : 1))
    .map((item, indice) => ({ ...item, chave: `${item.label}-${indice}` }))
})
</script>

<template>
  <div class="panel p-6">
    <h2 class="font-display text-lg font-bold text-ink">Trilha de auditoria</h2>

    <dl class="mt-4 flex flex-col gap-3 font-mono text-xs">
      <div v-for="passo in passos" :key="passo.chave" class="flex items-center justify-between gap-3 text-ink-soft">
        <dt>{{ passo.label }} <span class="text-ink">{{ passo.valor }}</span></dt>
        <dd class="shrink-0">{{ formatar(passo.data) }}</dd>
      </div>
    </dl>
  </div>
</template>
