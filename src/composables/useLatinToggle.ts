import { ref, watch } from 'vue'

const STORAGE_KEY = 'amalan-show-latin'

// Shared singleton state — all callers see same toggle
const showLatin = ref(true)
let _initialized = false
let _watchSetup = false

/**
 * Toggle for showing/hiding Latin transliteration (<em> after Arabic).
 * Persists to localStorage and provides helper to tag <em> elements
 * containing Latin so CSS `.hide-latin .latin {display:none}` can hide them.
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

  const arabicRe = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/
  const latinRe = /[A-Za-z]/

  /**
   * Scan container for <em> tags and add class `latin` to those that
   * contain Latin letters and do NOT contain Arabic script.
   * Call after v-html render inside nextTick.
   */
  function annotateLatin(container: HTMLElement | null) {
    if (!container) return
    const ems = container.querySelectorAll('em')
    ems.forEach((el) => {
      const text = el.textContent || ''
      const isLatin = latinRe.test(text) && !arabicRe.test(text)
      el.classList.toggle('latin', isLatin)
    })
  }

  return { showLatin, toggleLatin, annotateLatin }
}
