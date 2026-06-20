<template>
  <AdminLayout>
    <div class="space-y-8">
      <!-- Stats -->
      <div>
        <h2 class="font-display font-semibold text-text text-lg mb-5">Vue d'ensemble</h2>
        <div class="grid sm:grid-cols-3 gap-4">
          <StatBlock
            v-for="(stat, i) in stats"
            :key="stat.label"
            :label="stat.label"
            :value="stat.value"
            :trend="stat.trend"
            :sub="stat.sub"
            :delay="i * 0.1"
          />
        </div>
      </div>

      <!-- Recent requests -->
      <div>
        <div class="flex items-center justify-between mb-4">
          <h2 class="font-display font-semibold text-text text-lg">Demandes récentes</h2>
          <RouterLink to="/admin/demandes" class="text-accent text-sm hover:underline flex items-center gap-1">
            Tout voir <ChevronRight class="w-3.5 h-3.5" />
          </RouterLink>
        </div>

        <div class="bg-surface-1 border border-border rounded-lg overflow-hidden">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-border">
                <th class="text-left px-4 py-3 text-text-3 text-xs font-medium uppercase tracking-widest">Client</th>
                <th class="text-left px-4 py-3 text-text-3 text-xs font-medium uppercase tracking-widest hidden sm:table-cell">Ville</th>
                <th class="text-left px-4 py-3 text-text-3 text-xs font-medium uppercase tracking-widest hidden md:table-cell">Date</th>
                <th class="text-left px-4 py-3 text-text-3 text-xs font-medium uppercase tracking-widest">Statut</th>
                <th />
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="req in recentRequests"
                :key="req.id"
                class="border-b border-border last:border-0 hover:bg-surface-2 transition-colors"
              >
                <td class="px-4 py-3.5 text-text font-medium">{{ req.client.name }}</td>
                <td class="px-4 py-3.5 text-text-2 hidden sm:table-cell">{{ req.client.city }}</td>
                <td class="px-4 py-3.5 text-text-3 hidden md:table-cell font-mono text-xs">{{ formatDate(req.createdAt) }}</td>
                <td class="px-4 py-3.5"><BaseBadge :status="statusMap[req.status].color">{{ statusMap[req.status].label }}</BaseBadge></td>
                <td class="px-4 py-3.5">
                  <RouterLink :to="`/admin/demandes/${req.id}`" class="text-accent text-xs flex items-center gap-0.5">
                    Voir <ChevronRight class="w-3 h-3" />
                  </RouterLink>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Quick links -->
      <div class="grid sm:grid-cols-2 gap-4">
        <RouterLink
          v-for="link in quickLinks"
          :key="link.to"
          :to="link.to"
          class="flex items-center gap-4 bg-surface-1 border border-border rounded-lg p-5 hover:border-border-strong hover:bg-surface-2 transition-colors group"
        >
          <div class="w-10 h-10 rounded-lg bg-surface-2 flex items-center justify-center text-text-2 group-hover:text-accent transition-colors shrink-0">
            <component :is="link.icon" class="w-5 h-5" />
          </div>
          <div class="flex-1">
            <p class="font-display font-semibold text-text text-sm group-hover:text-accent transition-colors">{{ link.label }}</p>
            <p class="text-text-3 text-xs">{{ link.desc }}</p>
          </div>
          <ChevronRight class="w-4 h-4 text-text-3 group-hover:text-accent transition-colors" />
        </RouterLink>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { ChevronRight, ClipboardList, GalleryHorizontal } from 'lucide-vue-next'
import { getRequests } from '@/mocks/api.js'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import StatBlock from '@/components/ui/StatBlock.vue'
import BaseBadge from '@/components/ui/BaseBadge.vue'

const allRequests = ref([])
onMounted(async () => { allRequests.value = await getRequests() })

const recentRequests = computed(() => allRequests.value.slice(0, 5))

const stats = computed(() => {
  const all = allRequests.value
  return [
    { label: 'Nouvelles demandes', value: all.filter(r => r.status === 'nouveau').length,  trend: '',   sub: 'En attente de traitement' },
    { label: 'En cours',           value: all.filter(r => r.status === 'en_cours').length, trend: '',   sub: 'Devis envoyé / en discussion' },
    { label: 'Traitées',           value: all.filter(r => r.status === 'traite').length,   trend: '+3', sub: 'Ce mois-ci' },
  ]
})

const statusMap = {
  nouveau:  { label: 'Nouveau',  color: 'info' },
  en_cours: { label: 'En cours', color: 'warning' },
  traite:   { label: 'Traité',   color: 'success' },
}

const quickLinks = [
  { to: '/admin/demandes',  icon: ClipboardList,    label: 'Toutes les demandes',  desc: 'Gérer et filtrer les demandes reçues' },
  { to: '/admin/portfolio', icon: GalleryHorizontal, label: 'Gérer le portfolio',  desc: 'Ajouter, modifier ou supprimer des réalisations' },
]

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: '2-digit' })
}
</script>
