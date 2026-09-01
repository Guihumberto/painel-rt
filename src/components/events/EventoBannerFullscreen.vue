<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import type { AssuntoPauta, Evento } from '@/types/event'
import { useEventsStore } from '@/stores/events'
import { useAreasStore } from '@/stores/areas'
import { diasRestantesEvento, estadoTemporalEvento, partesDataEvento } from '@/composables/useEventoData'
import IconFechar from '@/components/icons/IconFechar.vue'
import AreaAvatar from '@/components/shared/AreaAvatar.vue'

const props = defineProps<{ evento: Evento }>()

const emit = defineEmits<{ fechar: [] }>()

const eventsStore = useEventsStore()
const areasStore = useAreasStore()

const diasRestantes = computed(() => diasRestantesEvento(props.evento.data))
const estado = computed(() => estadoTemporalEvento(diasRestantes.value))
const partes = computed(() => partesDataEvento(props.evento.data))

/** Fallback para eventos sem pauta fixa (ex.: o seminário trimestral) — mesma pauta dinâmica da página de detalhe. */
const pautaAtividades = computed(() => eventsStore.atividadesDe(props.evento))

function areaDe(atividade: { areaLiderId: string }) {
  return areasStore.getById(atividade.areaLiderId)
}

const rotuloEstado = computed(() => {
  if (props.evento.status === 'suspenso') return 'Suspensa'
  if (diasRestantes.value === 0) return 'Hoje'
  if (diasRestantes.value === 1) return 'Amanhã'
  if (diasRestantes.value > 1) return `Em ${diasRestantes.value} dias`
  return 'Já ocorreu'
})

/** Só o número sequencial ("14" de "14/2026") — vira o numeral fantasma no fundo do palco. */
const numeroSequencial = computed(() => props.evento.numero?.split('/')[0])

/**
 * Modo holofote — clicar num assunto (ou Enter) dá destaque de palco a ele,
 * com quem apresenta em tipografia enorme; os que vêm depois entram numa
 * coluna menor ao lado ("a seguir"), pra apresentador acompanhar o fluxo da
 * reunião ao vivo sem precisar sair do banner.
 */
const itemFoco = ref<AssuntoPauta | null>(null)

const proximosAssuntos = computed(() => {
  if (!itemFoco.value || !props.evento.assuntos) return []
  return props.evento.assuntos.filter((a) => a.ordem > itemFoco.value!.ordem)
})

function focar(assunto: AssuntoPauta): void {
  itemFoco.value = itemFoco.value?.ordem === assunto.ordem ? null : assunto
}

/** Enter sem holofote ativo abre o primeiro assunto; com holofote ativo, avança pro próximo. */
function avancar(): void {
  const assuntos = props.evento.assuntos
  if (!assuntos || assuntos.length === 0) return
  if (!itemFoco.value) {
    itemFoco.value = assuntos[0]
    return
  }
  const proximo = assuntos.find((a) => a.ordem === itemFoco.value!.ordem + 1)
  if (proximo) itemFoco.value = proximo
}

function onKeydown(evento: KeyboardEvent): void {
  if (evento.key === 'Escape') {
    if (itemFoco.value) {
      itemFoco.value = null
    } else {
      emit('fechar')
    }
    return
  }
  if (evento.key === 'Enter') {
    evento.preventDefault()
    avancar()
  }
}

// Trava o scroll da página por trás enquanto o banner ocupa a tela inteira.
onMounted(() => {
  document.addEventListener('keydown', onKeydown)
  document.body.style.overflow = 'hidden'
})
onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <!--
      Superfície de cerimônia, não de leitura: navy+latão fixos (não invertem
      com o tema do sistema, ver main.css) — o banner projetado num telão
      precisa ter sempre a mesma cara, diferente da página de detalhe (que
      usa papel claro e acompanha o tema de quem está lendo).
    -->
    <div class="fixed inset-0 z-[999] flex overflow-hidden bg-brand text-on-brand">
      <!-- coluna: a "lombada" do dossiê — Quando/Onde/Quem, do topo ao rodapé -->
      <aside
        class="animate-rise flex h-full shrink-0 flex-col overflow-y-auto border-r border-brass/20 bg-brand-2"
        style="width: clamp(13rem, 19vw, 19rem); padding: clamp(1.25rem, 2.5vw, 2rem); gap: clamp(1.25rem, 2.5vh, 2rem); animation-delay: 40ms"
      >
        <div class="flex items-center gap-2.5">
          <span
            class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-brass/50 font-display text-xs font-black text-brass"
          >
            C
          </span>
          <div class="min-w-0 leading-tight">
            <p class="font-mono text-[10px] uppercase tracking-widest text-on-brand/50">SEFAZ · MA</p>
            <p class="truncate text-xs font-semibold text-on-brand/80">CTRT</p>
          </div>
        </div>

        <div>
          <span
            class="block font-display font-black leading-none tabular-nums text-brass"
            style="font-size: clamp(2.75rem, 6vw, 4.5rem)"
          >
            {{ partes.dia }}
          </span>
          <span
            class="mt-1 block font-mono font-semibold uppercase tracking-[0.2em] text-on-brand/60"
            style="font-size: clamp(0.65rem, 1vw, 0.8rem)"
          >
            {{ partes.mes }} · {{ partes.ano }}
          </span>

          <p class="font-mono uppercase tracking-widest text-brass/70" style="margin-top: clamp(0.85rem, 1.7vh, 1.4rem); font-size: 10px">
            Quando
          </p>
          <p v-if="evento.hora" class="font-mono font-semibold tabular-nums text-on-brand" style="font-size: clamp(1.1rem, 1.8vw, 1.4rem)">
            {{ evento.hora }}
          </p>
        </div>

        <div class="border-t border-brass/15" style="padding-top: clamp(1rem, 2vh, 1.5rem)">
          <p class="font-mono uppercase tracking-widest text-brass/70" style="font-size: 10px">Onde</p>
          <p class="mt-1 font-semibold text-on-brand" style="font-size: clamp(0.85rem, 1.1vw, 1rem)">{{ evento.local }}</p>
          <span
            v-if="evento.modalidade"
            class="mt-1.5 inline-flex rounded-chip bg-on-brand/10 px-1.5 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wide text-on-brand/70"
          >
            {{ evento.modalidade }}
          </span>
        </div>

        <div v-if="evento.publicoAlvo" class="min-h-0 flex-1 border-t border-brass/15" style="padding-top: clamp(1rem, 2vh, 1.5rem)">
          <p class="font-mono uppercase tracking-widest text-brass/70" style="font-size: 10px">Quem</p>
          <p class="mt-1 leading-snug text-on-brand/80" style="font-size: clamp(0.72rem, 0.95vw, 0.85rem)">{{ evento.publicoAlvo }}</p>
        </div>
      </aside>

      <!-- palco: título + pauta/informes -->
      <div class="relative flex min-h-0 flex-1 flex-col overflow-hidden" style="padding: clamp(1.5rem, 3vw, 3rem)">
        <!-- numeral fantasma: textura de protocolo carimbado, não decoração solta -->
        <span
          v-if="numeroSequencial"
          class="pointer-events-none absolute select-none font-display font-black text-brass"
          style="right: clamp(-2rem, -2vw, 1rem); top: 50%; transform: translateY(-50%); font-size: clamp(16rem, 30vw, 34rem); line-height: 1; opacity: 0.06"
          aria-hidden="true"
        >
          {{ numeroSequencial }}
        </span>

        <button
          type="button"
          class="absolute right-[clamp(1.25rem,2.5vw,2rem)] top-[clamp(1.25rem,2.5vw,2rem)] z-10 flex h-9 w-9 items-center justify-center rounded-sm border border-on-brand/15 bg-brand-2 text-on-brand/50 transition hover:border-brass hover:text-brass"
          aria-label="Fechar banner"
          @click="emit('fechar')"
        >
          <IconFechar class="h-4 w-4" />
        </button>

        <div class="animate-rise relative z-[1] shrink-0" style="animation-delay: 90ms; padding-right: 3rem">
          <span
            class="inline-flex items-center gap-1.5 rounded-chip px-2.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-wide"
            :class="{
              'bg-status-critical/15 text-status-critical': evento.status === 'suspenso',
              'bg-status-good/15 text-status-good': evento.status !== 'suspenso' && estado === 'hoje',
              'bg-brass/15 text-brass': evento.status !== 'suspenso' && estado === 'futuro',
              'bg-on-brand/10 text-on-brand/60': evento.status !== 'suspenso' && estado === 'passado',
            }"
          >
            <span
              v-if="evento.status !== 'suspenso' && estado === 'hoje'"
              class="h-1.5 w-1.5 animate-pulse rounded-full bg-status-good"
              aria-hidden="true"
            />
            {{ rotuloEstado }}
          </span>
          <span class="ml-2 font-mono text-xs uppercase tracking-widest text-on-brand/50">
            {{ evento.tipo }}<template v-if="evento.numero"> · Nº {{ evento.numero }}</template>
          </span>

          <h1
            class="mt-2 font-display font-black uppercase leading-[0.92] tracking-tight text-on-brand"
            style="font-size: clamp(2rem, 4.2vw, 4.25rem)"
          >
            {{ evento.titulo }}
          </h1>
        </div>

        <div
          class="animate-rise relative z-[1] flex min-h-0 flex-1 flex-col overflow-y-auto"
          style="margin-top: clamp(1.5rem, 3vh, 2.5rem); animation-delay: 140ms"
        >
          <Transition name="fade-rise" mode="out-in">
            <!-- lista da pauta -->
            <div v-if="!itemFoco" key="lista" class="flex flex-col" style="gap: clamp(1rem, 2vh, 1.5rem)">
              <div v-if="evento.assuntos && evento.assuntos.length > 0">
                <p class="font-mono font-semibold uppercase tracking-widest text-brass" style="font-size: clamp(0.85rem, 1.3vw, 1.05rem)">
                  O quê
                </p>
                <div class="mt-2 flex flex-col" style="gap: clamp(0.6rem, 1.2vh, 0.9rem)">
                  <div
                    v-for="assunto in evento.assuntos"
                    :key="assunto.ordem"
                    role="button"
                    tabindex="0"
                    class="flex cursor-pointer items-center gap-3 rounded-sm border border-on-brand/10 bg-brand-2 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-brass"
                    style="padding: clamp(0.65rem, 1.3vh, 1rem) clamp(0.85rem, 1.6vw, 1.25rem)"
                    @click="focar(assunto)"
                    @keydown.enter.stop.prevent="focar(assunto)"
                  >
                    <span
                      class="flex shrink-0 items-center justify-center rounded-full bg-brass font-mono font-bold text-brand"
                      style="height: clamp(1.5rem, 2.2vw, 2rem); width: clamp(1.5rem, 2.2vw, 2rem); font-size: clamp(0.75rem, 1vw, 0.95rem)"
                    >
                      {{ assunto.ordem }}
                    </span>
                    <div class="min-w-0">
                      <p class="font-medium leading-snug text-on-brand" style="font-size: clamp(1rem, 1.6vw, 1.3rem)">
                        {{ assunto.titulo }}
                      </p>
                      <p class="mt-0.5 font-mono uppercase tracking-wide text-on-brand/50" style="font-size: clamp(0.65rem, 0.95vw, 0.8rem)">
                        {{ assunto.responsavel }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div v-else-if="pautaAtividades.length > 0">
                <p class="font-mono font-semibold uppercase tracking-widest text-brass" style="font-size: clamp(0.85rem, 1.3vw, 1.05rem)">
                  {{ evento.status === 'agendado' ? 'Pauta provisória' : 'Apresentações' }}
                </p>
                <div class="mt-2 flex flex-col" style="gap: clamp(0.6rem, 1.2vh, 0.9rem)">
                  <div
                    v-for="atividade in pautaAtividades"
                    :key="atividade.id"
                    class="flex items-center gap-3 rounded-sm border border-on-brand/10 bg-brand-2"
                    style="padding: clamp(0.65rem, 1.3vh, 1rem) clamp(0.85rem, 1.6vw, 1.25rem)"
                  >
                    <AreaAvatar v-if="areaDe(atividade)" :area="areaDe(atividade)!" size="sm" />
                    <p class="min-w-0 truncate font-medium text-on-brand" style="font-size: clamp(1rem, 1.6vw, 1.3rem)">
                      {{ atividade.titulo }}
                    </p>
                  </div>
                </div>
              </div>

              <div v-if="evento.informes && evento.informes.length > 0">
                <p class="font-mono font-semibold uppercase tracking-widest text-brass" style="font-size: clamp(0.85rem, 1.3vw, 1.05rem)">
                  Informes
                </p>
                <div class="mt-2 flex flex-col" style="gap: clamp(0.5rem, 1vh, 0.75rem)">
                  <div
                    v-for="(informe, indice) in evento.informes"
                    :key="indice"
                    class="rounded-sm border border-on-brand/10 border-l-[3px] border-l-brass bg-brand-2"
                    style="padding: clamp(0.6rem, 1.1vh, 0.85rem) clamp(0.85rem, 1.6vw, 1.25rem)"
                  >
                    <p class="leading-snug text-on-brand/90" style="font-size: clamp(0.9rem, 1.3vw, 1.1rem)">{{ informe }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- holofote: o assunto em destaque, quem apresenta como assinatura embaixo -->
            <div v-else key="foco" class="grid min-h-0 flex-1" style="grid-template-columns: minmax(0, 1fr) minmax(11rem, 26%); gap: clamp(1.5rem, 3vw, 3rem)">
              <div class="flex min-h-0 flex-col justify-center">
                <!-- :key troca a cada item — reentra a transição a cada avanço, não só ao abrir o holofote -->
                <Transition name="fade-rise" mode="out-in">
                  <button
                    :key="itemFoco.ordem"
                    type="button"
                    class="group flex items-start gap-4 text-left"
                    aria-label="Voltar à pauta"
                    @click="focar(itemFoco)"
                  >
                    <span
                      class="flex shrink-0 items-center justify-center rounded-full bg-brass font-mono font-bold text-brand transition-transform duration-200 group-hover:scale-95"
                      style="height: clamp(2.5rem, 4vw, 3.5rem); width: clamp(2.5rem, 4vw, 3.5rem); font-size: clamp(1.1rem, 1.6vw, 1.5rem)"
                    >
                      {{ itemFoco.ordem }}
                    </span>
                    <div class="min-w-0">
                      <p class="font-mono uppercase tracking-widest text-brass/70" style="font-size: clamp(0.65rem, 0.9vw, 0.78rem)">
                        Projeto
                      </p>
                      <p
                        class="font-display font-black leading-[1.02] tracking-tight text-brass"
                        style="font-size: clamp(1.85rem, 4vw, 3.75rem)"
                      >
                        {{ itemFoco.titulo }}
                      </p>
                      <p class="mt-4 flex items-baseline gap-2">
                        <span class="font-mono uppercase tracking-widest text-on-brand/40" style="font-size: clamp(0.65rem, 0.85vw, 0.75rem)">
                          Apresenta
                        </span>
                        <span class="font-display font-bold text-on-brand" style="font-size: clamp(1.05rem, 1.7vw, 1.4rem)">
                          {{ itemFoco.responsavel }}
                        </span>
                      </p>
                    </div>
                  </button>
                </Transition>
                <p class="font-mono uppercase tracking-widest text-on-brand/30" style="margin-top: clamp(1rem, 2vh, 1.75rem); font-size: 10px">
                  Enter avança · Esc volta à pauta
                </p>
              </div>

              <div
                v-if="proximosAssuntos.length > 0"
                class="flex min-h-0 flex-col overflow-y-auto border-l border-brass/15"
                style="padding-left: clamp(1.25rem, 2.5vw, 2rem); gap: clamp(0.6rem, 1.2vh, 0.9rem)"
              >
                <p class="font-mono font-semibold uppercase tracking-widest text-brass/70" style="font-size: 10px">A seguir</p>
                <div
                  v-for="prox in proximosAssuntos"
                  :key="prox.ordem"
                  role="button"
                  tabindex="0"
                  class="flex cursor-pointer items-center gap-2.5 rounded-sm border border-on-brand/10 bg-brand-2 text-left transition hover:border-brass"
                  style="padding: clamp(0.5rem, 1vh, 0.7rem) clamp(0.65rem, 1.2vw, 0.9rem)"
                  @click="focar(prox)"
                  @keydown.enter.stop.prevent="focar(prox)"
                >
                  <span
                    class="flex shrink-0 items-center justify-center rounded-full border border-brass/50 font-mono font-bold text-brass"
                    style="height: 1.5rem; width: 1.5rem; font-size: 0.7rem"
                  >
                    {{ prox.ordem }}
                  </span>
                  <div class="min-w-0">
                    <p class="truncate font-semibold text-on-brand" style="font-size: clamp(0.78rem, 1vw, 0.92rem)">
                      {{ prox.titulo }}
                    </p>
                    <p class="truncate text-on-brand/50" style="font-size: clamp(0.65rem, 0.85vw, 0.76rem)">{{ prox.responsavel }}</p>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </div>
  </Teleport>
</template>
