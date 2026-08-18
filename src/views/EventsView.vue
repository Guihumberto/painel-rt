<script setup lang="ts">
import { useEventsStore } from '@/stores/events'
import EventoListItem from '@/components/events/EventoListItem.vue'

const eventsStore = useEventsStore()
</script>

<template>
  <div>
    <header class="border-b border-line bg-card">
      <div class="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <nav class="mb-4 flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-ink-soft">
          <router-link to="/" class="hover:text-ink">Painel</router-link>
          <span>/</span>
          <span class="text-ink">Eventos</span>
        </nav>

        <h1 class="font-display text-2xl font-extrabold text-ink sm:text-3xl">Seminários institucionais</h1>
        <p class="mt-1 text-sm text-ink-soft">
          A cada trimestre, as atividades mais demandadas em "Quero saber mais" viram apresentações de
          15 minutos — palco para quem entregou, e pauta que qualquer servidor ajuda a escolher.
        </p>
      </div>
    </header>

    <div class="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-8 sm:px-6">
      <section v-if="eventsStore.proximos.length > 0" class="flex flex-col gap-3">
        <h2 class="font-mono text-xs font-semibold uppercase tracking-widest text-ink-soft">
          Próximos eventos
        </h2>
        <EventoListItem
          v-for="evento in eventsStore.proximos"
          :key="evento.id"
          :evento="evento"
          :atividades="eventsStore.atividadesDe(evento)"
        />
      </section>

      <section class="flex flex-col gap-3">
        <h2 class="font-mono text-xs font-semibold uppercase tracking-widest text-ink-soft">
          Histórico
        </h2>
        <EventoListItem
          v-for="evento in eventsStore.passados"
          :key="evento.id"
          :evento="evento"
          :atividades="eventsStore.atividadesDe(evento)"
        />
        <p v-if="eventsStore.passados.length === 0" class="text-sm text-ink-soft">
          Ainda não há seminários realizados.
        </p>
      </section>
    </div>
  </div>
</template>
