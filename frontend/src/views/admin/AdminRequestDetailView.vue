<template>
  <AdminLayout>
    <div v-if="loading" class="flex justify-center py-16">
      <LoadingState label="Chargement de la demande…" />
    </div>

    <div v-else-if="request" class="space-y-8">
      <RouterLink to="/admin/demandes" class="inline-flex items-center gap-1.5 text-text-3 text-sm hover:text-text transition-colors">
        <ArrowLeft class="w-4 h-4" /> Retour aux demandes
      </RouterLink>

      <div class="flex flex-wrap gap-4 items-start justify-between">
        <div>
          <h1 class="font-display font-semibold text-text text-xl">{{ request.client.name }}</h1>
          <p class="text-text-3 text-sm">Demande #{{ request.id }} · {{ formatDate(request.createdAt) }}</p>
        </div>
        <BaseBadge :status="statusMap[request.status]?.color">{{ statusMap[request.status]?.label }}</BaseBadge>
      </div>

      <div class="grid lg:grid-cols-2 gap-8">
        <!-- Left: images -->
        <div class="space-y-4">
          <div v-if="request.wallPhoto">
            <p class="text-text-3 text-xs uppercase tracking-widest mb-2">Photo du mur</p>
            <div class="rounded-lg overflow-hidden border border-border aspect-video">
              <img :src="request.wallPhoto" alt="Mur" class="w-full h-full object-cover" />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div v-if="request.referencePhoto">
              <p class="text-text-3 text-xs uppercase tracking-widest mb-2">Référence</p>
              <div class="rounded-lg overflow-hidden border border-border aspect-square">
                <img :src="request.referencePhoto" alt="Référence" class="w-full h-full object-cover" />
              </div>
            </div>
            <div v-if="request.generatedImage">
              <p class="text-text-3 text-xs uppercase tracking-widest mb-2">Fresque générée</p>
              <div class="rounded-lg overflow-hidden border border-border aspect-square">
                <img :src="request.generatedImage" alt="Fresque IA" class="w-full h-full object-cover" />
              </div>
            </div>
          </div>

          <div v-if="request.wall.description" class="bg-surface-2 rounded-lg p-4 border border-border">
            <p class="text-text-3 text-xs uppercase tracking-widest mb-2">Description du projet</p>
            <p class="text-text-2 text-sm leading-relaxed">{{ request.wall.description }}</p>
          </div>
        </div>

        <!-- Right: metadata + editable -->
        <div class="space-y-6">
          <div class="bg-surface-1 border border-border rounded-lg p-5 space-y-3">
            <p class="text-text-3 text-xs uppercase tracking-widest mb-3">Coordonnées client</p>
            <div class="grid grid-cols-2 gap-3 text-sm">
              <div><p class="text-text-3 text-xs mb-0.5">Nom</p><p class="text-text">{{ request.client.name }}</p></div>
              <div><p class="text-text-3 text-xs mb-0.5">Ville</p><p class="text-text">{{ request.client.city }}</p></div>
              <div><p class="text-text-3 text-xs mb-0.5">Email</p><a :href="`mailto:${request.client.email}`" class="text-accent hover:underline">{{ request.client.email }}</a></div>
              <div><p class="text-text-3 text-xs mb-0.5">Téléphone</p><a :href="`tel:${request.client.phone}`" class="text-text">{{ request.client.phone }}</a></div>
            </div>
          </div>

          <div class="bg-surface-1 border border-border rounded-lg p-5">
            <p class="text-text-3 text-xs uppercase tracking-widest mb-3">Dimensions du mur</p>
            <p class="font-display font-semibold text-text text-2xl">{{ request.wall.width }} × {{ request.wall.height }} m</p>
            <p class="text-text-3 text-xs mt-1">Surface : {{ (request.wall.width * request.wall.height).toFixed(1) }} m²</p>
          </div>

          <form @submit.prevent="handleSave" class="space-y-4">
            <div>
              <label class="block text-xs font-medium text-text-2 uppercase tracking-widest mb-1.5">Statut</label>
              <select
                v-model="editable.status"
                class="w-full bg-surface-2 border border-strong rounded-sm px-3.5 py-2.5 text-sm text-text focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
              >
                <option value="nouveau">Nouveau</option>
                <option value="en_cours">En cours</option>
                <option value="traite">Traité</option>
              </select>
            </div>
            <BaseInput v-model="editable.finalPrice"    type="number"   label="Prix final (€)"   placeholder="ex. 3500"  hint="Laissez vide si non établi" />
            <BaseInput v-model="editable.internalNotes" type="textarea" label="Notes internes"   placeholder="Commentaires, étapes…" :rows="4" />

            <div class="flex items-center gap-3">
              <BaseButton type="submit" :loading="saving">Enregistrer</BaseButton>
              <Transition name="fade">
                <span v-if="savedOk" class="flex items-center gap-1.5 text-success text-sm">
                  <Check class="w-4 h-4" /> Enregistré
                </span>
              </Transition>
            </div>
          </form>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-20 text-text-2">
      Demande introuvable.
      <RouterLink to="/admin/demandes" class="text-accent hover:underline ml-2 inline-flex items-center gap-1">
        <ArrowLeft class="w-3.5 h-3.5" /> Retour
      </RouterLink>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ArrowLeft, Check } from 'lucide-vue-next'
import { getRequest, updateRequest } from '@/mocks/api.js'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import BaseBadge from '@/components/ui/BaseBadge.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import LoadingState from '@/components/ui/LoadingState.vue'

const route = useRoute()
const request = ref(null)
const loading = ref(true)
const saving = ref(false)
const savedOk = ref(false)
const editable = reactive({ status: '', finalPrice: '', internalNotes: '' })

const statusMap = {
  nouveau:  { label: 'Nouveau',  color: 'info' },
  en_cours: { label: 'En cours', color: 'warning' },
  traite:   { label: 'Traité',   color: 'success' },
}

onMounted(async () => {
  try {
    const data = await getRequest(route.params.id)
    request.value = data
    editable.status = data.status
    editable.finalPrice = data.finalPrice ?? ''
    editable.internalNotes = data.internalNotes ?? ''
  } finally {
    loading.value = false
  }
})

async function handleSave() {
  saving.value = true
  try {
    const updated = await updateRequest(route.params.id, {
      status: editable.status,
      finalPrice: editable.finalPrice ? Number(editable.finalPrice) : null,
      internalNotes: editable.internalNotes,
    })
    request.value = updated
    savedOk.value = true
    setTimeout(() => (savedOk.value = false), 2500)
  } finally {
    saving.value = false
  }
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('fr-FR', { dateStyle: 'long' })
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
