<template>
  <AdminLayout>
    <div class="space-y-6">

      <!-- ── KPIs ──────────────────────────────────────────────────── -->
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div class="kpi-card">
          <div class="kpi-icon" style="--ki:#3D7BFF"><Inbox class="w-4 h-4" /></div>
          <div>
            <p class="kpi-label">Total</p>
            <p class="kpi-value">{{ allRequests.length }}</p>
          </div>
        </div>
        <div class="kpi-card kpi-card--clickable" @click="setStatus('nouveau')">
          <div class="kpi-icon" style="--ki:#3D7BFF"><Bell class="w-4 h-4" /></div>
          <div>
            <p class="kpi-label">Nouvelles</p>
            <p class="kpi-value text-accent">{{ countStatus('nouveau') }}</p>
          </div>
          <span v-if="countStatus('nouveau') > 0" class="kpi-badge">!</span>
        </div>
        <div class="kpi-card kpi-card--clickable" @click="setStatus('en_cours')">
          <div class="kpi-icon" style="--ki:#F6B84E"><Loader class="w-4 h-4" /></div>
          <div>
            <p class="kpi-label">En cours</p>
            <p class="kpi-value text-warning">{{ countStatus('en_cours') }}</p>
          </div>
        </div>
        <div class="kpi-card kpi-card--clickable" @click="setStatus('traite')">
          <div class="kpi-icon" style="--ki:#4ADE80"><CheckCircle2 class="w-4 h-4" /></div>
          <div>
            <p class="kpi-label">Traitées</p>
            <p class="kpi-value text-success">{{ countStatus('traite') }}</p>
          </div>
        </div>
        <div class="kpi-card sm:col-span-1 col-span-2">
          <div class="kpi-icon" style="--ki:#FBBF24"><DollarSign class="w-4 h-4" /></div>
          <div>
            <p class="kpi-label">CA généré</p>
            <p class="kpi-value text-warning">{{ totalRevenue }}</p>
          </div>
        </div>
      </div>

      <!-- ── FILTERS ───────────────────────────────────────────────── -->
      <div class="space-y-2">

        <!-- Status row -->
        <div class="flex flex-wrap gap-2 items-center justify-between">
          <div class="flex flex-wrap gap-1.5">
            <button
              v-for="f in statusFilters"
              :key="f.value"
              @click="activeStatus = f.value"
              :class="['filter-pill', activeStatus === f.value ? 'filter-pill--active' : '']"
              :style="activeStatus === f.value && f.color ? { '--fp': f.color } : {}"
            >
              <span v-if="f.dot" class="w-1.5 h-1.5 rounded-full shrink-0" :style="{ background: f.dot }" />
              {{ f.label }}
              <span class="filter-count">{{ countStatus(f.value) }}</span>
            </button>
          </div>

          <!-- Sort + search -->
          <div class="flex items-center gap-2">
            <div class="relative">
              <Search class="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-text-3 pointer-events-none" />
              <input
                v-model="search"
                placeholder="Rechercher…"
                class="pl-8 pr-3 py-1.5 bg-surface-1 border border-border rounded-lg text-xs text-text placeholder-text-3 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 w-40 transition-colors"
              />
            </div>
            <button
              @click="sortAsc = !sortAsc"
              class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-surface-1 border border-border text-text-2 hover:text-text transition-colors"
            >
              <ArrowUpDown class="w-3.5 h-3.5" />
              {{ sortAsc ? 'Plus ancienne' : 'Plus récente' }}
            </button>
          </div>
        </div>

        <!-- Service type row -->
        <div class="flex flex-wrap gap-1.5">
          <button
            v-for="s in serviceFilters"
            :key="s.value"
            @click="activeService = s.value"
            :class="['service-pill', activeService === s.value ? 'service-pill--active' : '']"
            :style="activeService === s.value ? { '--sp': s.color } : {}"
          >
            <component :is="s.icon" class="w-3.5 h-3.5 shrink-0" />
            {{ s.label }}
            <span class="filter-count">{{ countService(s.value) }}</span>
          </button>
        </div>
      </div>

      <!-- ── LOADING ────────────────────────────────────────────────── -->
      <div v-if="loading" class="flex justify-center py-16">
        <BlechEsmLoader size="64px" label="Chargement…" />
      </div>

      <!-- ── TABLE ─────────────────────────────────────────────────── -->
      <div v-else class="bg-surface-1 border border-border rounded-xl overflow-hidden">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-border bg-surface-2">
              <th class="text-left px-4 py-3 text-text-3 text-[11px] font-semibold uppercase tracking-widest">Client</th>
              <th class="text-left px-4 py-3 text-text-3 text-[11px] font-semibold uppercase tracking-widest hidden md:table-cell">Service</th>
              <th class="text-left px-4 py-3 text-text-3 text-[11px] font-semibold uppercase tracking-widest hidden lg:table-cell">Budget</th>
              <th class="text-left px-4 py-3 text-text-3 text-[11px] font-semibold uppercase tracking-widest hidden md:table-cell">Date</th>
              <th class="text-left px-4 py-3 text-text-3 text-[11px] font-semibold uppercase tracking-widest">Statut</th>
              <th class="text-left px-4 py-3 text-text-3 text-[11px] font-semibold uppercase tracking-widest hidden sm:table-cell">Prix</th>
              <th class="w-8" />
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="req in filteredRequests"
              :key="req.id"
              class="border-b border-border last:border-0 hover:bg-surface-2/60 transition-colors cursor-pointer group"
              @click="$router.push(`/admin/demandes/${req.id}`)"
            >
              <!-- Client -->
              <td class="px-4 py-3.5">
                <div class="flex items-center gap-2.5">
                  <div class="avatar">{{ initials(req.client.name) }}</div>
                  <div class="min-w-0">
                    <p class="text-text font-medium truncate">{{ req.client.name }}</p>
                    <p class="text-text-3 text-xs truncate">{{ req.client.email }}</p>
                  </div>
                </div>
              </td>

              <!-- Service -->
              <td class="px-4 py-3.5 hidden md:table-cell">
                <span class="service-tag" :style="serviceStyle(req.serviceType)">
                  <component :is="serviceIcon(req.serviceType)" class="w-3 h-3 shrink-0" />
                  {{ serviceLabel(req.serviceType) }}
                </span>
              </td>

              <!-- Budget -->
              <td class="px-4 py-3.5 hidden lg:table-cell">
                <span class="text-warning text-xs font-mono">{{ req.budget ?? '—' }}</span>
              </td>

              <!-- Date -->
              <td class="px-4 py-3.5 text-text-3 font-mono text-xs hidden md:table-cell">
                {{ formatDate(req.createdAt) }}
              </td>

              <!-- Status -->
              <td class="px-4 py-3.5">
                <div class="flex items-center gap-1.5">
                  <span class="w-1.5 h-1.5 rounded-full shrink-0" :style="{ background: statusMap[req.status]?.dot }" />
                  <span class="text-xs font-medium" :style="{ color: statusMap[req.status]?.dot }">
                    {{ statusMap[req.status]?.label }}
                  </span>
                </div>
              </td>

              <!-- Price -->
              <td class="px-4 py-3.5 hidden sm:table-cell">
                <span :class="req.finalPrice ? 'text-success font-mono text-xs font-semibold' : 'text-text-3 text-xs'">
                  {{ req.finalPrice ? `${req.finalPrice.toLocaleString('fr-FR')} DT` : '—' }}
                </span>
              </td>

              <!-- Arrow -->
              <td class="px-3 py-3.5">
                <ChevronRight class="w-4 h-4 text-text-3 group-hover:text-accent transition-colors" />
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Empty state -->
        <div v-if="filteredRequests.length === 0" class="text-center py-16">
          <div class="w-12 h-12 rounded-xl bg-surface-2 border border-border flex items-center justify-center mx-auto mb-3">
            <Inbox class="w-5 h-5 text-text-3 opacity-50" />
          </div>
          <p class="text-text-2 text-sm font-medium mb-1">Aucune demande</p>
          <p class="text-text-3 text-xs">Aucun résultat pour les filtres sélectionnés.</p>
        </div>

        <!-- Footer count -->
        <div v-if="filteredRequests.length > 0" class="px-4 py-2.5 border-t border-border bg-surface-2 flex items-center justify-between">
          <p class="text-text-3 text-xs font-mono">{{ filteredRequests.length }} résultat{{ filteredRequests.length > 1 ? 's' : '' }}</p>
          <button v-if="activeStatus !== 'all' || activeService !== 'all' || search"
            @click="resetFilters"
            class="text-xs text-accent hover:underline">
            Réinitialiser les filtres
          </button>
        </div>
      </div>

    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  ChevronRight, ArrowUpDown, Search, Inbox,
  Bell, Loader, CheckCircle2, DollarSign,
  PenLine, Layers, Grid3x3,
} from 'lucide-vue-next'
import { getRequests } from '@/mocks/api.js'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import BlechEsmLoader from '@/components/ui/BlechEsmLoader.vue'

const allRequests = ref([])
const loading     = ref(true)
const activeStatus  = ref('all')
const activeService = ref('all')
const sortAsc     = ref(false)
const search      = ref('')

onMounted(async () => {
  allRequests.value = await getRequests()
  loading.value = false
})

// ── Status ─────────────────────────────────────────────────────────
const statusMap = {
  nouveau:  { label: 'Nouveau',  dot: '#3D7BFF' },
  en_cours: { label: 'En cours', dot: '#F6B84E' },
  traite:   { label: 'Traité',   dot: '#4ADE80' },
  annule:   { label: 'Annulé',   dot: '#F87171' },
}

const statusFilters = [
  { value: 'all',      label: 'Toutes',   dot: null,      color: null },
  { value: 'nouveau',  label: 'Nouvelles', dot: '#3D7BFF', color: '#3D7BFF' },
  { value: 'en_cours', label: 'En cours', dot: '#F6B84E', color: '#F6B84E' },
  { value: 'traite',   label: 'Traitées', dot: '#4ADE80', color: '#4ADE80' },
  { value: 'annule',   label: 'Annulées', dot: '#F87171', color: '#F87171' },
]

// ── Service ─────────────────────────────────────────────────────────
const serviceFilters = [
  { value: 'all',       label: 'Tous les services', color: '#94A3B8', icon: Inbox },
  { value: 'mural',     label: 'Dessin Mural',      color: '#3D7BFF', icon: PenLine },
  { value: 'sculpture', label: 'Sculpture 3D',       color: '#A78BFA', icon: Layers },
  { value: 'sol',       label: 'Design Sol',         color: '#FF6B35', icon: Grid3x3 },
]

function serviceLabel(t) {
  return { mural: 'Dessin Mural', sculpture: 'Sculpture 3D', sol: 'Design Sol' }[t] ?? t
}
function serviceIcon(t) {
  return { mural: PenLine, sculpture: Layers, sol: Grid3x3 }[t] ?? PenLine
}
function serviceStyle(t) {
  const c = { mural: '#3D7BFF', sculpture: '#A78BFA', sol: '#FF6B35' }[t] ?? '#94A3B8'
  return { color: c, borderColor: c + '40', background: c + '12' }
}

// ── Counts ───────────────────────────────────────────────────────────
function countStatus(status) {
  if (status === 'all') return allRequests.value.length
  return allRequests.value.filter(r => r.status === status).length
}
function countService(service) {
  if (service === 'all') return allRequests.value.length
  return allRequests.value.filter(r => r.serviceType === service).length
}

// ── KPIs ─────────────────────────────────────────────────────────────
const totalRevenue = computed(() => {
  const sum = allRequests.value.reduce((acc, r) => acc + (r.finalPrice ?? 0), 0)
  if (!sum) return '—'
  return sum.toLocaleString('fr-FR') + ' DT'
})

// ── Filtered list ────────────────────────────────────────────────────
const filteredRequests = computed(() => {
  let list = allRequests.value

  if (activeStatus.value !== 'all')
    list = list.filter(r => r.status === activeStatus.value)

  if (activeService.value !== 'all')
    list = list.filter(r => r.serviceType === activeService.value)

  if (search.value.trim()) {
    const q = search.value.toLowerCase()
    list = list.filter(r =>
      r.client.name.toLowerCase().includes(q) ||
      r.client.email.toLowerCase().includes(q) ||
      (r.client.city ?? '').toLowerCase().includes(q)
    )
  }

  return list.slice().sort((a, b) => {
    const diff = new Date(a.createdAt) - new Date(b.createdAt)
    return sortAsc.value ? diff : -diff
  })
})

function setStatus(status) { activeStatus.value = status }
function resetFilters() { activeStatus.value = 'all'; activeService.value = 'all'; search.value = '' }

function initials(name) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: '2-digit' })
}
</script>

<style scoped>
/* ── KPI cards ──────────────────────────────────────────────────── */
.kpi-card {
  position: relative;
  background: var(--color-surface-1);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  padding: 14px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: border-color 0.15s;
}
.kpi-card--clickable {
  cursor: pointer;
}
.kpi-card--clickable:hover { border-color: var(--color-border-strong); }

.kpi-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: color-mix(in srgb, var(--ki) 12%, transparent);
  border: 1px solid color-mix(in srgb, var(--ki) 25%, transparent);
  color: var(--ki);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.kpi-label {
  font-size: 10px;
  font-family: var(--font-mono);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-text-3);
  margin-bottom: 2px;
}
.kpi-value {
  font-size: 20px;
  font-weight: 700;
  color: var(--color-text);
  line-height: 1;
}

.kpi-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--color-accent);
  color: white;
  font-size: 10px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ── Filter pills ───────────────────────────────────────────────── */
.filter-pill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 11px;
  border-radius: 6px;
  border: 1.5px solid var(--color-border);
  background: var(--color-surface-1);
  color: var(--color-text-3);
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: border-color 0.15s, color 0.15s, background 0.15s;
  white-space: nowrap;
}
.filter-pill:hover { color: var(--color-text); border-color: var(--color-border-strong); }
.filter-pill--active {
  border-color: var(--fp, var(--color-accent));
  background: color-mix(in srgb, var(--fp, var(--color-accent)) 10%, transparent);
  color: var(--fp, var(--color-accent));
  font-weight: 600;
}

/* ── Service pills ──────────────────────────────────────────────── */
.service-pill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  border-radius: 5px;
  border: 1px solid var(--color-border);
  background: transparent;
  color: var(--color-text-3);
  font-size: 11px;
  font-weight: 500;
  cursor: pointer;
  transition: border-color 0.15s, color 0.15s, background 0.15s;
  white-space: nowrap;
}
.service-pill:hover { color: var(--color-text); border-color: var(--color-border-strong); }
.service-pill--active {
  border-color: var(--sp);
  background: color-mix(in srgb, var(--sp) 10%, transparent);
  color: var(--sp);
  font-weight: 600;
}

.filter-count {
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 700;
  opacity: 0.65;
  margin-left: 1px;
}

/* ── Avatar ─────────────────────────────────────────────────────── */
.avatar {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: var(--color-surface-3, var(--color-surface-2));
  border: 1px solid var(--color-border-strong);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 700;
  color: var(--color-text-2);
  flex-shrink: 0;
  letter-spacing: 0.05em;
}

/* ── Service tag (in table) ─────────────────────────────────────── */
.service-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: 4px;
  border: 1px solid;
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;
}
</style>
