<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useAreasStore } from '@/stores/areas'
import { useFeedStore } from '@/stores/feed'
import FeedAreaFilter from '@/components/painel/FeedAreaFilter.vue'
import FeedList from '@/components/painel/FeedList.vue'

const route = useRoute()
const areasStore = useAreasStore()
const feedStore = useFeedStore()

const areaFiltro = ref(typeof route.query.area === 'string' ? route.query.area : '')

const publicacoesFiltradas = computed(() =>
  areaFiltro.value ? feedStore.porArea(areaFiltro.value) : feedStore.publicacoes,
)
</script>

<template>
  <div>
    <header class="border-b border-line bg-card">
      <div class="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <nav class="mb-4 flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-ink-soft">
          <router-link to="/" class="hover:text-ink">Painel</router-link>
          <span>/</span>
          <span class="text-ink">Feed completo</span>
        </nav>

        <div class="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 class="font-display text-2xl font-extrabold text-ink sm:text-3xl">Feed de notícias</h1>
            <p class="mt-1 text-sm text-ink-soft">Todas as entregas validadas e publicadas pelas áreas.</p>
          </div>
          <FeedAreaFilter v-model:selecionada="areaFiltro" :areas="areasStore.areas" />
        </div>
      </div>
    </header>

    <div class="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <FeedList :publicacoes="publicacoesFiltradas" />
    </div>
  </div>
</template>
