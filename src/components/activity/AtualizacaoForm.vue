<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Atividade, AtualizacaoInput, TipoArtefato, TipoAtualizacao } from '@/types/activity'
import { TIPO_ATUALIZACAO_LABEL } from '@/types/activity'

const props = defineProps<{ atividade: Atividade }>()

const emit = defineEmits<{
  salvar: [dados: AtualizacaoInput]
  cancelar: []
}>()

const TIPOS_POR_ESTADO: Record<string, TipoAtualizacao[]> = {
  planejada: ['inicio'],
  'em-andamento': ['atualizacao', 'paralisacao', 'conclusao'],
}

const tiposDisponiveis = computed<TipoAtualizacao[]>(() => TIPOS_POR_ESTADO[props.atividade.estado] ?? [])

const tipo = ref<TipoAtualizacao>(tiposDisponiveis.value[0])
const texto = ref('')
const artefatoTipo = ref<TipoArtefato>('pdf')
const artefatoNome = ref('')
const artefatoUrl = ref('')
const resumoPublico = ref('')
const erro = ref('')

const rotuloTexto = computed(() =>
  tipo.value === 'conclusao' ? 'Relatório de conclusão — o que foi de fato entregue' : 'O que foi feito',
)

const ROTULO_BOTAO: Record<TipoAtualizacao, string> = {
  inicio: 'Iniciar atividade',
  atualizacao: 'Salvar atualização',
  paralisacao: 'Registrar paralisação',
  conclusao: 'Concluir e enviar para validação',
}

function salvar(): void {
  if (!texto.value.trim()) {
    erro.value = 'Descreva a atualização.'
    return
  }
  if (!artefatoNome.value.trim()) {
    erro.value = 'Anexe um artefato (nome do arquivo ou rótulo do link).'
    return
  }
  if (artefatoTipo.value === 'link' && !artefatoUrl.value.trim()) {
    erro.value = 'Informe a URL do link.'
    return
  }
  if (tipo.value === 'conclusao' && !resumoPublico.value.trim()) {
    erro.value = 'Escreva o texto que vai para o feed público.'
    return
  }
  erro.value = ''
  emit('salvar', {
    tipo: tipo.value,
    texto: texto.value,
    artefato: {
      tipo: artefatoTipo.value,
      nome: artefatoNome.value,
      url: artefatoTipo.value === 'link' ? artefatoUrl.value : undefined,
    },
    resumoPublico: tipo.value === 'conclusao' ? resumoPublico.value : undefined,
  })
}
</script>

<template>
  <form class="panel flex flex-col gap-4 p-6" @submit.prevent="salvar">
    <h3 class="font-display text-base font-bold text-ink">Registrar atualização</h3>

    <div v-if="tiposDisponiveis.length > 1" class="flex flex-col gap-1.5">
      <span class="font-mono text-[11px] uppercase tracking-widest text-ink-soft">Tipo</span>
      <div class="flex flex-wrap gap-1.5">
        <button
          v-for="t in tiposDisponiveis"
          :key="t"
          type="button"
          class="rounded-sm border px-2.5 py-1.5 text-xs font-semibold transition"
          :class="[
            tipo === t
              ? t === 'conclusao'
                ? 'border-brass bg-brass text-ink'
                : 'border-brand bg-brand text-on-brand'
              : t === 'conclusao'
                ? 'border-brass/50 bg-card text-brass-ink hover:border-brass'
                : 'border-line bg-card text-ink hover:border-brass',
          ]"
          @click="tipo = t"
        >
          {{ t === 'conclusao' ? 'Concluir atividade' : TIPO_ATUALIZACAO_LABEL[t] }}
        </button>
      </div>
      <p v-if="tipo === 'conclusao'" class="text-xs text-ink-soft">
        Isso encerra as atualizações desta atividade por aqui e envia para o Validador confirmar a
        entrega — o status muda para "Em validação".
      </p>
    </div>

    <div class="flex flex-col gap-1.5">
      <label class="font-mono text-[11px] uppercase tracking-widest text-ink-soft" for="uf-texto">{{ rotuloTexto }}</label>
      <textarea
        id="uf-texto"
        v-model="texto"
        rows="3"
        class="rounded-sm border border-line bg-paper px-3 py-2 text-sm text-ink focus:border-brass focus:outline-none"
      />
    </div>

    <div v-if="tipo === 'conclusao'" class="flex flex-col gap-1.5">
      <label class="font-mono text-[11px] uppercase tracking-widest text-ink-soft" for="uf-resumo">Texto para o feed público</label>
      <textarea
        id="uf-resumo"
        v-model="resumoPublico"
        rows="2"
        class="rounded-sm border border-line bg-paper px-3 py-2 text-sm text-ink focus:border-brass focus:outline-none"
      />
    </div>

    <div class="flex flex-col gap-2 border-t border-line pt-4">
      <span class="font-mono text-[11px] uppercase tracking-widest text-ink-soft">Artefato (obrigatório)</span>
      <div class="flex flex-wrap gap-1.5">
        <button
          v-for="t in ['pdf', 'imagem', 'link'] as TipoArtefato[]"
          :key="t"
          type="button"
          class="rounded-sm border px-2.5 py-1.5 text-xs font-semibold uppercase transition"
          :class="
            artefatoTipo === t
              ? 'border-brand bg-brand text-on-brand'
              : 'border-line bg-card text-ink hover:border-brass'
          "
          @click="artefatoTipo = t"
        >
          {{ t }}
        </button>
      </div>

      <input
        v-model="artefatoNome"
        type="text"
        :placeholder="artefatoTipo === 'link' ? 'Rótulo do link' : 'Nome do arquivo'"
        class="rounded-sm border border-line bg-paper px-3 py-2 text-sm text-ink focus:border-brass focus:outline-none"
      />
      <input
        v-if="artefatoTipo === 'link'"
        v-model="artefatoUrl"
        type="url"
        placeholder="https://…"
        class="rounded-sm border border-line bg-paper px-3 py-2 text-sm text-ink focus:border-brass focus:outline-none"
      />
      <p v-if="artefatoTipo !== 'link'" class="text-xs text-ink-soft">
        Protótipo sem upload real de arquivo — isto é só o nome de referência, não um envio de verdade.
      </p>
    </div>

    <p v-if="erro" class="text-xs font-semibold text-status-critical">{{ erro }}</p>

    <div class="flex gap-2">
      <button
        type="submit"
        class="rounded-sm border px-4 py-2 text-sm font-semibold transition"
        :class="
          tipo === 'conclusao'
            ? 'border-brass bg-brass text-ink hover:brightness-95'
            : 'border-brand bg-brand text-on-brand hover:bg-brand-2'
        "
      >
        {{ ROTULO_BOTAO[tipo] }}
      </button>
      <button
        type="button"
        class="rounded-sm border border-line px-4 py-2 text-sm font-semibold text-ink-soft transition hover:border-brass"
        @click="emit('cancelar')"
      >
        Cancelar
      </button>
    </div>
  </form>
</template>
