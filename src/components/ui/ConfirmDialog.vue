<template>
  <teleport to="body">
    <transition name="fade">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
        role="presentation"
        @click.self="emitClose"
      >
        <transition name="scale">
          <div
            v-if="modelValue"
            class="w-full max-w-sm rounded-lg bg-white shadow-xl border border-green-100 p-5 space-y-4"
            role="dialog"
            aria-modal="true"
            :aria-label="title || 'Konfirmasi'"
          >
            <div class="space-y-2">
              <h3 class="text-heading-md text-text-primary">{{ title }}</h3>
              <p v-if="message" class="text-body-sm text-text-secondary">{{ message }}</p>
            </div>
            <div class="flex justify-end gap-3">
              <BaseButton variant="ghost" @click="emitClose">{{ cancelLabel }}</BaseButton>
              <BaseButton :variant="confirmVariant" @click="emitConfirm">{{
                confirmLabel
              }}</BaseButton>
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import BaseButton from './BaseButton.vue'

withDefaults(
  defineProps<{
    modelValue: boolean
    title?: string
    message?: string
    confirmLabel?: string
    cancelLabel?: string
    confirmVariant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  }>(),
  {
    title: 'Konfirmasi',
    message: '',
    confirmLabel: 'Ya',
    cancelLabel: 'Batal',
    confirmVariant: 'primary',
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()

function emitClose() {
  emit('update:modelValue', false)
  emit('cancel')
}

function emitConfirm() {
  emit('confirm')
  emit('update:modelValue', false)
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.scale-enter-active,
.scale-leave-active {
  transition:
    transform 0.2s ease,
    opacity 0.2s ease;
}
.scale-enter-from,
.scale-leave-to {
  transform: scale(0.96);
  opacity: 0;
}
</style>
