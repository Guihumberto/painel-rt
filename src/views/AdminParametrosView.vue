<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useParametrosStore } from '@/stores/parametros'

const parametrosStore = useParametrosStore()

const form = reactive({
  slaDiasUteis: parametrosStore.parametro.slaDiasUteis,
  interesseContadorMinimo: parametrosStore.parametro.interesseContadorMinimo,
  interesseMinimoEngajamento: parametrosStore.parametro.interesseMinimoEngajamento,
  bonusAntecipacaoPercentual: Math.round(parametrosStore.parametro.bonusAntecipacaoPercentual * 100),
  bonusEngajamentoPorAtividade: Math.round(parametrosStore.parametro.bonusEngajamentoPorAtividade * 100),
  bonusEngajamentoMaximo: Math.round(parametrosStore.parametro.bonusEngajamentoMaximo * 100),
  bonusColaboracaoPercentual: Math.round(parametrosStore.parametro.bonusColaboracaoPercentual * 100),
})

const salvo = ref(false)

function salvar(): void {
  parametrosStore.atualizar({
    slaDiasUteis: form.slaDiasUteis,
    interesseContadorMinimo: form.interesseContadorMinimo,
    interesseMinimoEngajamento: form.interesseMinimoEngajamento,
    bonusAntecipacaoPercentual: form.bonusAntecipacaoPercentual / 100,
    bonusEngajamentoPorAtividade: form.bonusEngajamentoPorAtividade / 100,
    bonusEngajamentoMaximo: form.bonusEngajamentoMaximo / 100,
    bonusColaboracaoPercentual: form.bonusColaboracaoPercentual / 100,
  })
  salvo.value = true
}
</script>

<template>
  <div>
    <header class="border-b border-line bg-card">
      <div class="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <nav class="mb-4 flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-ink-soft">
          <router-link to="/" class="hover:text-ink">Painel</router-link>
          <span>/</span>
          <router-link to="/admin" class="hover:text-ink">Administração</router-link>
          <span>/</span>
          <span class="text-ink">Parâmetros</span>
        </nav>

        <h1 class="font-display text-2xl font-extrabold text-ink sm:text-3xl">Parâmetros</h1>
        <p class="mt-1 text-sm text-ink-soft">
          Limiares e bônus que hoje ficariam fixos no código — SLA de validação, contador de
          interesse e os bônus do índice de cumprimento.
        </p>
      </div>
    </header>

    <div class="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <form class="panel flex flex-col gap-5 p-6" @submit.prevent="salvar" @input="salvo = false">
        <div class="flex flex-col gap-1.5">
          <label class="font-mono text-[11px] uppercase tracking-widest text-ink-soft" for="pf-sla">
            SLA de validação (dias úteis)
          </label>
          <input
            id="pf-sla"
            v-model.number="form.slaDiasUteis"
            type="number"
            min="1"
            class="rounded-sm border border-line bg-paper px-3 py-2 text-sm text-ink focus:border-brass focus:outline-none"
          />
        </div>

        <div class="flex flex-col gap-1.5">
          <label class="font-mono text-[11px] uppercase tracking-widest text-ink-soft" for="pf-interesse">
            Contador de "Quero saber mais" vira público a partir de
          </label>
          <input
            id="pf-interesse"
            v-model.number="form.interesseContadorMinimo"
            type="number"
            min="1"
            class="rounded-sm border border-line bg-paper px-3 py-2 text-sm text-ink focus:border-brass focus:outline-none"
          />
        </div>

        <div class="flex flex-col gap-1.5">
          <label class="font-mono text-[11px] uppercase tracking-widest text-ink-soft" for="pf-engaj-min">
            Interessados mínimos pra contar engajamento no índice
          </label>
          <input
            id="pf-engaj-min"
            v-model.number="form.interesseMinimoEngajamento"
            type="number"
            min="1"
            class="rounded-sm border border-line bg-paper px-3 py-2 text-sm text-ink focus:border-brass focus:outline-none"
          />
        </div>

        <div class="grid grid-cols-1 gap-4 border-t border-line pt-4 sm:grid-cols-3">
          <div class="flex flex-col gap-1.5">
            <label class="font-mono text-[11px] uppercase tracking-widest text-ink-soft" for="pf-antecipacao">
              Bônus de antecipação (%)
            </label>
            <input
              id="pf-antecipacao"
              v-model.number="form.bonusAntecipacaoPercentual"
              type="number"
              min="0"
              max="100"
              class="rounded-sm border border-line bg-paper px-3 py-2 text-sm text-ink focus:border-brass focus:outline-none"
            />
          </div>
          <div class="flex flex-col gap-1.5">
            <label class="font-mono text-[11px] uppercase tracking-widest text-ink-soft" for="pf-engaj-ativ">
              Bônus por atividade engajada (%)
            </label>
            <input
              id="pf-engaj-ativ"
              v-model.number="form.bonusEngajamentoPorAtividade"
              type="number"
              min="0"
              max="100"
              class="rounded-sm border border-line bg-paper px-3 py-2 text-sm text-ink focus:border-brass focus:outline-none"
            />
          </div>
          <div class="flex flex-col gap-1.5">
            <label class="font-mono text-[11px] uppercase tracking-widest text-ink-soft" for="pf-engaj-max">
              Teto do bônus de engajamento (%)
            </label>
            <input
              id="pf-engaj-max"
              v-model.number="form.bonusEngajamentoMaximo"
              type="number"
              min="0"
              max="100"
              class="rounded-sm border border-line bg-paper px-3 py-2 text-sm text-ink focus:border-brass focus:outline-none"
            />
          </div>
        </div>

        <div class="flex flex-col gap-1.5">
          <label class="font-mono text-[11px] uppercase tracking-widest text-ink-soft" for="pf-colaboracao">
            Bônus de colaboração entre áreas (%)
          </label>
          <input
            id="pf-colaboracao"
            v-model.number="form.bonusColaboracaoPercentual"
            type="number"
            min="0"
            max="100"
            class="rounded-sm border border-line bg-paper px-3 py-2 text-sm text-ink focus:border-brass focus:outline-none"
          />
        </div>

        <div class="flex items-center gap-3">
          <button
            type="submit"
            class="self-start rounded-sm border border-brand bg-brand px-4 py-2 text-sm font-semibold text-on-brand transition hover:bg-brand-2"
          >
            Salvar parâmetros
          </button>
          <span v-if="salvo" class="text-xs font-semibold text-status-good">Salvo.</span>
        </div>
      </form>
    </div>
  </div>
</template>
