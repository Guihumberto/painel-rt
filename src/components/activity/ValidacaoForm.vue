<script setup lang="ts">
import { ref } from 'vue'
import type { Atividade, DecisaoValidacao, ValidacaoInput } from '@/types/activity'

const props = defineProps<{ atividade: Atividade }>()

const emit = defineEmits<{
  salvar: [dados: ValidacaoInput]
}>()

const OPCOES: Array<{ id: DecisaoValidacao; label: string }> = [
  { id: 'aprovada', label: 'Aprovar' },
  { id: 'aprovada-com-edicao', label: 'Aprovar com edição' },
  { id: 'devolvida', label: 'Devolver' },
]

const ROTULO_BOTAO: Record<DecisaoValidacao, string> = {
  aprovada: 'Aprovar e publicar',
  'aprovada-com-edicao': 'Aprovar com edição e publicar',
  devolvida: 'Devolver para a área',
}

const decisao = ref<DecisaoValidacao>('aprovada')
const observacao = ref('')
const resumoPublico = ref(props.atividade.resumoPublico ?? '')
const erro = ref('')

function salvar(): void {
  if (decisao.value === 'devolvida' && !observacao.value.trim()) {
    erro.value = 'A devolução precisa de uma justificativa.'
    return
  }
  if (decisao.value === 'aprovada-com-edicao' && !resumoPublico.value.trim()) {
    erro.value = 'O texto do feed não pode ficar vazio.'
    return
  }
  erro.value = ''
  emit('salvar', {
    decisao: decisao.value,
    observacao: observacao.value.trim() || undefined,
    resumoPublico: decisao.value === 'aprovada-com-edicao' ? resumoPublico.value : undefined,
  })
}
</script>

<template>
  <form class="panel flex flex-col gap-4 p-6" @submit.prevent="salvar">
    <h3 class="font-display text-base font-bold text-ink">Decisão do Validador</h3>

    <div class="flex flex-col gap-1.5">
      <span class="font-mono text-[11px] uppercase tracking-widest text-ink-soft">Ação</span>
      <div class="flex flex-wrap gap-1.5">
        <button
          v-for="opcao in OPCOES"
          :key="opcao.id"
          type="button"
          class="rounded-sm border px-2.5 py-1.5 text-xs font-semibold transition"
          :class="[
            decisao === opcao.id
              ? opcao.id === 'devolvida'
                ? 'border-status-critical bg-status-critical text-on-brand'
                : 'border-brand bg-brand text-on-brand'
              : opcao.id === 'devolvida'
                ? 'border-status-critical/50 bg-card text-status-critical hover:border-status-critical'
                : 'border-line bg-card text-ink hover:border-brass',
          ]"
          @click="decisao = opcao.id"
        >
          {{ opcao.label }}
        </button>
      </div>
    </div>

    <div v-if="decisao === 'aprovada-com-edicao'" class="flex flex-col gap-1.5">
      <label class="font-mono text-[11px] uppercase tracking-widest text-ink-soft" for="vf-resumo">Texto para o feed (editável)</label>
      <textarea
        id="vf-resumo"
        v-model="resumoPublico"
        rows="3"
        class="rounded-sm border border-line bg-paper px-3 py-2 text-sm text-ink focus:border-brass focus:outline-none"
      />
    </div>

    <div class="flex flex-col gap-1.5">
      <label class="font-mono text-[11px] uppercase tracking-widest text-ink-soft" for="vf-observacao">
        {{ decisao === 'devolvida' ? 'Motivo da devolução' : 'Observação (opcional)' }}
      </label>
      <textarea
        id="vf-observacao"
        v-model="observacao"
        rows="3"
        class="rounded-sm border border-line bg-paper px-3 py-2 text-sm text-ink focus:border-brass focus:outline-none"
      />
    </div>

    <p v-if="erro" class="text-xs font-semibold text-status-critical">{{ erro }}</p>

    <button
      type="submit"
      class="self-start rounded-sm border px-4 py-2 text-sm font-semibold transition"
      :class="
        decisao === 'devolvida'
          ? 'border-status-critical bg-status-critical text-on-brand hover:brightness-95'
          : 'border-status-good bg-status-good text-on-brand hover:brightness-95'
      "
    >
      {{ ROTULO_BOTAO[decisao] }}
    </button>
  </form>
</template>
