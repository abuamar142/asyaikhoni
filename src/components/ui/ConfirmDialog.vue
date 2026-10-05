<template>
  <BaseModal :open="modelValue" :title="title" max-width-class="max-w-sm" @close="emitClose">
    <div class="p-5">
      <p v-if="message" class="text-[13.5px] leading-[1.6] text-stone-600">{{ message }}</p>
    </div>
    <template #footer>
      <div class="flex items-center justify-end gap-3">
        <BaseButton variant="ghost" pill @click="emitClose">{{ cancelLabel }}</BaseButton>
        <BaseButton :variant="confirmVariant" pill @click="emitConfirm">{{
          confirmLabel
        }}</BaseButton>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import BaseButton from './BaseButton.vue'
import BaseModal from './BaseModal.vue'

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
