import { ref, watch } from 'vue'
import { useLatinToggle } from './useLatinToggle'

const FONT_SIZE_KEY = 'amalan-font-size'
const DARK_KEY = 'amalan-dark'

const fontSize = ref(24)
const isDark = ref(false)

let _initialized = false
let _watchSetup = false

function clamp(n: number): number {
  return Math.min(36, Math.max(18, Math.round(n)))
}

export function useLyricSettings() {
  const { showLatin, toggleLatin, annotateLatin } = useLatinToggle()

  if (!_initialized && typeof window !== 'undefined') {
    try {
      const rawFont = localStorage.getItem(FONT_SIZE_KEY)
      if (rawFont !== null) {
        const parsed = parseInt(rawFont, 10)
        if (!Number.isNaN(parsed)) fontSize.value = clamp(parsed)
      }
      const rawDark = localStorage.getItem(DARK_KEY)
      if (rawDark !== null) {
        isDark.value = JSON.parse(rawDark) as boolean
      } else {
        // respect prefers-color-scheme? For now false as per spec
        isDark.value = false
      }
    } catch {
      // ignore
    }
    _initialized = true
  }

  if (!_watchSetup) {
    watch(fontSize, (val) => {
      try {
        if (typeof window !== 'undefined') localStorage.setItem(FONT_SIZE_KEY, String(clamp(val)))
      } catch {}
    })
    watch(isDark, (val) => {
      try {
        if (typeof window !== 'undefined') localStorage.setItem(DARK_KEY, JSON.stringify(val))
      } catch {}
    })
    _watchSetup = true
  }

  function increase() {
    fontSize.value = clamp(fontSize.value + 1)
  }
  function decrease() {
    fontSize.value = clamp(fontSize.value - 1)
  }
  function setFontSize(n: number) {
    fontSize.value = clamp(n)
  }
  function resetFontSize() {
    fontSize.value = 24
  }
  function toggleDark() {
    isDark.value = !isDark.value
  }

  return {
    showLatin,
    toggleLatin,
    annotateLatin,
    fontSize,
    isDark,
    increase,
    decrease,
    setFontSize,
    resetFontSize,
    toggleDark,
  }
}
