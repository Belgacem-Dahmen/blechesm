<template>
  <AdminLayout>
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="font-display font-semibold text-text text-lg">Comptes admin</h2>
          <p class="text-text-3 text-sm">{{ accounts.length }} compte{{ accounts.length > 1 ? 's' : '' }}</p>
        </div>
        <BaseButton @click="showModal = true">
          <Plus class="w-4 h-4" /> Ajouter un admin
        </BaseButton>
      </div>

      <div v-if="loading" class="flex justify-center py-12">
        <LoadingState label="Chargement des comptes…" />
      </div>

      <div v-else class="bg-surface-1 border border-border rounded-lg overflow-hidden">
        <div
          v-for="account in accounts"
          :key="account.id"
          class="flex items-center gap-4 px-5 py-4 border-b border-border last:border-0"
        >
          <div class="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-white text-sm font-medium shrink-0">
            {{ initials(account.name) }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-text font-medium text-sm">{{ account.name }}</p>
            <p class="text-text-3 text-xs">{{ account.email }}</p>
          </div>
          <div class="text-right hidden sm:block">
            <BaseBadge status="neutral">{{ account.role }}</BaseBadge>
            <p class="text-text-3 text-xs mt-1">Depuis {{ formatDate(account.createdAt) }}</p>
          </div>
        </div>
      </div>

      <p class="text-text-3 text-xs text-center">
        Tous les comptes admin ont les mêmes droits.
      </p>
    </div>

    <!-- Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" @click="closeModal" />
          <div class="relative bg-surface-1 border border-border rounded-xl w-full max-w-md p-6 shadow-2xl">
            <div class="flex items-center justify-between mb-6">
              <h2 class="font-display font-semibold text-text">Ajouter un admin</h2>
              <button @click="closeModal" class="w-8 h-8 flex items-center justify-center rounded-sm text-text-3 hover:text-text hover:bg-surface-2 transition-colors">
                <X class="w-4 h-4" />
              </button>
            </div>

            <form @submit.prevent="handleCreate" class="space-y-4" novalidate>
              <BaseInput v-model="form.name"     label="Nom complet"  placeholder="Alice Dupont"       required :error="errors.name" />
              <BaseInput v-model="form.email"    type="email" label="Email" placeholder="alice@blechesm.fr" required :error="errors.email" />
              <BaseInput v-model="form.password" type="password" label="Mot de passe" placeholder="••••••••" required :error="errors.password" />
              <div class="flex gap-3 pt-2">
                <BaseButton type="submit" :loading="saving">Créer le compte</BaseButton>
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
import { Plus, X } from 'lucide-vue-next'
import { getAdminAccounts, createAdminAccount } from '@/mocks/api.js'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseBadge from '@/components/ui/BaseBadge.vue'
import LoadingState from '@/components/ui/LoadingState.vue'

const accounts = ref([])
const loading = ref(true)
const showModal = ref(false)
const saving = ref(false)
const form = reactive({ name: '', email: '', password: '' })
const errors = reactive({ name: '', email: '', password: '' })

onMounted(async () => { accounts.value = await getAdminAccounts(); loading.value = false })

function closeModal() {
  showModal.value = false
  Object.assign(form, { name: '', email: '', password: '' })
  Object.assign(errors, { name: '', email: '', password: '' })
}

async function handleCreate() {
  Object.keys(errors).forEach(k => errors[k] = '')
  let valid = true
  if (!form.name)                           { errors.name     = 'Requis'; valid = false }
  if (!form.email)                          { errors.email    = 'Requis'; valid = false }
  if (!form.password || form.password.length < 4) { errors.password = 'Min. 4 caractères'; valid = false }
  if (!valid) return

  saving.value = true
  try {
    const created = await createAdminAccount({ name: form.name, email: form.email })
    accounts.value.push(created)
    closeModal()
  } finally {
    saving.value = false
  }
}

function initials(name) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}
function formatDate(iso) {
  return new Date(iso).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })
}
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: opacity 0.2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
</style>
