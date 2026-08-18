<script setup lang="ts">
import { computed } from 'vue'
import type { Publicacao } from '@/types/publication'
import { useAreasStore } from '@/stores/areas'
import FeedCard from './FeedCard.vue'
import FeedCardCompact from './FeedCardCompact.vue'

const props = withDefaults(
  defineProps<{ publicacoes: Publicacao[]; compact?: boolean }>(),
  { compact: false },
)

const areasStore = useAreasStore()

const itens = computed(() =>
  props.publicacoes.map((publicacao) => ({
    publicacao,
    areas: publicacao.areaIds
      .map((id) => areasStore.getById(id))
      .filter((area): area is NonNullable<typeof area> => Boolean(area)),
  })),
)
</script>

<template>
  <p
    v-if="itens.length === 0"
    class="rounded-card border border-dashed border-line p-8 text-center text-sm text-ink-soft"
  >
    Nenhuma publicação encontrada para essa área ainda.
  </p>

  <div v-else-if="compact" class="panel flex flex-col divide-y divide-line p-2">
    <FeedCardCompact
      v-for="item in itens"
      :key="item.publicacao.id"
      :publicacao="item.publicacao"
      :areas="item.areas"
    />
  </div>

  <div v-else class="flex flex-col gap-4">
    <FeedCard
      v-for="item in itens"
      :key="item.publicacao.id"
      :publicacao="item.publicacao"
      :areas="item.areas"
    />
  </div>
</template>
