<script setup lang="ts">
import { useInstitucionalStore } from '@/stores/institucional'

const institucional = useInstitucionalStore()
const anoAtual = new Date().getFullYear()
</script>

<template>
  <footer class="border-t border-line bg-paper-dim">
    <div
      class="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-xs text-ink-soft sm:flex-row sm:items-center sm:justify-between sm:px-6"
    >
      <p>{{ institucional.nomePainel }} — {{ institucional.orgaoNome }} ({{ institucional.orgaoSigla }}).</p>
      <router-link to="/documentacao" class="font-semibold text-brass hover:underline">
        Documentação
      </router-link>
      <p class="font-mono text-[11px] uppercase tracking-widest text-ink-soft/70">
        © {{ anoAtual }} · {{ institucional.comiteSigla }} · dados de demonstração
      </p>
    </div>
  </footer>
</template>
