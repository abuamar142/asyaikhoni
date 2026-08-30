import { watch, onBeforeUnmount, type Ref, type ComputedRef } from 'vue'

/**
 * Calls `onClose` when Escape is pressed while `isOpen` is true.
 * Manages global keydown listener lifecycle.
 */
export function useEsc(isOpen: Ref<boolean> | ComputedRef<boolean>, onClose: () => void) {
  const handler = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && isOpen.value) onClose()
  }

  watch(isOpen, (open) => {
    if (typeof document === 'undefined') return
    if (open) document.addEventListener('keydown', handler)
    else document.removeEventListener('keydown', handler)
  })

  // handle initial open state
  if (typeof document !== 'undefined' && isOpen.value) {
    document.addEventListener('keydown', handler)
  }

  onBeforeUnmount(() => {
    if (typeof document !== 'undefined') document.removeEventListener('keydown', handler)
  })
}
