<template>
  <div>
    <label v-if="label" class="block text-xs font-medium text-text-2 uppercase tracking-widest mb-2">
      {{ label }}
      <span v-if="required" class="text-warning ml-0.5">*</span>
    </label>

    <!-- Dropzone -->
    <div
      v-if="!preview"
      @dragover.prevent="dragging = true"
      @dragleave.prevent="dragging = false"
      @drop.prevent="onDrop"
      @click="triggerInput"
      :class="[
        'relative border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-3 cursor-pointer transition-all min-h-[180px] p-6',
        dragging
          ? 'border-accent bg-accent/5 scale-[1.01]'
          : 'border-border-strong hover:border-accent/50 hover:bg-surface-2/50 bg-surface-2',
        error ? 'border-warning/60' : '',
      ]"
      role="button"
      tabindex="0"
      :aria-label="label || 'Zone d\'upload'"
      @keydown.enter.space.prevent="triggerInput"
    >
      <input
        ref="fileInput"
        type="file"
        class="sr-only"
        :accept="accept"
        @change="onFileChange"
      />

      <div class="w-12 h-12 rounded-xl bg-surface-3 flex items-center justify-center text-text-3">
        <component :is="iconComponent" class="w-6 h-6" />
      </div>
      <div class="text-center">
        <p class="text-text text-sm font-medium">{{ dragging ? 'Déposez ici' : placeholder }}</p>
        <p class="text-text-3 text-xs mt-1">{{ hint }}</p>
      </div>
    </div>

    <!-- Preview -->
    <div v-else class="relative rounded-lg overflow-hidden border border-border-strong group min-h-[180px]">
      <img
        :src="preview"
        :alt="label || 'Aperçu'"
        class="w-full h-full object-cover max-h-72"
      />
      <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <button
          @click.stop="removeFile"
          class="px-4 py-2 rounded-sm bg-white/10 backdrop-blur-sm text-white text-sm font-medium hover:bg-white/20 transition-colors min-h-[44px]"
        >
          Changer de photo
        </button>
      </div>
    </div>

    <p v-if="error" class="mt-1.5 text-warning text-xs flex items-center gap-1.5">
      <AlertTriangle class="w-3.5 h-3.5 shrink-0" />
      {{ error }}
    </p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Upload, Image as ImageIcon, AlertTriangle } from 'lucide-vue-next'

const props = defineProps({
  modelValue:    { type: [File, null], default: null },
  label:         { type: String, default: '' },
  placeholder:   { type: String, default: 'Glissez-déposez ou cliquez pour choisir' },
  hint:          { type: String, default: 'PNG, JPG, WEBP jusqu\'à 10 Mo' },
  icon:          { type: String, default: 'upload' }, // 'upload' | 'image'
  accept:        { type: String, default: 'image/*' },
  required:      { type: Boolean, default: false },
  error:         { type: String, default: '' },
})

const emit = defineEmits(['update:modelValue'])

const fileInput = ref(null)
const dragging = ref(false)
const preview = ref(null)

const iconComponent = computed(() => props.icon === 'image' ? ImageIcon : Upload)

function triggerInput() { fileInput.value?.click() }

function onFileChange(e) {
  const file = e.target.files?.[0]
  if (file) setFile(file)
}

function onDrop(e) {
  dragging.value = false
  const file = e.dataTransfer?.files?.[0]
  if (file && file.type.startsWith('image/')) setFile(file)
}

function setFile(file) {
  preview.value = URL.createObjectURL(file)
  emit('update:modelValue', file)
}

function removeFile() {
  preview.value = null
  if (fileInput.value) fileInput.value.value = ''
  emit('update:modelValue', null)
}
</script>
