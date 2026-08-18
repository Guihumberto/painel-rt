<script setup lang="ts">
import { computed } from 'vue'
import { useEventsStore } from '@/stores/events'
import { useAreasStore } from '@/stores/areas'
import { useInscricoesStore } from '@/stores/inscricoes'
import { diasRestantesEvento, estadoTemporalEvento } from '@/composables/useEventoData'
import AreaAvatar from '@/components/shared/AreaAvatar.vue'
import EventoInscricaoForm from '@/components/events/EventoInscricaoForm.vue'
import LinhaDoTempoReunioes from '@/components/events/LinhaDoTempoReunioes.vue'
import IconCalendario from '@/components/icons/IconCalendario.vue'
import IconLocal from '@/components/icons/IconLocal.vue'
import IconPessoas from '@/components/icons/IconPessoas.vue'

const props = defineProps<{ eventoId: string }>()

const eventsStore = useEventsStore()
const areasStore = useAreasStore()
const inscricoesStore = useInscricoesStore()

const evento = computed(() => eventsStore.eventos.find((e) => e.id === props.eventoId))
const pautaAtividades = computed(() => (evento.value ? eventsStore.atividadesDe(evento.value) : []))
const inscritos = computed(() => (evento.value ? inscricoesStore.inscritosDe(evento.value.id) : []))

/** Outras edições da mesma série (mesmo `tipo`) — histórico + próxima, ver LinhaDoTempoReunioes. */
const eventosDaSerie = computed(() =>
  evento.value ? eventsStore.eventos.filter((e) => e.tipo === evento.value!.tipo) : [],
)
const proximaDaSerieId = computed(
  () => eventsStore.proximos.find((e) => e.tipo === evento.value?.tipo)?.id,
)

const dataEvento = computed(() => new Date(`${evento.value?.data ?? ''}T12:00:00`))
const diasRestantes = computed(() => (evento.value ? diasRestantesEvento(evento.value.data) : 0))

const dia = computed(() => new Intl.DateTimeFormat('pt-BR', { day: '2-digit' }).format(dataEvento.value))
const mes = computed(() => new Intl.DateTimeFormat('pt-BR', { month: 'short' }).format(dataEvento.value).replace('.', ''))
const ano = computed(() => dataEvento.value.getFullYear())

const dataExtensa = computed(() =>
  new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' }).format(
    dataEvento.value,
  ),
)

const rotuloContagem = computed(() => {
  if (diasRestantes.value === 0) return 'Hoje'
  if (diasRestantes.value === 1) return 'Amanhã'
  if (diasRestantes.value > 1) return `Em ${diasRestantes.value} dias`
  return 'Já ocorreu'
})

const estado = computed(() => estadoTemporalEvento(diasRestantes.value))

function areaDe(atividade: { areaLiderId: string }) {
  return areasStore.getById(atividade.areaLiderId)
}
</script>

<template>
  <div v-if="evento">
    <header class="border-b border-line bg-card">
      <div class="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <nav class="mb-4 flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-ink-soft">
          <router-link to="/" class="hover:text-ink">Painel</router-link>
          <span>/</span>
          <router-link :to="{ name: 'eventos' }" class="hover:text-ink">Eventos</router-link>
          <span>/</span>
          <span class="text-ink">{{ evento.numero ? `Nº ${evento.numero}` : evento.titulo }}</span>
        </nav>

        <div class="flex flex-col gap-6 sm:flex-row sm:items-start">
          <!-- bloco de data: mesma âncora visual do card da home, em escala maior -->
          <div class="flex shrink-0 flex-col items-center justify-center gap-1 rounded-sm bg-brand px-6 py-5">
            <span class="font-display text-6xl font-black leading-none tabular-nums text-brass">
              {{ dia }}
            </span>
            <span class="font-mono text-xs font-semibold uppercase tracking-[0.15em] text-on-brand/70">
              {{ mes }}
            </span>
            <span class="font-mono text-[10px] text-on-brand/40">{{ ano }}</span>
          </div>

          <div class="min-w-0 flex-1">
            <div class="flex flex-wrap items-center gap-2">
              <span
                class="inline-flex items-center gap-1.5 rounded-chip px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide"
                :class="{
                  'bg-status-good-bg text-status-good': estado === 'hoje',
                  'bg-brass/15 text-brass-ink': estado === 'futuro',
                  'bg-paper-dim text-ink-soft': estado === 'passado',
                }"
              >
                <span v-if="estado === 'hoje'" class="h-1.5 w-1.5 animate-pulse rounded-full bg-status-good" aria-hidden="true" />
                {{ rotuloContagem }}
              </span>
              <span class="font-mono text-xs uppercase tracking-widest text-ink-soft">{{ evento.tipo }}</span>
              <span v-if="evento.numero" class="font-mono text-xs text-ink-soft">· Nº {{ evento.numero }}</span>
            </div>

            <h1 class="mt-2 font-display text-2xl font-extrabold leading-tight text-ink sm:text-3xl">
              {{ evento.titulo }}
            </h1>
            <p class="mt-2 max-w-2xl text-sm text-ink-soft">{{ evento.descricao }}</p>
          </div>
        </div>
      </div>
    </header>

    <div class="mx-auto flex max-w-4xl flex-col gap-10 px-4 py-10 sm:px-6">
      <!-- ficha de convocação: uma tira só, com regras internas — não 3 cartões repetidos.
           Selo escuro+latão reaproveita o mesmo par do bloco de data no cabeçalho. -->
      <section class="panel divide-y divide-line sm:flex sm:divide-x sm:divide-y-0">
        <div class="flex-1 p-5">
          <div class="flex items-center gap-2.5">
            <span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-sm bg-brand text-brass">
              <IconCalendario class="h-3.5 w-3.5" />
            </span>
            <p class="font-mono text-[11px] uppercase tracking-widest text-ink-soft">Quando</p>
          </div>
          <p class="mt-2.5 text-sm font-semibold capitalize text-ink">{{ dataExtensa }}</p>
          <p v-if="evento.hora" class="mt-1 font-mono text-lg font-semibold tabular-nums text-brass-ink">
            {{ evento.hora }}
          </p>
        </div>
        <div class="flex-1 p-5">
          <div class="flex items-center gap-2.5">
            <span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-sm bg-brand text-brass">
              <IconLocal class="h-3.5 w-3.5" />
            </span>
            <p class="font-mono text-[11px] uppercase tracking-widest text-ink-soft">Onde</p>
          </div>
          <p class="mt-2.5 text-sm font-semibold text-ink">{{ evento.local }}</p>
          <span
            v-if="evento.modalidade"
            class="mt-1.5 inline-flex rounded-chip bg-paper-dim px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wide text-ink-soft"
          >
            {{ evento.modalidade }}
          </span>
        </div>
        <div v-if="evento.publicoAlvo" class="flex-1 p-5">
          <div class="flex items-center gap-2.5">
            <span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-sm bg-brand text-brass">
              <IconPessoas class="h-3.5 w-3.5" />
            </span>
            <p class="font-mono text-[11px] uppercase tracking-widest text-ink-soft">Quem</p>
          </div>
          <p class="mt-2.5 text-sm text-ink">{{ evento.publicoAlvo }}</p>
        </div>
      </section>

      <section v-if="evento.assuntos && evento.assuntos.length > 0" class="flex flex-col gap-4">
        <h2 class="font-display text-lg font-bold text-ink">Pauta</h2>
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <article
            v-for="assunto in evento.assuntos"
            :key="assunto.ordem"
            class="group flex gap-4 rounded-card border border-line bg-card p-4 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-brass"
          >
            <span
              class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand font-mono text-xs font-bold text-on-brand transition-colors duration-200 group-hover:bg-brass group-hover:text-brass-ink"
            >
              {{ assunto.ordem }}
            </span>
            <div class="min-w-0">
              <p class="text-sm font-medium leading-snug text-ink">{{ assunto.titulo }}</p>
              <p class="mt-1 font-mono text-xs uppercase tracking-wide text-ink-soft">{{ assunto.responsavel }}</p>
            </div>
          </article>
        </div>
      </section>

      <section v-else-if="pautaAtividades.length > 0" class="flex flex-col gap-4">
        <h2 class="font-display text-lg font-bold text-ink">
          {{ evento.status === 'agendado' ? 'Pauta provisória' : 'Apresentações' }}
        </h2>
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <router-link
            v-for="atividade in pautaAtividades"
            :key="atividade.id"
            :to="{ name: 'atividade', params: { areaId: atividade.areaLiderId, activityId: atividade.id } }"
            class="group flex items-center gap-2.5 rounded-card border border-line bg-card p-4 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-brass"
          >
            <AreaAvatar v-if="areaDe(atividade)" :area="areaDe(atividade)!" size="sm" />
            <span class="truncate text-sm font-medium text-ink">{{ atividade.titulo }}</span>
          </router-link>
        </div>
      </section>

      <section v-if="evento.informes && evento.informes.length > 0" class="flex flex-col gap-4">
        <h2 class="font-display text-lg font-bold text-ink">Informes</h2>
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <article
            v-for="(informe, indice) in evento.informes"
            :key="indice"
            class="rounded-card border border-line border-l-[3px] border-l-brass bg-card p-4 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-brass"
          >
            <p class="text-sm leading-snug text-ink">{{ informe }}</p>
          </article>
        </div>
      </section>

      <section v-if="evento.status === 'agendado'" class="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <EventoInscricaoForm :evento-id="evento.id" />

        <div class="panel p-5">
          <p class="font-mono text-[11px] uppercase tracking-widest text-ink-soft">
            Confirmados · {{ inscritos.length }}
          </p>
          <ul v-if="inscritos.length > 0" class="mt-3 flex flex-col gap-2.5">
            <li v-for="inscrito in inscritos" :key="inscrito.id" class="truncate text-sm text-ink">
              {{ inscrito.nome }}
            </li>
          </ul>
          <p v-else class="mt-3 text-sm text-ink-soft">Ainda ninguém confirmou presença.</p>
        </div>
      </section>

      <!-- Reunião já ocorreu: sem formulário — inscrição fica restrita às agendadas -->
      <section v-else class="panel p-5">
        <p class="font-mono text-[11px] uppercase tracking-widest text-ink-soft">Encerrada</p>
        <p class="mt-2 text-sm text-ink-soft">Esta reunião já ocorreu — as inscrições estão encerradas.</p>
        <div v-if="inscritos.length > 0" class="mt-4 border-t border-line pt-4">
          <p class="font-mono text-[11px] uppercase tracking-widest text-ink-soft">
            Confirmaram presença · {{ inscritos.length }}
          </p>
          <ul class="mt-2 flex flex-col gap-1.5">
            <li v-for="inscrito in inscritos" :key="inscrito.id" class="truncate text-sm text-ink">
              {{ inscrito.nome }}
            </li>
          </ul>
        </div>
      </section>

      <LinhaDoTempoReunioes
        v-if="eventosDaSerie.length > 1"
        :eventos="eventosDaSerie"
        :atual-id="evento.id"
        :proxima-id="proximaDaSerieId"
      />
    </div>
  </div>

  <p v-else class="mx-auto max-w-4xl px-4 py-16 text-center text-sm text-ink-soft">
    {{ eventsStore.carregado ? 'Evento não encontrado.' : 'Carregando evento…' }}
  </p>
</template>
