import { ref, watch } from 'vue'

const STORAGE_KEY = 'amalan-show-latin'

// Shared singleton state — all callers see same toggle
const showLatin = ref(true)
let _initialized = false
let _watchSetup = false

/**
 * Toggle for showing/hiding Latin transliteration.
 * Persists to localStorage.
 */
export function useLatinToggle(storageKey = STORAGE_KEY) {
  if (!_initialized && typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(storageKey)
      if (raw !== null) {
        showLatin.value = JSON.parse(raw) as boolean
      }
    } catch {
      // ignore parse errors, keep default true
    }
    _initialized = true
  }

  if (!_watchSetup) {
    watch(showLatin, (val) => {
      try {
        if (typeof window !== 'undefined') {
          localStorage.setItem(storageKey, JSON.stringify(val))
        }
      } catch {
        // ignore storage errors (quota, private mode)
      }
    })
    _watchSetup = true
  }

  function toggleLatin() {
    showLatin.value = !showLatin.value
  }

  return { showLatin, toggleLatin }
}
