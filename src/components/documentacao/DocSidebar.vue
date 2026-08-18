<script setup lang="ts">
import type { CategoriaDoc } from '@/types/documentacao'

defineProps<{ categorias: CategoriaDoc[]; artigoAtivoId: string }>()

const emit = defineEmits<{ selecionar: [artigoId: string] }>()

const busca = defineModel<string>('busca', { default: '' })
</script>

<template>
  <nav class="flex flex-col gap-5">
    <div class="flex flex-col gap-1.5">
      <label for="doc-busca" class="font-mono text-[11px] uppercase tracking-widest text-ink-soft">
        Buscar na documentação
      </label>
      <input
        id="doc-busca"
        v-model="busca"
        type="search"
        placeholder="Ex.: SLA, validar, parâmetros…"
        class="rounded-sm border border-line bg-paper px-3 py-2 text-sm text-ink focus:border-brass focus:outline-none"
      />
    </div>

    <div v-for="categoria in categorias" :key="categoria.id" class="flex flex-col gap-1.5">
      <p class="font-mono text-[11px] uppercase tracking-widest text-ink-soft">{{ categoria.titulo }}</p>
      <ul class="flex flex-col gap-0.5">
        <li v-for="artigo in categoria.artigos" :key="artigo.id">
          <button
            type="button"
            class="w-full rounded-sm px-2.5 py-1.5 text-left text-sm transition"
            :class="
              artigo.id === artigoAtivoId
                ? 'bg-brand font-semibold text-on-brand'
                : 'text-ink hover:bg-paper-dim'
            "
            @click="emit('selecionar', artigo.id)"
          >
            {{ artigo.titulo }}
          </button>
        </li>
      </ul>
    </div>

    <p v-if="categorias.length === 0" class="text-sm text-ink-soft">
      Nenhum artigo encontrado para essa busca.
    </p>
  </nav>
</template>
