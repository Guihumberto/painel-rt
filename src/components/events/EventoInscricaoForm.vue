<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useSessionStore } from '@/stores/session'
import { useInscricoesStore } from '@/stores/inscricoes'
import type { InscricaoFormInput } from '@/types/inscricao'

const props = defineProps<{ eventoId: string }>()

const sessionStore = useSessionStore()
const inscricoesStore = useInscricoesStore()

const usuario = sessionStore.usuarioAtual

const form = reactive<InscricaoFormInput>({
  nome: usuario?.nome ?? '',
  email: usuario?.email ?? '',
})

const erro = ref('')

function confirmar(): void {
  if (!form.nome.trim() || !form.email.trim()) {
    erro.value = 'Nome e e-mail são obrigatórios.'
    return
  }
  erro.value = ''
  inscricoesStore.inscrever(props.eventoId, form)
}
</script>

<template>
  <div class="panel p-6 sm:p-8">
    <div v-if="inscricoesStore.estaInscrito(eventoId)" class="flex flex-col items-center gap-3 py-4 text-center">
      <span
        class="flex h-12 w-12 items-center justify-center rounded-full bg-status-good-bg text-2xl text-status-good"
        aria-hidden="true"
      >
        ✓
      </span>
      <h3 class="font-display text-lg font-bold text-ink">Presença confirmada</h3>
      <p class="max-w-md text-sm text-ink-soft">
        Sua inscrição foi registrada para fins de carga horária e ciência — a coordenação do CTRT
        já sabe que você vai participar.
      </p>
    </div>

    <form v-else class="flex flex-col gap-4" @submit.prevent="confirmar">
      <div>
        <h3 class="font-display text-lg font-bold text-ink">Confirmar participação</h3>
        <p class="mt-1 text-sm text-ink-soft">
          A inscrição garante o registro de carga horária e dá ciência à administração do CTRT
          sobre quem vai participar da reunião.
        </p>
      </div>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div class="flex flex-col gap-1.5">
          <label class="font-mono text-[11px] uppercase tracking-widest text-ink-soft" for="if-nome">
            Nome completo
          </label>
          <input
            id="if-nome"
            v-model="form.nome"
            type="text"
            class="rounded-sm border border-line bg-paper px-3 py-2 text-sm text-ink focus:border-brass focus:outline-none"
          />
        </div>

        <div class="flex flex-col gap-1.5">
          <label class="font-mono text-[11px] uppercase tracking-widest text-ink-soft" for="if-email">
            E-mail
          </label>
          <input
            id="if-email"
            v-model="form.email"
            type="email"
            class="rounded-sm border border-line bg-paper px-3 py-2 text-sm text-ink focus:border-brass focus:outline-none"
          />
        </div>
      </div>

      <p v-if="erro" class="text-xs font-semibold text-status-critical">{{ erro }}</p>

      <button
        type="submit"
        class="self-start rounded-sm border border-brand bg-brand px-5 py-2.5 text-sm font-semibold text-on-brand transition hover:bg-brand-2"
      >
        Confirmar participação
      </button>
    </form>
  </div>
</template>
