<template>
  <div :class="['relative flex items-center', wrapperClass]">
    <div class="relative w-full group">
      <Search
        class="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 group-focus-within:text-emerald-700 transition-colors"
        :stroke-width="2.2"
      />
      <input
        :value="modelValue"
        :placeholder="placeholder"
        type="text"
        :disabled="disabled"
        class="w-full pl-10 pr-10 py-[11px] rounded-xl border bg-white text-[14px] leading-none text-[#1a2e1f] placeholder:text-stone-400 shadow-[0_1px_2px_rgba(16,30,20,0.06)] focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-300 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
        :class="disabled ? 'border-stone-200' : 'border-[#d7ddd7] hover:border-[#c2cdc2]'"
        @input="onInput"
        @keyup.enter="emitSearch"
      />
      <button
        v-if="modelValue"
        type="button"
        class="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 hover:text-stone-700 inline-flex items-center justify-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40"
        aria-label="Bersihkan pencarian"
        @click="clear"
      >
        <X class="w-3.5 h-3.5" :stroke-width="2.5" />
      </button>
    </div>
    <BaseButton
      v-if="showButton"
      size="sm"
      :variant="buttonVariant"
      :disabled="disabled"
      class="ml-3 shrink-0"
      @click="emitSearch"
    >
      {{ buttonLabel }}
    </BaseButton>
  </div>
</template>

<script setup lang="ts">
import BaseButton from './BaseButton.vue'
import { Search, X } from 'lucide-vue-next'

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

function clear() {
  emit('update:modelValue', '')
  emit('search', '')
}
</script>
