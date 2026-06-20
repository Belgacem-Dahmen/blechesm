<template>
  <div class="flex flex-col gap-1.5">
    <label
      v-if="label"
      :for="inputId"
      class="text-xs font-medium text-text-2 uppercase tracking-widest"
    >
      {{ label }}
      <span v-if="required" class="text-warning ml-0.5">*</span>
    </label>

    <textarea
      v-if="type === 'textarea'"
      :id="inputId"
      v-model="modelValue_"
      :placeholder="placeholder"
      :rows="rows"
      :required="required"
      :disabled="disabled"
      :class="inputClasses"
      v-bind="$attrs"
    />
    <input
      v-else
      :id="inputId"
      :type="type"
      v-model="modelValue_"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      :class="inputClasses"
      v-bind="$attrs"
    />

    <p v-if="error" class="text-warning text-xs flex items-center gap-1.5">
      <AlertTriangle class="w-3.5 h-3.5 shrink-0" />
      {{ error }}
    </p>
    <p v-else-if="hint" class="text-text-3 text-xs">{{ hint }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { AlertTriangle } from 'lucide-vue-next'

const props = defineProps({
  label:       { type: String, default: '' },
  type:        { type: String, default: 'text' },
  placeholder: { type: String, default: '' },
  modelValue:  { type: [String, Number], default: '' },
  error:       { type: String, default: '' },
  hint:        { type: String, default: '' },
  required:    { type: Boolean, default: false },
  disabled:    { type: Boolean, default: false },
  rows:        { type: Number, default: 4 },
  id:          { type: String, default: '' },
})

const emit = defineEmits(['update:modelValue'])

const inputId = computed(() => props.id || `input-${Math.random().toString(36).slice(2, 8)}`)

const modelValue_ = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

const inputClasses = computed(() => [
  'w-full bg-surface-2 border rounded-sm px-3.5 py-2.5 text-sm text-text placeholder:text-text-3',
  'focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors',
  'disabled:opacity-50 disabled:cursor-not-allowed',
  props.error ? 'border-warning focus:ring-warning/30 focus:border-warning' : 'border-strong',
])
</script>
