import { computed, ref } from 'vue'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export type ToastOptions = {
  id?: string
  title?: string
  message: string
  type?: ToastType
  duration?: number
}

export type Toast = Required<Pick<ToastOptions, 'id' | 'message'>> & {
  title?: string
  type: ToastType
  duration: number
}

const toasts = ref<Toast[]>([])
const timers = new Map<string, number>()
const DEFAULT_DURATION = 3500

function nextId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return Math.random().toString(36).slice(2, 10)
}

function removeToast(id: string) {
  const idx = toasts.value.findIndex((t) => t.id === id)
  if (idx !== -1) toasts.value.splice(idx, 1)
  const timer = timers.get(id)
  if (timer) {
    clearTimeout(timer)
    timers.delete(id)
  }
}

function scheduleRemoval(id: string, duration: number) {
  const timer = window.setTimeout(() => removeToast(id), duration)
  timers.set(id, timer)
}

function showToast(options: ToastOptions) {
  const id = options.id || nextId()
  const toast: Toast = {
    id,
    title: options.title,
    message: options.message,
    type: options.type || 'info',
    duration: options.duration ?? DEFAULT_DURATION,
  }
  removeToast(id)
  toasts.value.push(toast)
  scheduleRemoval(id, toast.duration)
  return id
}

export function useToast() {
  return {
    toasts: computed(() => toasts.value),
    showToast,
    removeToast,
    success: (message: string, title?: string) => showToast({ message, title, type: 'success' }),
    error: (message: string, title?: string) => showToast({ message, title, type: 'error' }),
    warning: (message: string, title?: string) => showToast({ message, title, type: 'warning' }),
    info: (message: string, title?: string) => showToast({ message, title, type: 'info' }),
  }
}
