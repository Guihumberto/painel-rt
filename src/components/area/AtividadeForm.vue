<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { Area } from '@/types/area'
import type { Atividade, AtividadeFormInput, Peso, TipoPrazo } from '@/types/activity'

const props = defineProps<{
  atividade?: Atividade
  areasParceirasDisponiveis: Area[]
}>()

const emit = defineEmits<{
  salvar: [dados: AtividadeFormInput]
  cancelar: []
}>()

const TIPOS_PRAZO: Array<{ id: TipoPrazo; label: string }> = [
  { id: 'janela', label: 'Janela (início — fim)' },
  { id: 'data-limite', label: 'Data limite' },
  { id: 'continua', label: 'Contínua' },
]

const form = reactive<AtividadeFormInput>({
  titulo: props.atividade?.titulo ?? '',
  descricao: props.atividade?.descricao ?? '',
  oQueMuda: props.atividade?.oQueMuda ?? '',
  impacto: props.atividade?.impacto ?? '',
  tipoPrazo: props.atividade?.tipoPrazo ?? 'data-limite',
  dataInicio: props.atividade?.dataInicio ?? '',
  dataFim: props.atividade?.dataFim ?? '',
  peso: props.atividade?.peso ?? 1,
  areasParceirasIds: props.atividade?.areasParceirasIds ?? [],
})

const erro = ref('')

function alternarParceira(areaId: string): void {
  form.areasParceirasIds = form.areasParceirasIds.includes(areaId)
    ? form.areasParceirasIds.filter((id) => id !== areaId)
    : [...form.areasParceirasIds, areaId]
}

function salvar(): void {
  if (!form.titulo.trim()) {
    erro.value = 'Título é obrigatório.'
    return
  }
  if (form.tipoPrazo !== 'continua' && !form.dataFim) {
    erro.value = 'Prazo é obrigatório para esse tipo de atividade.'
    return
  }
  erro.value = ''
  emit('salvar', {
    ...form,
    dataInicio: form.dataInicio || undefined,
    dataFim: form.dataFim || '2032-12-31',
  })
}
</script>

<template>
  <form class="panel flex flex-col gap-4 p-6" @submit.prevent="salvar">
    <h3 class="font-display text-base font-bold text-ink">
      {{ atividade ? 'Editar atividade' : 'Nova atividade' }}
    </h3>

    <div class="flex flex-col gap-1.5">
      <label class="font-mono text-[11px] uppercase tracking-widest text-ink-soft" for="af-titulo">Título</label>
      <input
        id="af-titulo"
        v-model="form.titulo"
        type="text"
        class="rounded-sm border border-line bg-paper px-3 py-2 text-sm text-ink focus:border-brass focus:outline-none"
      />
    </div>

    <div class="flex flex-col gap-1.5">
      <label class="font-mono text-[11px] uppercase tracking-widest text-ink-soft" for="af-descricao">Descrição</label>
      <textarea
        id="af-descricao"
        v-model="form.descricao"
        rows="2"
        class="rounded-sm border border-line bg-paper px-3 py-2 text-sm text-ink focus:border-brass focus:outline-none"
      />
    </div>

    <div class="flex flex-col gap-1.5">
      <label class="font-mono text-[11px] uppercase tracking-widest text-ink-soft" for="af-o-que-muda">O que muda</label>
      <textarea
        id="af-o-que-muda"
        v-model="form.oQueMuda"
        rows="2"
        class="rounded-sm border border-line bg-paper px-3 py-2 text-sm text-ink focus:border-brass focus:outline-none"
      />
    </div>

    <div class="flex flex-col gap-1.5">
      <label class="font-mono text-[11px] uppercase tracking-widest text-ink-soft" for="af-impacto">Impacto</label>
      <textarea
        id="af-impacto"
        v-model="form.impacto"
        rows="2"
        class="rounded-sm border border-line bg-paper px-3 py-2 text-sm text-ink focus:border-brass focus:outline-none"
      />
    </div>

    <div class="flex flex-col gap-1.5">
      <span class="font-mono text-[11px] uppercase tracking-widest text-ink-soft">Tipo de prazo</span>
      <div class="flex flex-wrap gap-1.5">
        <button
          v-for="tipo in TIPOS_PRAZO"
          :key="tipo.id"
          type="button"
          class="rounded-sm border px-2.5 py-1.5 text-xs font-semibold transition"
          :class="
            form.tipoPrazo === tipo.id
              ? 'border-brand bg-brand text-on-brand'
              : 'border-line bg-card text-ink hover:border-brass'
          "
          @click="form.tipoPrazo = tipo.id"
        >
          {{ tipo.label }}
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div v-if="form.tipoPrazo === 'janela'" class="flex flex-col gap-1.5">
        <label class="font-mono text-[11px] uppercase tracking-widest text-ink-soft" for="af-inicio">Início</label>
        <input
          id="af-inicio"
          v-model="form.dataInicio"
          type="date"
          class="rounded-sm border border-line bg-paper px-3 py-2 text-sm text-ink focus:border-brass focus:outline-none"
        />
      </div>
      <div v-if="form.tipoPrazo !== 'continua'" class="flex flex-col gap-1.5">
        <label class="font-mono text-[11px] uppercase tracking-widest text-ink-soft" for="af-fim">Prazo final</label>
        <input
          id="af-fim"
          v-model="form.dataFim"
          type="date"
          class="rounded-sm border border-line bg-paper px-3 py-2 text-sm text-ink focus:border-brass focus:outline-none"
        />
      </div>
    </div>

    <div class="flex flex-col gap-1.5">
      <span class="font-mono text-[11px] uppercase tracking-widest text-ink-soft">Peso</span>
      <div class="flex gap-1.5">
        <button
          v-for="n in [1, 2, 3] as Peso[]"
          :key="n"
          type="button"
          class="rounded-sm border px-3 py-1.5 text-xs font-semibold transition"
          :class="
            form.peso === n
              ? 'border-brand bg-brand text-on-brand'
              : 'border-line bg-card text-ink hover:border-brass'
          "
          @click="form.peso = n"
        >
          Peso {{ n }}
        </button>
      </div>
    </div>

    <div v-if="areasParceirasDisponiveis.length > 0" class="flex flex-col gap-1.5">
      <span class="font-mono text-[11px] uppercase tracking-widest text-ink-soft">Áreas parceiras</span>
      <div class="flex flex-wrap gap-1.5">
        <button
          v-for="area in areasParceirasDisponiveis"
          :key="area.id"
          type="button"
          class="rounded-sm border px-2.5 py-1.5 text-xs font-semibold transition"
          :class="
            form.areasParceirasIds.includes(area.id)
              ? 'border-brand bg-brand text-on-brand'
              : 'border-line bg-card text-ink hover:border-brass'
          "
          @click="alternarParceira(area.id)"
        >
          {{ area.sigla }}
        </button>
      </div>
    </div>

    <p v-if="erro" class="text-xs font-semibold text-status-critical">{{ erro }}</p>

    <div class="flex gap-2">
      <button
        type="submit"
        class="rounded-sm border border-brand bg-brand px-4 py-2 text-sm font-semibold text-on-brand transition hover:bg-brand-2"
      >
        {{ atividade ? 'Salvar alterações' : 'Cadastrar atividade' }}
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
