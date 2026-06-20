<template>
  <AdminLayout>
    <div class="space-y-6">
      <!-- Filters -->
      <div class="flex flex-wrap gap-2 items-center justify-between">
        <div class="flex flex-wrap gap-2">
          <button
            v-for="f in filters"
            :key="f.value"
            @click="activeFilter = f.value"
            :class="[
              'px-3.5 py-1.5 rounded-pill text-xs font-medium border transition-colors min-h-[36px]',
              activeFilter === f.value
                ? 'bg-accent border-accent text-white'
                : 'bg-surface-1 border-border text-text-2 hover:border-border-strong hover:text-text'
            ]"
          >
            {{ f.label }}
            <span class="ml-1 opacity-70">({{ countByStatus(f.value) }})</span>
          </button>
        </div>

        <!-- Date sort -->
        <button
          @click="toggleSort"
          class="flex items-center gap-1.5 px-3.5 py-1.5 rounded-sm text-xs font-medium bg-surface-1 border border-border text-text-2 hover:text-text transition-colors min-h-[36px]"
        >
          Date {{ sortAsc ? '↑' : '↓' }}
        </button>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex justify-center py-12">
        <LoadingState label="Chargement des demandes…" />
      </div>

      <!-- Table -->
      <div v-else class="bg-surface-1 border border-border rounded-lg overflow-hidden">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-border">
              <th class="text-left px-4 py-3 text-text-3 text-xs font-medium uppercase tracking-widest">Client</th>
              <th class="text-left px-4 py-3 text-text-3 text-xs font-medium uppercase tracking-widest hidden sm:table-cell">Ville</th>
              <th class="text-left px-4 py-3 text-text-3 text-xs font-medium uppercase tracking-widest hidden lg:table-cell">Dimensions</th>
              <th class="text-left px-4 py-3 text-text-3 text-xs font-medium uppercase tracking-widest hidden md:table-cell">Date</th>
              <th class="text-left px-4 py-3 text-text-3 text-xs font-medium uppercase tracking-widest">Statut</th>
              <th class="text-left px-4 py-3 text-text-3 text-xs font-medium uppercase tracking-widest hidden sm:table-cell">Prix</th>
              <th />
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="req in filteredRequests"
              :key="req.id"
              class="border-b border-border last:border-0 hover:bg-surface-2 transition-colors cursor-pointer"
              @click="$router.push(`/admin/demandes/${req.id}`)"
            >
              <td class="px-4 py-3.5">
                <p class="text-text font-medium">{{ req.client.name }}</p>
                <p class="text-text-3 text-xs">{{ req.client.email }}</p>
              </td>
              <td class="px-4 py-3.5 text-text-2 hidden sm:table-cell">{{ req.client.city }}</td>
              <td class="px-4 py-3.5 text-text-2 font-mono text-xs hidden lg:table-cell">
                {{ req.wall.width }}×{{ req.wall.height }}m
              </td>
              <td class="px-4 py-3.5 text-text-3 font-mono text-xs hidden md:table-cell">{{ formatDate(req.createdAt) }}</td>
              <td class="px-4 py-3.5">
                <BaseBadge :status="statusMap[req.status].color">{{ statusMap[req.status].label }}</BaseBadge>
              </td>
              <td class="px-4 py-3.5 text-text-2 hidden sm:table-cell">
                {{ req.finalPrice ? `${req.finalPrice.toLocaleString('fr-FR')} €` : '—' }}
              </td>
              <td class="px-4 py-3.5">
                <span class="text-accent text-xs">→</span>
              </td>
            </tr>
          </tbody>
        </table>

        <div v-if="filteredRequests.length === 0" class="text-center py-12 text-text-3 text-sm">
          Aucune demande pour ce filtre.
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getRequests } from '@/mocks/api.js'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import BaseBadge from '@/components/ui/BaseBadge.vue'
import LoadingState from '@/components/ui/LoadingState.vue'

const allRequests = ref([])
const loading = ref(true)
const activeFilter = ref('all')
const sortAsc = ref(false)

onMounted(async () => {
  allRequests.value = await getRequests()
  loading.value = false
})

const filters = [
  { value: 'all', label: 'Toutes' },
  { value: 'nouveau', label: 'Nouvelles' },
  { value: 'en_cours', label: 'En cours' },
  { value: 'traite', label: 'Traitées' },
]

const statusMap = {
  nouveau:  { label: 'Nouveau', color: 'info' },
  en_cours: { label: 'En cours', color: 'warning' },
  traite:   { label: 'Traité', color: 'success' },
}

const filteredRequests = computed(() => {
  let list = activeFilter.value === 'all'
    ? allRequests.value
    : allRequests.value.filter(r => r.status === activeFilter.value)

  return list.slice().sort((a, b) => {
    const diff = new Date(a.createdAt) - new Date(b.createdAt)
    return sortAsc.value ? diff : -diff
  })
})

function countByStatus(status) {
  if (status === 'all') return allRequests.value.length
  return allRequests.value.filter(r => r.status === status).length
}

function toggleSort() {
  sortAsc.value = !sortAsc.value
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: '2-digit' })
}
</script>
