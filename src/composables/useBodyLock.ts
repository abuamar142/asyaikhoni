import { watch, onBeforeUnmount, type Ref, type ComputedRef } from 'vue'

/**
 * Locks body scroll when `isOpen` is true.
 * Restores overflow on close and on component unmount.
 * For multiple modals, pass a computed OR: computed(() => a.value || b.value)
 */
export function useBodyLock(isOpen: Ref<boolean> | ComputedRef<boolean>) {
  const apply = (open: boolean) => {
    if (typeof document === 'undefined') return
    document.documentElement.style.overflow = open ? 'hidden' : ''
  }

  watch(
    isOpen,
    (open) => apply(!!open),
  )

  // handle initial open state (e.g., modal open on mount)
  if (isOpen.value) apply(true)

  onBeforeUnmount(() => apply(false))
}
