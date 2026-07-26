<template>
  <Teleport to="body">
    <div class="fixed top-4 right-4 z-50 flex flex-col gap-3 w-full max-w-sm pointer-events-none">
      <TransitionGroup name="toast" tag="div">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="pointer-events-auto flex gap-3 rounded-lg shadow-lg border px-4 py-3 bg-white"
          :class="typeClass(toast.type)"
        >
          <div class="mt-0.5">
            <svg
              class="h-5 w-5"
              :class="iconClass(toast.type)"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <template v-if="toast.type === 'success'">
                <circle cx="12" cy="12" r="9" />
                <path d="M8.5 12.5l2.5 2.5 4.5-5.5" />
              </template>
              <template v-else-if="toast.type === 'error'">
                <circle cx="12" cy="12" r="9" />
                <path d="M9 9l6 6m0-6l-6 6" />
              </template>
              <template v-else-if="toast.type === 'warning'">
                <path d="M12 4l7 14H5l7-14z" />
                <path d="M12 10v3m0 3h.01" />
              </template>
              <template v-else>
                <circle cx="12" cy="12" r="9" />
                <path d="M12 9h.01M11 12h2v4h-2z" />
              </template>
            </svg>
          </div>
          <div class="flex-1">
            <p v-if="toast.title" class="text-sm font-semibold text-text-primary">
              {{ toast.title }}
            </p>
            <p class="text-sm text-text-primary/90">{{ toast.message }}</p>
          </div>
          <button
            type="button"
            class="text-text-secondary hover:text-text-primary transition-colors"
            aria-label="Close"
            @click="removeToast(toast.id)"
          >
            ×
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useToast } from '@/composables/useToast'

const { toasts, removeToast } = useToast()

function typeClass(type: string) {
  const base = 'border-green-100'
  const map: Record<string, string> = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    warning: 'bg-amber-50 border-amber-200',
    info: 'bg-blue-50 border-blue-200',
  }
  return map[type] || base
}

function iconClass(type: string) {
  const map: Record<string, string> = {
    success: 'text-green-600',
    error: 'text-red-600',
    warning: 'text-amber-600',
    info: 'text-blue-600',
  }
  return map[type] || 'text-green-600'
}
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.18s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
