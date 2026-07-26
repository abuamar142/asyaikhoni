<template>
  <div :class="['flex items-center gap-3', wrapperClass]">
    <input
      :value="modelValue"
      :placeholder="placeholder"
      type="text"
      :disabled="disabled"
      class="w-full px-4 py-2 rounded-lg border border-green-200 bg-white text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent shadow-sm placeholder:text-gray-400 disabled:opacity-70 disabled:cursor-not-allowed"
      @input="onInput"
      @keyup.enter="emitSearch"
    />
    <BaseButton
      v-if="showButton"
      size="sm"
      :variant="buttonVariant"
      :disabled="disabled"
      @click="emitSearch"
    >
      {{ buttonLabel }}
    </BaseButton>
  </div>
</template>

<script setup lang="ts">
import BaseButton from './BaseButton.vue'

const props = withDefaults(
  defineProps<{
    modelValue: string
    placeholder?: string
    showButton?: boolean
    buttonLabel?: string
    buttonVariant?: 'primary' | 'secondary' | 'ghost' | 'danger'
    disabled?: boolean
    wrapperClass?: string
  }>(),
  {
    placeholder: 'Cari...',
    showButton: false,
    buttonLabel: 'Cari',
    buttonVariant: 'primary',
    disabled: false,
    wrapperClass: '',
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'search', value: string): void
}>()

function onInput(event: Event) {
  emit('update:modelValue', (event.target as HTMLInputElement).value)
}

function emitSearch() {
  emit('search', props.modelValue)
}
</script>
