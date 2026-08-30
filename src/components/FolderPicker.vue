<template>
  <Teleport to="body">
    <Transition name="settings-fade">
      <div
        v-if="open"
        class="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-6"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="titleId"
        @keydown.esc="emit('close')"
      >
        <div class="absolute inset-0 bg-[#0f2318]/40 backdrop-blur-[6px]" aria-hidden="true" @click="emit('close')"></div>

        <div
          class="relative w-full max-w-[420px] rounded-[20px] bg-[#fdfcf8] border border-[#e8e6de] shadow-[0_20px_60px_rgba(15,35,24,0.18),0_1px_0_rgba(255,255,255,0.9)_inset] overflow-hidden flex flex-col max-h-[85vh]"
          @click.stop
        >
          <div class="h-1 bg-gradient-to-r from-emerald-700 via-emerald-600 to-amber-300 shrink-0"></div>

          <!-- Header -->
          <div class="flex items-center justify-between px-5 pt-5 pb-4 border-b border-[#e8e6de]/70 shrink-0">
            <div class="flex items-center gap-3 min-w-0">
              <span class="w-8 h-8 rounded-full bg-emerald-700 inline-flex items-center justify-center shadow-[0_2px_8px_rgba(21,128,61,0.25)] shrink-0">
                <Folder class="w-4 h-4 text-white" />
              </span>
              <div class="min-w-0">
                <h2 :id="titleId" class="text-[14px] font-semibold tracking-[-0.01em] text-[#0f2318] leading-none truncate">{{ title }}</h2>
                <p v-if="subtitle" class="text-[11px] text-stone-500 mt-1 leading-snug line-clamp-2">{{ subtitle }}</p>
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

          <div class="p-5 space-y-3 overflow-y-auto overscroll-contain min-h-0">
            <!-- Breadcrumb -->
            <div class="flex items-center gap-1.5 flex-wrap text-[13px] bg-stone-50 rounded-xl px-3 py-2.5 border border-stone-200">
              <button
                type="button"
                class="inline-flex items-center gap-1.5 font-medium px-2.5 py-1 rounded-full transition-colors shrink-0"
                :class="navId === null ? 'bg-emerald-700 text-white border border-emerald-700' : 'bg-white border border-stone-200 text-stone-600 hover:border-emerald-200 hover:text-emerald-800'"
                @click="emit('update:navId', null)"
              >
                <Home class="w-3.5 h-3.5 shrink-0" />
                Root
              </button>
              <template v-for="crumb in breadcrumb" :key="crumb.id">
                <ChevronRight class="w-4 h-4 text-stone-400 shrink-0" />
                <button
                  type="button"
                  class="inline-flex items-center gap-1.5 font-medium px-2.5 py-1 rounded-full border transition-colors max-w-[10rem] truncate shrink-0"
                  :class="crumb.id === navId ? 'bg-emerald-700 text-white border-emerald-700' : 'bg-white border-stone-200 text-stone-600 hover:border-emerald-200 hover:text-emerald-800'"
                  @click="emit('update:navId', crumb.id ?? null)"
                >
                  <Folder class="w-3.5 h-3.5 shrink-0" :class="crumb.id === navId ? 'text-white' : 'text-emerald-700'" />
                  <span class="truncate">{{ crumb.name }}</span>
                </button>
              </template>
            </div>

            <!-- Nav back control -->
            <div v-if="navId !== null" class="flex items-center gap-2">
              <button
                type="button"
                class="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-stone-600 bg-white border border-stone-200 hover:border-emerald-200 hover:text-emerald-800 hover:bg-emerald-50 px-3 py-1.5 rounded-full transition-colors"
                @click="goBack"
              >
                <ArrowLeft class="w-3.5 h-3.5" /> Kembali
              </button>
              <span class="text-[12px] text-stone-400 truncate">
                Di dalam “{{ currentNavFolder?.name ?? '' }}”
              </span>
            </div>

            <!-- List -->
            <div class="space-y-2">
              <!-- Root row -->
              <div
                class="flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors"
                :class="isDisabled(0) ? 'opacity-60 cursor-not-allowed bg-amber-50/40 border-amber-200' : selectedId === 0 ? 'bg-emerald-50 border-emerald-200 ring-2 ring-emerald-500' : 'bg-white border-[#e8e6de] hover:border-stone-300'"
                @click="emit('update:selectedId', 0)"
              >
                <div
                  class="w-5 h-5 rounded-full border-2 inline-flex items-center justify-center shrink-0 transition-colors"
                  :class="selectedId === 0 ? 'border-emerald-600 bg-emerald-600' : 'border-stone-300 bg-white'"
                >
                  <div v-if="selectedId === 0" class="w-2 h-2 rounded-full bg-white"></div>
                </div>
                <span class="w-8 h-8 rounded-lg bg-stone-50 border border-stone-200 inline-flex items-center justify-center shrink-0">
                  <Home class="w-4 h-4 text-stone-500" />
                </span>
                <span class="flex-1 min-w-0">
                  <span class="block text-[13px] font-semibold text-[#0f2318]">Koleksi Utama</span>
                  <span class="block text-[11px] text-stone-500">Root — tanpa folder</span>
                </span>
                <span v-if="isDisabled(0)" class="inline-flex items-center gap-1 text-[11px] font-medium text-amber-700 shrink-0"><AlertCircle class="w-3 h-3" /> Sudah ada</span>
              </div>

              <!-- Empty state for subfolders -->
              <div
                v-if="displayFolders.length === 0"
                class="text-center py-6 text-[13px] text-stone-500 border border-dashed border-stone-200 rounded-xl bg-stone-50/50"
              >
                Tidak ada subfolder
              </div>

              <!-- Folder rows -->
              <div
                v-for="folder in displayFolders"
                :key="folder.id"
                class="flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors"
                :class="[
                  isDisabled(folder.id!) ? 'opacity-60 cursor-not-allowed bg-amber-50/40 border-amber-200' : '',
                  !isDisabled(folder.id!) && selectedId === folder.id ? 'bg-emerald-50 border-emerald-200 ring-2 ring-emerald-500' : '',
                  !isDisabled(folder.id!) && selectedId !== folder.id ? 'bg-white border-[#e8e6de] hover:border-stone-300' : ''
                ]"
                @click="emit('update:selectedId', folder.id!)"
              >
                <!-- radio -->
                <div
                  class="w-5 h-5 rounded-full border-2 inline-flex items-center justify-center shrink-0 transition-colors"
                  :class="selectedId === folder.id ? 'border-emerald-600 bg-emerald-600' : 'border-stone-300 bg-white'"
                >
                  <div v-if="selectedId === folder.id" class="w-2 h-2 rounded-full bg-white"></div>
                </div>

                <!-- folder icon -->
                <span class="w-8 h-8 rounded-lg border inline-flex items-center justify-center shrink-0 transition-colors" :class="isDisabled(folder.id!) ? 'bg-amber-100 border-amber-200 text-amber-700' : 'bg-emerald-50 border-emerald-100 text-emerald-700'">
                  <Folder class="w-4 h-4" />
                </span>

                <!-- name + path -->
                <span class="flex-1 min-w-0">
                  <span class="block text-[13px] font-medium truncate" :class="isDisabled(folder.id!) ? 'text-amber-900' : 'text-[#0f2318]'">{{ folder.name }}</span>
                  <span v-if="getFolderDepth(folder) > 0" class="block text-[11px] text-stone-500 truncate">{{ getFolderPath(folder) }}</span>
                  <span v-else class="block text-[11px] text-stone-500">Folder</span>
                </span>

                <!-- disabled label or drill -->
                <span v-if="isDisabled(folder.id!)" class="inline-flex items-center gap-1 text-[11px] font-medium text-amber-700 shrink-0"><AlertCircle class="w-3 h-3" /> Sudah ada</span>
                <button
                  v-else-if="hasChildren(folder.id!)"
                  type="button"
                  class="w-8 h-8 rounded-full bg-white border border-stone-200 hover:border-emerald-200 hover:bg-emerald-50 text-stone-500 hover:text-emerald-700 inline-flex items-center justify-center shrink-0 transition-colors"
                  aria-label="Masuk ke folder"
                  @click.stop="emit('update:navId', folder.id!)"
                >
                  <ChevronRight class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="px-5 pb-5 pt-3 border-t border-[#e8e6de]/70 shrink-0 bg-[#fdfcf8] flex flex-col gap-3">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <span class="text-[12px] text-stone-500 truncate">
                Target: <span class="font-semibold" :class="isConfirmDisabled ? 'text-stone-400' : 'text-stone-700'">{{ selectedName }}</span>
                <span v-if="selectedId !== null && isDisabled(selectedId)" class="ml-1 text-amber-600 font-medium">(sudah di sini)</span>
              </span>
              <div class="flex flex-col items-end gap-2 shrink-0 self-end sm:self-auto">
                <p v-if="isSelectedDisabled" class="flex items-center gap-1.5 text-sm text-red-600">
                  <AlertCircle class="w-4 h-4 shrink-0" />
                  Amalan ini sudah ada di folder ini
                </p>
                <div class="flex items-center gap-2">
                  <button
                    type="button"
                    class="px-5 py-2.5 rounded-full bg-white border border-stone-200 text-[13px] font-medium text-stone-700 hover:bg-stone-50 transition-colors"
                    @click="emit('close')"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    :disabled="isConfirmDisabled"
                    class="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-[13px] font-semibold shadow-sm transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    :class="isConfirmDisabled ? 'bg-stone-200 text-stone-500' : 'bg-emerald-700 text-white hover:bg-emerald-800'"
                    @click="emit('confirm')"
                  >
                    {{ confirmLabel }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Folder, ChevronRight, Home, X, ArrowLeft, AlertCircle } from 'lucide-vue-next'
import type { LocalFolder } from '@/utils/localDb'

const props = withDefaults(
  defineProps<{
    folders: LocalFolder[]
    selectedId: number | null
    navId: number | null
    title: string
    subtitle?: string
    confirmLabel?: string
    disabledIds?: Set<number> | number[]
    open?: boolean
  }>(),
  {
    subtitle: undefined,
    confirmLabel: 'Simpan',
    disabledIds: undefined,
    open: true,
  },
)

const emit = defineEmits<{
  'update:selectedId': [value: number | null]
  'update:navId': [value: number | null]
  confirm: []
  close: []
}>()

const titleId = computed(() => `folder-picker-${props.title.replace(/\s+/g, '-').toLowerCase()}`)

const displayFolders = computed(() => props.folders.filter((f) => (f.parent_id ?? null) === props.navId))

function hasChildren(id: number): boolean {
  return props.folders.some((f) => (f.parent_id ?? null) === id)
}

function buildBreadcrumb(id: number | null): LocalFolder[] {
  if (id == null) return []
  const path: LocalFolder[] = []
  let curId: number | null = id
  const visited = new Set<number>()
  while (curId != null && !visited.has(curId)) {
    visited.add(curId)
    const folder = props.folders.find((f) => f.id === curId)
    if (!folder) break
    path.unshift(folder)
    curId = folder.parent_id ?? null
    if (path.length > 20) break
  }
  return path
}

const breadcrumb = computed(() => buildBreadcrumb(props.navId))

const currentNavFolder = computed<LocalFolder | null>(() => {
  if (props.navId == null) return null
  return props.folders.find((f) => f.id === props.navId) ?? null
})

function getFolderDepth(folder: LocalFolder): number {
  let depth = 0
  let curId: number | null = folder.parent_id ?? null
  const visited = new Set<number>()
  while (curId != null && !visited.has(curId)) {
    visited.add(curId)
    const parent = props.folders.find((f) => f.id === curId)
    if (!parent) break
    depth += 1
    curId = parent.parent_id ?? null
    if (depth > 20) break
  }
  return depth
}

function getFolderPath(folder: LocalFolder): string {
  const parts: string[] = []
  let cur: LocalFolder | undefined = folder
  const visited = new Set<number>()
  while (cur && cur.id != null && !visited.has(cur.id)) {
    visited.add(cur.id)
    parts.unshift(cur.name)
    if (cur.parent_id == null) break
    cur = props.folders.find((f) => f.id === cur.parent_id)
    if (parts.length > 20) break
  }
  return parts.join(' / ')
}

const disabledSet = computed(() => {
  if (!props.disabledIds) return new Set<number>()
  if (props.disabledIds instanceof Set) return props.disabledIds
  return new Set(props.disabledIds as number[])
})

function isDisabled(id: number | null): boolean {
  if (id == null) return false
  return disabledSet.value.has(id)
}

const selectedName = computed(() => {
  if (props.selectedId === null) return 'Belum dipilih'
  if (props.selectedId === 0) return 'Koleksi Utama (Root)'
  const f = props.folders.find((x) => x.id === props.selectedId)
  return f ? f.name : `Folder #${props.selectedId}`
})

const isConfirmDisabled = computed(() => {
  if (props.selectedId === null) return true
  if (isDisabled(props.selectedId)) return true
  return false
})

const isSelectedDisabled = computed(() => props.selectedId != null && disabledSet.value.has(props.selectedId))

function goBack() {
  if (props.navId == null) return
  const cur = props.folders.find((f) => f.id === props.navId)
  emit('update:navId', cur?.parent_id ?? null)
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
