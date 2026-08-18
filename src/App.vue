<script setup lang="ts">
import { onMounted } from 'vue'
import { useAreasStore } from '@/stores/areas'
import { useActivitiesStore } from '@/stores/activities'
import { useFeedStore } from '@/stores/feed'
import { useEventsStore } from '@/stores/events'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'

const areasStore = useAreasStore()
const activitiesStore = useActivitiesStore()
const feedStore = useFeedStore()
const eventsStore = useEventsStore()

onMounted(() => {
  areasStore.fetchAreas()
  activitiesStore.fetchAtividades()
  feedStore.fetchPublicacoes()
  eventsStore.fetchEventos()
})
</script>

<template>
  <div class="flex min-h-screen flex-col bg-paper">
    <AppHeader />
    <main class="flex-1">
      <router-view />
    </main>
    <AppFooter />
  </div>
</template>
