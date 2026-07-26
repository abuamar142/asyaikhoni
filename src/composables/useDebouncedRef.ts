import { onScopeDispose, ref, watch, type Ref } from 'vue'

export function useDebouncedRef<T>(source: Ref<T>, delay = 300): Ref<T> {
  const debounced = ref(source.value) as Ref<T>
  let timeout: ReturnType<typeof setTimeout> | undefined

  const stop = watch(
    source,
    (val) => {
      if (timeout) clearTimeout(timeout)
      timeout = setTimeout(() => {
        debounced.value = val
      }, delay)
    },
    { immediate: true },
  )

  onScopeDispose(() => {
    if (timeout) clearTimeout(timeout)
    stop()
  })

  return debounced
}
