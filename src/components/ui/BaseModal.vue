<template>
  <Teleport to="body">
    <Transition name="settings-fade">
      <div
        v-if="open"
        class="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-6"
        @keydown="onKeydown"
      >
        <div
          class="absolute inset-0 bg-[#0f2318]/40 backdrop-blur-[6px]"
          aria-hidden="true"
          @click="handleOverlayClick"
        ></div>

        <div
          ref="cardRef"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="computedTitleId"
          :class="[
            'relative w-full rounded-[20px] bg-[#fdfcf8] border border-[#e8e6de] shadow-[0_20px_60px_rgba(15,35,24,0.18),0_1px_0_rgba(255,255,255,0.9)_inset] overflow-hidden flex flex-col max-h-[85vh]',
            maxWidthClass,
          ]"
          tabindex="-1"
          @click.stop
        >
          <div class="h-1 bg-gradient-to-r from-emerald-700 via-emerald-600 to-amber-300 shrink-0"></div>

          <!-- Header -->
          <div class="flex items-center justify-between px-5 pt-5 pb-4 border-b border-[#e8e6de]/70 shrink-0">
            <div class="flex items-center gap-3 min-w-0">
              <slot name="headerIcon" />
              <div class="min-w-0">
                <h2 :id="computedTitleId" class="text-[14px] font-semibold tracking-[-0.01em] text-[#0f2318] leading-none truncate">
                  {{ title }}
                </h2>
                <p v-if="subtitle" class="text-[11px] text-stone-500 mt-1 leading-snug line-clamp-2">
                  {{ subtitle }}
                </p>
              </div>
            </div>
            <button
              type="button"
              class="w-8 h-8 rounded-full bg-white border border-[#e7e5e0] inline-flex items-center justify-center text-stone-500 hover:bg-stone-50 hover:text-stone-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/30 shrink-0"
              aria-label="Tutup"
              @click="emit('close')"
            >
              <X class="w-4 h-4" />
            </button>
          </div>

          <!-- Body -->
          <div class="flex-1 overflow-y-auto overscroll-contain min-h-0">
            <slot />
          </div>

          <!-- Footer -->
          <div v-if="$slots.footer" class="px-5 pb-5 pt-3 border-t border-[#e8e6de]/70 shrink-0 bg-[#fdfcf8]">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, ref, watch, nextTick, onBeforeUnmount } from 'vue'
import { X } from 'lucide-vue-next'

const props = withDefaults(
  defineProps<{
    open: boolean
    title: string
    subtitle?: string
    titleId?: string
    closeOnOverlay?: boolean
    closeOnEsc?: boolean
    trapFocus?: boolean
    maxWidthClass?: string
  }>(),
  {
    subtitle: undefined,
    titleId: undefined,
    closeOnOverlay: true,
    closeOnEsc: true,
    trapFocus: false,
    maxWidthClass: 'max-w-md',
  },
)

const emit = defineEmits<{
  close: []
  confirm: []
}>()

const cardRef = ref<HTMLElement | null>(null)

const computedTitleId = computed(() => {
  if (props.titleId) return props.titleId
  const slug = props.title
    .replace(/\s+/g, '-')
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '')
  return `base-modal-${slug || 'dialog'}`
})

function handleOverlayClick() {
  if (props.closeOnOverlay) emit('close')
}

function handleEsc(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.open && props.closeOnEsc) {
    emit('close')
  }
}

watch(
  () => props.open,
  (open) => {
    if (typeof document === 'undefined') return
    if (open) {
      document.addEventListener('keydown', handleEsc)
      nextTick(() => {
        const el = cardRef.value
        if (!el) return
        const focusable = el.querySelector<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        )
        if (focusable) focusable.focus()
        else el.focus()
      })
    } else {
      document.removeEventListener('keydown', handleEsc)
    }
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  if (typeof document !== 'undefined') document.removeEventListener('keydown', handleEsc)
})

function onKeydown(e: KeyboardEvent) {
  if (!props.trapFocus || !props.open) return
  if (e.key !== 'Tab') return
  const el = cardRef.value
  if (!el) return
  const focusables = Array.from(
    el.querySelectorAll<HTMLElement>(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  ).filter((f) => f.offsetParent !== null || f === document.activeElement)
  if (focusables.length === 0) {
    e.preventDefault()
    return
  }
  const first = focusables[0]
  const last = focusables[focusables.length - 1]
  if (e.shiftKey) {
    if (document.activeElement === first) {
      e.preventDefault()
      last.focus()
    }
  } else {
    if (document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }
}
</script>

<style scoped>
.settings-fade-enter-active,
.settings-fade-leave-active {
  transition: opacity 220ms ease;
}
.settings-fade-enter-active .relative,
.settings-fade-leave-active .relative {
  transition:
    opacity 260ms cubic-bezier(0.16, 1, 0.3, 1),
    transform 260ms cubic-bezier(0.16, 1, 0.3, 1);
}
.settings-fade-enter-from,
.settings-fade-leave-to {
  opacity: 0;
}
.settings-fade-enter-from .relative {
  opacity: 0;
  transform: translateY(10px) scale(0.98);
}
.settings-fade-leave-to .relative {
  opacity: 0;
  transform: translateY(8px) scale(0.99);
}
</style>
