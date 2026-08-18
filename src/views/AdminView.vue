<script setup lang="ts">
const SECOES = [
  {
    to: '/admin/parametros',
    titulo: 'Parâmetros',
    descricao: 'SLA de validação, limiar do contador de interesse e os bônus do índice de cumprimento.',
  },
  {
    to: '/admin/usuarios',
    titulo: 'Usuários',
    descricao: 'Cadastrar, editar e remover os usuários de demonstração — alimenta as opções de login.',
  },
]
</script>

<template>
  <div>
    <header class="border-b border-line bg-card">
      <div class="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <nav class="mb-4 flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-ink-soft">
          <router-link to="/" class="hover:text-ink">Painel</router-link>
          <span>/</span>
          <span class="text-ink">Administração</span>
        </nav>

        <h1 class="font-display text-2xl font-extrabold text-ink sm:text-3xl">Administração</h1>
        <p class="mt-1 text-sm text-ink-soft">
          Parâmetros e usuários do protótipo. "Agir no lugar de" área/validador ainda não existe —
          ver <code class="font-mono">docs/roteiro-fase-2.md</code>.
        </p>
      </div>
    </header>

    <div class="mx-auto grid max-w-2xl grid-cols-1 gap-4 px-4 py-8 sm:grid-cols-2 sm:px-6">
      <router-link
        v-for="secao in SECOES"
        :key="secao.to"
        :to="secao.to"
        class="panel flex flex-col gap-1.5 p-5 transition hover:border-brass"
      >
        <h2 class="font-display text-base font-bold text-ink">{{ secao.titulo }}</h2>
        <p class="text-sm text-ink-soft">{{ secao.descricao }}</p>
      </router-link>
    </div>
  </div>
</template>
