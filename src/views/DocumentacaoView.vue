<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { CATEGORIAS_DOCUMENTACAO } from '@/content/documentacao'
import { buscar } from '@/composables/useDocBusca'
import DocSidebar from '@/components/documentacao/DocSidebar.vue'
import DocBlock from '@/components/documentacao/DocBlock.vue'

const route = useRoute()
const router = useRouter()

const busca = ref('')
const categoriasFiltradas = computed(() => buscar(CATEGORIAS_DOCUMENTACAO, busca.value))

const TODOS_ARTIGOS = CATEGORIAS_DOCUMENTACAO.flatMap((categoria) => categoria.artigos)
const ARTIGO_PADRAO_ID = TODOS_ARTIGOS[0].id

const artigoAtivoId = computed(() => {
  const idNaRota = route.query.a
  return typeof idNaRota === 'string' ? idNaRota : ARTIGO_PADRAO_ID
})

const artigoAtivo = computed(
  () => TODOS_ARTIGOS.find((artigo) => artigo.id === artigoAtivoId.value) ?? TODOS_ARTIGOS[0],
)

function selecionar(artigoId: string): void {
  router.push({ query: { ...route.query, a: artigoId } })
}
</script>

<template>
  <div>
    <header class="border-b border-line bg-card">
      <div class="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <nav class="mb-4 flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-ink-soft">
          <router-link to="/" class="hover:text-ink">Painel</router-link>
          <span>/</span>
          <span class="text-ink">Documentação</span>
        </nav>

        <h1 class="font-display text-2xl font-extrabold text-ink sm:text-3xl">Documentação</h1>
        <p class="mt-1 text-sm text-ink-soft">
          O que é o painel, o que cada perfil faz e como executar as ações disponíveis hoje.
        </p>
      </div>
    </header>

    <div class="mx-auto grid grid-cols-1 gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[16rem_minmax(0,1fr)] lg:items-start">
      <aside class="panel overflow-y-auto p-5 lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)]">
        <DocSidebar
          v-model:busca="busca"
          :categorias="categoriasFiltradas"
          :artigo-ativo-id="artigoAtivoId"
          @selecionar="selecionar"
        />
      </aside>

      <article class="panel min-w-0 flex flex-col gap-4 p-6 sm:p-8">
        <h2 class="font-display text-xl font-bold text-ink">{{ artigoAtivo.titulo }}</h2>
        <DocBlock v-for="(bloco, i) in artigoAtivo.blocos" :key="i" :bloco="bloco" />
      </article>
    </div>
  </div>
</template>
