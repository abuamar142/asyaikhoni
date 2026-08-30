<template>
  <div class="min-h-screen bg-[#fdfcf8] selection:bg-emerald-100 selection:text-emerald-900">
    <AppHeader />
    <!-- offset for fixed header h-16 (64px) — matches AmalanList -->
    <div class="pt-16">
      <div aria-hidden="true" class="pointer-events-none fixed inset-0">
      <div class="absolute inset-0 opacity-[0.025]" style="background-image: radial-gradient(circle at 1px 1px, #0f2e1c 1px, transparent 0); background-size: 22px 22px"></div>
    </div>

    <PageHero
        eyebrow="KOLEKSI PRIBADI · OFFLINE"
        eyebrow-accent="TERSIMPAN DI PERANGKAT"
        title="Koleksi"
        title-accent="Amalan Saya"
        description="Kelola amalan yang telah Anda simpan untuk akses offline. Atur dalam folder, bagikan sebagai koleksi, dan baca kapan saja tanpa koneksi."
        show-arc
      >
        <template #actions-left>
          <div
            class="inline-flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-full bg-emerald-50 border border-emerald-100"
          >
            <span class="inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-700 text-white">
              <BookMarked class="w-3.5 h-3.5" />
            </span>
            <span class="text-[13px] font-medium text-emerald-900"
              ><span class="font-semibold">{{ savedAmalan.length }}</span>
              <span class="text-emerald-700/80"> amalan</span>
            </span>
            <span class="w-px h-4 bg-emerald-200"></span>
            <span class="text-[12px] text-emerald-700">{{ allFolders.length }} folder</span>
          </div>
        </template>

        <template #actions-right>
          <BaseButton variant="secondary" pill class="text-[13px]" @click="isCreatingFolder = true">
            <FolderPlus class="w-4 h-4 text-emerald-700" />
            Folder Baru
          </BaseButton>
          <BaseButton
            v-if="currentFolderId !== null"
            variant="secondary"
            pill
            class="text-[13px] !border-emerald-200 !text-emerald-800 hover:!bg-emerald-50"
            @click="isCreatingFolder = true"
          >
            <FolderPlus class="w-4 h-4" />
            Buat Subfolder
          </BaseButton>
          <BaseButton variant="primary" pill class="text-[13px]" @click="startShare(null)">
            <Share2 class="w-4 h-4" />
            Bagikan Semua
          </BaseButton>
        </template>

        <template #stats-right>
          <div class="text-[11px] tracking-[0.16em] uppercase font-semibold text-stone-400 mb-2">
            Koleksi tersimpan
          </div>
          <div
            class="font-serif text-5xl font-[300] tracking-[-0.04em] leading-none text-[#12291a]"
            style="font-family: 'Fraunces', Georgia, serif"
          >
            {{ String(savedAmalan.length).padStart(2, '0') }}
          </div>
          <div class="text-sm text-stone-500 mt-1.5">{{ allFolders.length }} folder · offline</div>
          <div class="mt-5 h-px w-24 bg-gradient-to-r from-transparent to-emerald-200"></div>
          <div class="mt-3 text-[11px] leading-[1.5] text-stone-500 max-w-[18rem] text-pretty">
            Tersimpan di perangkat. Atur dalam folder dan bagikan sebagai koleksi.
          </div>
        </template>
      </PageHero>

      <div v-if="breadcrumbPath.length > 0 || currentFolderId !== null" class="relative container mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">

        <!-- Breadcrumb nav -->
        <div class="flex items-center gap-1.5 py-3 sm:py-4 text-[13px] flex-wrap">
          <BaseButton
            variant="ghost"
            pill
            size="sm"
            class="!bg-emerald-50 !border-emerald-100 !text-emerald-800 hover:!bg-emerald-100"
            @click="goToRoot"
          >
            <ArrowLeft class="w-3.5 h-3.5" /> Koleksi
          </BaseButton>
          <template v-for="(crumb, idx) in breadcrumbPath" :key="crumb.id">
            <ChevronRight class="w-4 h-4 text-stone-400 shrink-0" />
            <BaseButton
              v-if="idx < breadcrumbPath.length - 1"
              variant="secondary"
              pill
              size="sm"
              @click="goToBreadcrumb(crumb)"
            >
              <Folder class="w-3.5 h-3.5 text-emerald-700" /> {{ crumb.name }}
            </BaseButton>
            <span
              v-else
              class="inline-flex items-center gap-1.5 font-medium text-stone-700 bg-white border border-stone-200 px-2.5 py-1 rounded-full"
            >
              <Folder class="w-3.5 h-3.5 text-emerald-700" /> {{ crumb.name }}
            </span>
          </template>
        </div>
      </div>

    <div class="relative container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
      <!-- Folders / Subfolders grid (filtered by currentFolderId) -->
      <div v-if="displayFolders.length > 0" class="mb-10">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-[11px] tracking-[0.16em] font-semibold uppercase text-stone-500">
            {{ currentFolderId === null ? 'Folder Anda' : `Subfolder di ${currentFolder?.name ?? ''}` }}
          </h2>
          <span class="text-[12px] text-stone-400">{{ displayFolders.length }} folder</span>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          <div
            v-for="folder in displayFolders"
            :key="folder.id"
            class="group relative p-5 md:p-6 rounded-[18px] border border-[#e8e6de] bg-white hover:border-emerald-200 hover:shadow-[0_12px_28px_rgba(16,40,22,0.08)] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
            @click="openFolder(folder)"
          >
            <div class="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-emerald-200/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div class="flex items-center gap-4">
              <div class="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 inline-flex items-center justify-center group-hover:bg-emerald-700 group-hover:text-white group-hover:border-emerald-700 transition-colors">
                <Folder class="w-5 h-5" />
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="font-serif text-[16px] font-semibold leading-tight text-[#12291a] truncate" style="font-family: 'Fraunces', Georgia, serif">{{ folder.name }}</h3>
                <p class="text-[12px] text-stone-500">Folder koleksi</p>
              </div>
              <div class="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                <BaseButton
                  variant="ghost"
                  pill
                  class="w-8 h-8 !p-0 shrink-0"
                  title="Bagikan folder"
                  @click.stop="startShare(folder)"
                >
                  <Share2 class="w-3.5 h-3.5" />
                </BaseButton>
                <BaseButton
                  variant="ghost"
                  pill
                  class="w-8 h-8 !p-0 shrink-0"
                  @click.stop="editFolder(folder)"
                >
                  <Edit2 class="w-3.5 h-3.5" />
                </BaseButton>
                <BaseButton
                  variant="ghost"
                  pill
                  class="w-8 h-8 !p-0 shrink-0 !border-red-200 !text-red-600 hover:!bg-red-50"
                  @click.stop="confirmDeleteFolder(folder)"
                >
                  <Trash2 class="w-3.5 h-3.5" />
                </BaseButton>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- When inside a folder with no subfolders but also check empty handling: show Buat Subfolder hint -->
      <div v-if="currentFolderId !== null && displayFolders.length === 0" class="mb-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-[11px] tracking-[0.16em] font-semibold uppercase text-stone-500">Subfolder</h2>
          <BaseButton variant="ghost" pill size="sm" class="text-[12px] !border-transparent !bg-transparent !text-emerald-700 hover:!text-emerald-800" @click="isCreatingFolder = true">
            <FolderPlus class="w-3.5 h-3.5" /> Buat Subfolder
          </BaseButton>
        </div>
        <p class="text-[13px] text-stone-500">Belum ada subfolder di dalam "{{ currentFolder?.name }}".</p>
      </div>

      <!-- Saved amalan heading -->
      <div v-if="savedAmalan.length > 0" class="flex items-center justify-between mb-4">
        <h2 class="text-[11px] tracking-[0.16em] font-semibold uppercase text-stone-500">
          Amalan tersimpan <span class="normal-case tracking-normal font-medium text-stone-400">· {{ savedAmalan.length }}</span>
        </h2>
        <div class="h-px flex-1 mx-4 bg-[#ece9e0] hidden sm:block"></div>
      </div>

      <div v-if="savedAmalan.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
        <AmalanCard
          v-for="item in savedAmalan"
          :key="item.id"
          :item="item as any"
          mode="offline"
        >
          <template #actions>
            <BaseButton variant="ghost" pill class="w-8 h-8 !p-0" title="Pindahkan ke folder" @click="openMoveModal(item)">
              <Move class="w-3.5 h-3.5" />
            </BaseButton>
            <BaseButton
              variant="ghost"
              pill
              class="w-8 h-8 !p-0 !border-red-200 !text-stone-500 hover:!bg-red-50 hover:!text-red-600 hover:!border-red-200"
              title="Hapus dari offline"
              @click="removeFromOffline(item)"
            >
              <Trash2 class="w-3.5 h-3.5" />
            </BaseButton>
          </template>
        </AmalanCard>
      </div>

      <!-- Empty state -->
      <div v-if="allFolders.length === 0 && savedAmalan.length === 0" class="flex flex-col items-center justify-center py-16 md:py-20">
        <EmptyState
          title="Belum ada amalan tersimpan"
          description="Jelajahi katalog dan ketuk “Simpan offline” pada halaman detail amalan untuk membacanya kapan saja tanpa koneksi."
        >
          <template #icon>
            <BookHeart class="h-9 w-9 text-emerald-700" :stroke-width="1.6" />
            <span
              class="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-amber-300 shadow-sm"
              aria-hidden="true"
            >
              <Bookmark class="h-3 w-3 text-[#14532d]" />
            </span>
          </template>
          <template #actions>
            <BaseButton as="router-link" :to="{ name: 'amalan-list' }" variant="primary" pill> <Library class="w-4 h-4" /> Jelajahi Amalan </BaseButton>
          </template>
        </EmptyState>
      </div>
    </div>

    <!-- Create/Edit Folder Modal — migrated to BaseModal -->
    <BaseModal
      :open="!!(isCreatingFolder || editingFolderData)"
      :title="editingFolderData ? 'Edit Folder' : currentFolderId !== null ? 'Subfolder Baru' : 'Folder Baru'"
      subtitle="Beri nama yang mudah dikenali."
      @close="closeFolderModal"
    >
      <template #headerIcon>
        <span class="w-8 h-8 rounded-full bg-emerald-700 inline-flex items-center justify-center shadow-[0_2px_8px_rgba(21,128,61,0.25)] shrink-0">
          <Folder class="w-4 h-4 text-white" />
        </span>
      </template>
      <div class="p-6 sm:p-7">
        <p v-if="!editingFolderData && currentFolder?.name" class="text-[12px] text-emerald-700 mb-4">Di dalam: {{ breadcrumbPath.map((b) => b.name).join(' / ') }}</p>
        <label class="block text-[12px] font-semibold tracking-[0.08em] uppercase text-stone-600 mb-2">Nama Folder</label>
        <input
          v-model="folderForm.name"
          type="text"
          placeholder="Contoh: Wirid Harian"
          class="w-full px-4 py-3 rounded-xl border border-[#d7ddd7] bg-white text-[14px] text-[#12291a] placeholder:text-stone-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-300 transition-all"
          @keyup.enter="saveFolder"
        />
      </div>
      <template #footer>
        <div class="flex items-center justify-end gap-3">
          <BaseButton variant="ghost" pill @click="closeFolderModal">Batal</BaseButton>
          <BaseButton variant="primary" pill :disabled="!folderForm.name.trim()" class="px-6" @click="saveFolder">Simpan</BaseButton>
        </div>
      </template>
    </BaseModal>

    <!-- Move to Folder — unified FolderPicker -->
    <FolderPicker
      :open="showMoveModal"
      :folders="allFolders"
      v-model:selectedId="moveSelectedId as any"
      v-model:navId="moveNavId"
      title="Pindah ke…"
      :subtitle="moveAmalan ? `“${moveAmalan.judul}” — tap baris untuk pilih, tap > untuk masuk.` : undefined"
      confirm-label="Pindahkan ke sini"
      :disabled-ids="disabledMoveIds"
      @close="closeMoveModal"
      @confirm="confirmMove"
    />

    <ConfirmDialog
      v-model="isConfirmingDelete"
      title="Hapus Folder?"
      :message="`Apakah Anda yakin ingin menghapus folder '${folderToDelete?.name}'? Item di dalamnya tidak akan terhapus, hanya akan dikeluarkan dari folder.`"
      @confirm="deleteFolder"
      @cancel="isConfirmingDelete = false"
    />

    <!-- Share Modal — migrated to BaseModal -->
    <BaseModal
      :open="!!sharingData"
      :title="shareResult ? 'Link share berhasil dibuat!' : 'Bagikan Koleksi'"
      :subtitle="shareResult ? 'Salin tautan di bawah ini dan bagikan.' : sharingData?.folder ? `Bagikan folder '${sharingData.folder.name}' beserta seluruh isinya.` : 'Bagikan seluruh koleksi amalan offline Anda.'"
      max-width-class="max-w-lg"
      @close="sharingData = null"
    >
      <template #headerIcon>
        <span v-if="!shareResult" class="w-8 h-8 rounded-full bg-emerald-700 inline-flex items-center justify-center shadow-[0_2px_8px_rgba(21,128,61,0.25)] shrink-0">
          <Share2 class="w-4 h-4 text-white" />
        </span>
        <span v-else class="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 inline-flex items-center justify-center shrink-0">
          <CheckCircle class="w-4 h-4" />
        </span>
      </template>

      <div class="p-6 sm:p-8">
        <div v-if="!shareResult" class="space-y-4">
          <div>
            <label class="block text-[12px] font-semibold tracking-[0.08em] uppercase text-stone-600 mb-2">Judul Koleksi</label>
            <input v-model="shareForm.title" type="text" class="w-full px-4 py-3 rounded-xl border border-[#d7ddd7] bg-white text-[14px] focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-300 placeholder:text-stone-400" placeholder="Koleksi Wirid Saya" />
          </div>
          <div>
            <label class="block text-[12px] font-semibold tracking-[0.08em] uppercase text-stone-600 mb-2">Deskripsi (Opsional)</label>
            <textarea v-model="shareForm.description" class="w-full px-4 py-3 rounded-xl border border-[#d7ddd7] bg-white text-[14px] focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-300 placeholder:text-stone-400" rows="3" placeholder="Kumpulan doa dan wirid pilihan…"></textarea>
          </div>
        </div>
        <div v-else class="text-center">
          <div class="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 inline-flex items-center justify-center mx-auto mb-4">
            <CheckCircle class="w-8 h-8" />
          </div>
          <p v-if="(shareResult as any)?.is_local" class="text-[11px] leading-[1.5] text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mt-4 text-left">
            Mode lokal — server tidak tersedia (404). Link hanya bisa dibuka di perangkat ini. Coba lagi saat online untuk link yang bisa dibagikan antar perangkat.
          </p>
          <div class="flex items-center gap-2 p-2 bg-stone-50 rounded-xl border border-stone-200 mt-4">
            <input readonly :value="shareResult.share_url" class="bg-transparent border-none focus:ring-0 flex-1 px-3 text-[13px] text-stone-700 truncate" />
            <BaseButton variant="primary" class="!rounded-xl w-10 h-10 !p-0 shrink-0" @click="copyShareLink">
              <Copy class="w-4 h-4" />
            </BaseButton>
          </div>
        </div>
      </div>

      <template #footer>
        <div v-if="!shareResult" class="flex items-center gap-3 justify-end">
          <BaseButton variant="ghost" pill @click="sharingData = null">Batal</BaseButton>
          <BaseButton variant="primary" pill :disabled="!shareForm.title.trim() || generatingShare" @click="generateShare">
            <Share2 v-if="!generatingShare" class="w-4 h-4" />
            <span v-else class="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></span>
            <span>{{ generatingShare ? 'Memproses…' : 'Buat Link Share' }}</span>
          </BaseButton>
        </div>
        <div v-else>
          <BaseButton variant="ghost" pill block @click="sharingData = null">Tutup</BaseButton>
        </div>
      </template>
    </BaseModal>
    </div>

  </div>
</template>

<script setup lang="ts">
import AppHeader from '@/components/layout/AppHeader.vue'
import PageHero from '@/components/ui/PageHero.vue'
import { ref, computed, onMounted } from 'vue'
import { useBodyLock } from '@/composables/useBodyLock'
import { useEsc } from '@/composables/useEsc'
import { db, type LocalSavedAmalan, type LocalFolder, ensureDbReady, isIndexedDBAvailable } from '@/utils/localDb'
import {
  Folder,
  FolderPlus,
  Edit2,
  Trash2,
  Move,
  BookHeart,
  BookMarked,
  Bookmark,
  Share2,
  ChevronRight,
  Copy,
  CheckCircle,
  X,
  ArrowLeft,
  Library,
} from 'lucide-vue-next'
import { useToast } from '@/composables/useToast'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
import FolderPicker from '@/components/FolderPicker.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import AmalanCard from '@/components/AmalanCard.vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { createShareBundle } from '@/services/shareService'
import { toPlainLyrics } from '@/utils/lyric'
import { buildBreadcrumb, collectDescendants, type Folder as TreeFolder } from '@/utils/folderTree'

const toast = useToast()

const allFolders = ref<LocalFolder[]>([])
const savedAmalan = ref<LocalSavedAmalan[]>([])
const currentFolderId = ref<number | null>(null)

const currentFolder = computed<LocalFolder | null>(() => {
  if (currentFolderId.value == null) return null
  return allFolders.value.find((f) => f.id === currentFolderId.value) ?? null
})

const displayFolders = computed(() => allFolders.value.filter((f) => (f.parent_id ?? null) === currentFolderId.value))

const breadcrumbPath = computed(() => buildBreadcrumb(currentFolderId.value, allFolders.value))

async function loadData() {
  try {
    if (!isIndexedDBAvailable()) {
      console.warn('[offline] IndexedDB not available (private mode / insecure context)')
      return
    }
    try {
      await ensureDbReady()
    } catch (e) {
      console.error('[offline] ensureDbReady failed', e)
    }

    allFolders.value = await db.folders.toArray()
    if (currentFolderId.value != null) {
      savedAmalan.value = await db.saved_amalan.where('folder_id').equals(currentFolderId.value).toArray()
    } else {
      savedAmalan.value = await db.saved_amalan.where('folder_id').equals(0).toArray()
    }
  } catch (err) {
    console.error('[offline] loadData failed', err)
    toast.error('Gagal memuat koleksi offline.')
  }
}

onMounted(() => {
  loadData()
})

// Folder Logic
const isCreatingFolder = ref(false)
const editingFolderData = ref<LocalFolder | null>(null)
const folderForm = ref({ name: '' })

function closeFolderModal() {
  isCreatingFolder.value = false
  editingFolderData.value = null
  folderForm.value.name = ''
}

async function saveFolder() {
  if (!folderForm.value.name.trim()) return

  if (editingFolderData.value) {
    await db.folders.update(editingFolderData.value.id!, {
      name: folderForm.value.name.trim(),
      updated_at: Date.now(),
    })
    toast.success('Folder diperbarui.')
  } else {
    await db.folders.add({
      name: folderForm.value.name.trim(),
      parent_id: currentFolderId.value,
      created_at: Date.now(),
      updated_at: Date.now(),
    })
    toast.success('Folder dibuat.')
  }

  closeFolderModal()
  loadData()
}

function editFolder(folder: LocalFolder) {
  editingFolderData.value = folder
  folderForm.value.name = folder.name
}

const isConfirmingDelete = ref(false)
const folderToDelete = ref<LocalFolder | null>(null)

function confirmDeleteFolder(folder: LocalFolder) {
  folderToDelete.value = folder
  isConfirmingDelete.value = true
}

async function deleteFolder() {
  if (!folderToDelete.value?.id) return

  try {
    await ensureDbReady()
    const targetId = folderToDelete.value.id!
    const all = await db.folders.toArray()
    const toDeleteIds = new Set<number>(collectDescendants(targetId, all))
    // move amalan in deleted folders (and descendants) to root
    for (const fid of toDeleteIds) {
      try {
        await db.saved_amalan.where('folder_id').equals(fid).modify({ folder_id: 0 })
      } catch (e) {
        console.error('[offline] deleteFolder modify failed for', fid, e)
      }
    }
    // delete folder records
    for (const fid of toDeleteIds) {
      try {
        await db.folders.delete(fid)
      } catch (e) {
        console.error('[offline] delete folder record failed', fid, e)
      }
    }
    if (currentFolderId.value != null && toDeleteIds.has(currentFolderId.value)) {
      currentFolderId.value = null
    }
  } catch (e) {
    console.error('[offline] deleteFolder failed', e)
    toast.error('Gagal menghapus folder.')
    return
  }
  isConfirmingDelete.value = false
  folderToDelete.value = null
  toast.success('Folder dihapus.')
  loadData()
}

function openFolder(folder: LocalFolder) {
  currentFolderId.value = folder.id!
  loadData()
}

function closeFolder() {
  currentFolderId.value = null
  loadData()
}

function goToRoot() {
  currentFolderId.value = null
  loadData()
}

function goToBreadcrumb(folder: TreeFolder) {
  currentFolderId.value = folder.id!
  loadData()
}

// kept for template backward compat if referenced elsewhere
function goBack() {
  if (currentFolder.value?.parent_id != null) {
    currentFolderId.value = currentFolder.value.parent_id
  } else {
    currentFolderId.value = null
  }
  loadData()
}

// Item Logic — drill-down move modal (unified FolderPicker)
const movingItem = ref<LocalSavedAmalan | null>(null)

const showMoveModal = ref(false)
const moveAmalan = ref<LocalSavedAmalan | null>(null)
const moveNavId = ref<number | null>(null)
const moveSelectedId = ref<number | null>(null)

const displayMoveFolders = computed(() => allFolders.value.filter((f) => (f.parent_id ?? null) === moveNavId.value))
const moveBreadcrumb = computed(() => buildBreadcrumb(moveNavId.value, allFolders.value))
const moveTargetFolderId = computed(() => moveSelectedId.value ?? moveNavId.value ?? 0)
const moveSourceFolderId = computed(() => (moveAmalan.value as any)?.folder_id ?? 0)
const isMoveToCurrentFolder = computed(() => moveSourceFolderId.value === moveTargetFolderId.value)
const moveCurrentFolder = computed<LocalFolder | null>(() => {
  if (moveNavId.value == null) return null
  return allFolders.value.find((f) => f.id === moveNavId.value) ?? null
})
const disabledMoveIds = computed(() => new Set<number>([moveSourceFolderId.value]))

function showMoveToFolder(item: LocalSavedAmalan) {
  // legacy entry point — delegate to drill-down modal
  openMoveModal(item)
}

function openMoveModal(item: LocalSavedAmalan) {
  moveAmalan.value = item
  movingItem.value = item
  moveNavId.value = null
  moveSelectedId.value = null
  showMoveModal.value = true
}

function closeMoveModal() {
  showMoveModal.value = false
  moveAmalan.value = null
  movingItem.value = null
  moveSelectedId.value = null
}

function enterMoveFolder(folder: LocalFolder) {
  if (folder.id == null) return
  moveNavId.value = folder.id
}

function moveGoBack() {
  if (moveNavId.value == null) return
  const cur = allFolders.value.find((f) => f.id === moveNavId.value)
  moveNavId.value = cur?.parent_id ?? null
}

function moveGoRoot() {
  moveNavId.value = null
}

function moveGoToCrumb(folder: LocalFolder) {
  if (folder.id == null) return
  moveNavId.value = folder.id
}

async function confirmMove() {
  if (!moveAmalan.value) return
  if (moveSelectedId.value == null) {
    toast.error('Pilih folder tujuan terlebih dahulu.')
    return
  }
  const folderId = moveSelectedId.value
  movingItem.value = moveAmalan.value
  await moveToFolder(folderId)
  if (showMoveModal.value) {
    if (!movingItem.value) {
      closeMoveModal()
    }
  }
}

async function moveToFolder(folderId: number) {
  if (!movingItem.value) return

  const amalanId = String((movingItem.value as any).amalan_id ?? '')
  if (!amalanId) {
    toast.error('Data amalan tidak valid.')
    return
  }
  try {
    await ensureDbReady()
    const existing = await db.saved_amalan.where('[amalan_id+folder_id]').equals([amalanId, folderId]).first()
    if (existing) {
      toast.error('Sudah ada di folder tersebut')
      return
    }
  } catch (e) {
    console.error('[offline] move duplicate check failed', e)
  }

  try {
    await ensureDbReady()
    const currentFolder = (movingItem.value as any).folder_id ?? 0
    if ((movingItem.value as any).id != null) {
      try {
        await db.saved_amalan.update((movingItem.value as any).id!, { folder_id: folderId })
      } catch (err: any) {
        // fallback for compound primary without ++id: delete old compound and add new
        const msg = err?.name || err?.message || ''
        if (/ConstraintError|DataError|InvalidState/i.test(msg)) {
          const oldData: any = { ...movingItem.value, folder_id: folderId }
          delete oldData.id
          const plain = JSON.parse(JSON.stringify(oldData))
          await db.saved_amalan.where('[amalan_id+folder_id]').equals([amalanId, currentFolder]).delete()
          await db.saved_amalan.add(plain)
        } else {
          throw err
        }
      }
    } else {
      // no numeric id — use compound delete+add
      const oldData: any = { ...movingItem.value, folder_id: folderId }
      const plain = JSON.parse(JSON.stringify(oldData))
      delete plain.id
      await db.saved_amalan.where('[amalan_id+folder_id]').equals([amalanId, currentFolder]).delete()
      await db.saved_amalan.add(plain)
    }
    toast.success('Berhasil dipindahkan.')
    movingItem.value = null
    // also sync new modal state
    moveAmalan.value = null
    showMoveModal.value = false
    loadData()
  } catch (err: any) {
    console.error('[offline] moveToFolder failed', err)
    const msg = err?.message || ''
    if (/ConstraintError|already exists|unique/i.test(msg)) {
      toast.error('Sudah ada di folder tersebut')
    } else {
      toast.error('Gagal memindahkan.')
    }
  }
}



async function removeFromOffline(item: LocalSavedAmalan) {
  try {
    await ensureDbReady()
    if ((item as any).id != null) {
      try {
        await db.saved_amalan.delete((item as any).id)
      } catch {
        // fallback compound delete if primary is compound
        await db.saved_amalan.where('[amalan_id+folder_id]').equals([String((item as any).amalan_id), (item as any).folder_id ?? 0]).delete()
      }
    } else {
      await db.saved_amalan.where('[amalan_id+folder_id]').equals([String((item as any).amalan_id), (item as any).folder_id ?? 0]).delete()
    }
    toast.success('Dihapus dari koleksi offline.')
    loadData()
  } catch (e) {
    console.error('[offline] removeFromOffline failed', e)
    toast.error('Gagal menghapus.')
  }
}

// Sharing Logic
const sharingData = ref<{ folder: LocalFolder | null } | null>(null)
const shareForm = ref({ title: '', description: '' })
const generatingShare = ref(false)
const shareResult = ref<{ share_url: string; is_local?: boolean; public_share_id?: string } | null>(null)

function startShare(folder: LocalFolder | null) {
  sharingData.value = { folder }
  shareForm.value = {
    title: folder ? folder.name : 'Koleksi Amalan Saya',
    description: '',
  }
  shareResult.value = null
}

async function generateShare() {
  if (!sharingData.value) return
  generatingShare.value = true

  try {
    let itemsToShare: LocalSavedAmalan[] = []

    if (sharingData.value.folder) {
      itemsToShare = await db.saved_amalan.where('folder_id').equals(sharingData.value.folder.id!).toArray()
    } else {
      itemsToShare = await db.saved_amalan.toArray()
    }

    if (itemsToShare.length === 0) {
      toast.error('Koleksi kosong, tidak ada yang bisa dibagikan.')
      generatingShare.value = false
      return
    }

    // Build plain sanitized items with lyrics + slug fallback
    const folderName = sharingData.value.folder ? sharingData.value.folder.name : null

    const payload = {
      title: shareForm.value.title,
      description: shareForm.value.description,
      items: itemsToShare.map((item, idx) => {
        // Resolve lyrics: prefer item.lyrics, fallback to parsed content JSON (backwards compat)
        let rawLyrics: any[] | null = null
        if (item.lyrics && Array.isArray(item.lyrics) && item.lyrics.length > 0) {
          rawLyrics = item.lyrics
        } else if (item.content) {
          try {
            const parsed = JSON.parse(item.content)
            if (Array.isArray(parsed) && parsed.length > 0 && parsed[0]?.arab) rawLyrics = parsed
          } catch {
            // ignore parse error, fallback to empty
          }
        }
        const plainLyrics = rawLyrics ? toPlainLyrics(rawLyrics as any) : []

        return {
          amalan_id: String(item.amalan_id ?? ''),
          title: String(item.judul ?? ''),
          slug: String(item.slug || item.amalan_id || ''),
          lyrics: plainLyrics,
          folder_path: folderName,
          sort_order: idx,
          version_at_share: Number(item.content_version ?? 1),
        }
      }),
    }

    // Ensure plain clone for DataCloneError safety (Vue proxies / Dexie)
    const plainPayload = JSON.parse(JSON.stringify(payload))

    const result: any = await createShareBundle(plainPayload as any)
    shareResult.value = result
    // Offline-first fallback: if server 404/network, shareService returns is_local=true
    if (result?.is_local) {
      // auto-copy local link and inform user it works on this device
      try {
        await navigator.clipboard.writeText(result.share_url)
        toast.success('Link lokal disalin — bisa dibuka di perangkat ini')
      } catch {}
    } else {
      // server success — also auto-copy for convenience
      try {
        await navigator.clipboard.writeText(result.share_url)
      } catch {}
    }
  } catch (err: any) {
    console.error('Error generating share bundle:', err)
    const message = err?.message || ''
    // Show specific error from shareService, not generic offline message
    if (message === 'Anda sedang offline') toast.error('Anda sedang offline')
    else if (message === 'Periksa koneksi internet') toast.error('Periksa koneksi internet')
    else if (message === 'Fitur share belum tersedia di server (404)') toast.error('Fitur share belum tersedia di server (404)')
    else if (message.startsWith('Gagal di server')) toast.error(message)
    else toast.error(message || 'Gagal membuat link share.')
  } finally {
    generatingShare.value = false
  }
}

function copyShareLink() {
  if (!shareResult.value) return
  navigator.clipboard
    .writeText(shareResult.value.share_url)
    .then(() => toast.success('Link berhasil disalin!'))
    .catch(() => toast.success('Link disalin'))
}

// Body lock via composable — Esc handled inside BaseModal for folder/share/move modals
const isFolderModalOpen = computed(() => isCreatingFolder.value || !!editingFolderData.value)
const isShareModalOpen = computed(() => !!sharingData.value)
const isAnyOfflineModalOpen = computed(() => showMoveModal.value || isFolderModalOpen.value || isShareModalOpen.value)
useBodyLock(isAnyOfflineModalOpen)
</script>

<style scoped>
.custom-scroll::-webkit-scrollbar {
  width: 6px;
}
.custom-scroll::-webkit-scrollbar-thumb {
  background: #d6d3c4;
  border-radius: 999px;
}
</style>
