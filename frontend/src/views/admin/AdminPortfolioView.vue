<template>
  <AdminLayout>
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="font-display font-semibold text-text text-lg">Réalisations</h2>
          <p class="text-text-3 text-sm">{{ items.length }} œuvres au portfolio</p>
        </div>
        <BaseButton @click="openModal()">
          <Plus class="w-4 h-4" /> Ajouter
        </BaseButton>
      </div>

      <div v-if="loading" class="flex justify-center py-12">
        <LoadingState label="Chargement du portfolio…" />
      </div>

      <div v-else class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="item in items" :key="item.id" class="bg-surface-1 border border-border rounded-lg overflow-hidden">
          <div class="aspect-video overflow-hidden bg-surface-2">
            <img :src="item.image" :alt="item.title" class="w-full h-full object-cover" loading="lazy" />
          </div>
          <div class="p-4">
            <div class="flex items-start justify-between gap-2">
              <div>
                <p class="font-display font-semibold text-text text-sm">{{ item.title }}</p>
                <p class="text-text-3 text-xs mt-0.5">{{ item.city }} · {{ item.size }}</p>
              </div>
              <BaseBadge status="neutral" :label="item.style" />
            </div>
            <div class="flex gap-2 mt-4">
              <button
                @click="openModal(item)"
                class="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-sm bg-surface-2 hover:bg-surface-3 border border-border text-text-2 hover:text-text text-xs transition-colors min-h-[36px]"
              >
                <Pencil class="w-3.5 h-3.5" /> Modifier
              </button>
              <button
                @click="handleDelete(item.id)"
                class="flex items-center justify-center px-3 py-1.5 rounded-sm bg-surface-2 hover:bg-red-900/30 border border-border hover:border-red-500/40 text-text-3 hover:text-red-400 text-xs transition-colors min-h-[36px]"
              >
                <Trash2 class="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" @click="closeModal" />
          <div class="relative bg-surface-1 border border-border rounded-xl w-full max-w-lg p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div class="flex items-center justify-between mb-6">
              <h2 class="font-display font-semibold text-text">
                {{ editingItem ? 'Modifier la réalisation' : 'Ajouter une réalisation' }}
              </h2>
              <button @click="closeModal" class="w-8 h-8 flex items-center justify-center rounded-sm text-text-3 hover:text-text hover:bg-surface-2 transition-colors">
                <X class="w-4 h-4" />
              </button>
            </div>

            <form @submit.prevent="handleSave" class="space-y-4">
              <BaseInput v-model="form.title" label="Titre" placeholder="Jungle Urbaine" required />
              <div class="grid grid-cols-2 gap-4">
                <BaseInput v-model="form.city" label="Ville" placeholder="Paris" />
                <BaseInput v-model="form.size" label="Dimensions" placeholder="12×6m" />
              </div>
              <BaseInput v-model="form.style" label="Style" placeholder="nature, abstrait, figuratif…" />
              <BaseInput v-model="form.image" label="URL de l'image" placeholder="https://…" />
              <BaseInput v-model="form.description" type="textarea" label="Description" :rows="3" />
              <div class="flex gap-3 pt-2">
                <BaseButton type="submit" :loading="saving">{{ editingItem ? 'Enregistrer' : 'Ajouter' }}</BaseButton>
                <BaseButton variant="ghost" type="button" @click="closeModal">Annuler</BaseButton>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>
  </AdminLayout>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Plus, Pencil, Trash2, X } from 'lucide-vue-next'
import { getPortfolio, createPortfolio, updatePortfolio, deletePortfolio } from '@/mocks/api.js'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseBadge from '@/components/ui/BaseBadge.vue'
import LoadingState from '@/components/ui/LoadingState.vue'

const items = ref([])
const loading = ref(true)
const showModal = ref(false)
const editingItem = ref(null)
const saving = ref(false)
const form = reactive({ title: '', city: '', size: '', style: '', image: '', description: '' })

onMounted(async () => { items.value = await getPortfolio(); loading.value = false })

function openModal(item = null) {
  editingItem.value = item
  Object.assign(form, item
    ? { title: item.title, city: item.city, size: item.size, style: item.style, image: item.image, description: item.description }
    : { title: '', city: '', size: '', style: '', image: '', description: '' }
  )
  showModal.value = true
}

function closeModal() { showModal.value = false; editingItem.value = null }

async function handleSave() {
  saving.value = true
  try {
    if (editingItem.value) {
      const updated = await updatePortfolio(editingItem.value.id, { ...form, tags: [form.style] })
      const idx = items.value.findIndex(i => i.id === editingItem.value.id)
      if (idx !== -1) items.value[idx] = updated
    } else {
      const created = await createPortfolio({ ...form, tags: [form.style], year: new Date().getFullYear() })
      items.value.unshift(created)
    }
    closeModal()
  } finally {
    saving.value = false
  }
}

async function handleDelete(id) {
  if (!confirm('Supprimer cette réalisation ?')) return
  await deletePortfolio(id)
  items.value = items.value.filter(i => i.id !== id)
}
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: opacity 0.2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
</style>
