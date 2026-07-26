<template>
  <div class="min-h-screen bg-white py-12">
    <div class="container mx-auto px-4">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 class="text-heading-xl text-brand mb-2">Koleksi Amalan Saya</h1>
          <p class="text-body-md text-muted">
            Kelola amalan yang telah Anda simpan untuk akses offline.
          </p>
        </div>
        <div class="flex items-center gap-3">
          <button @click="isCreatingFolder = true" class="btn-secondary flex items-center gap-2">
            <FolderPlus class="w-5 h-5" />
            <span>Folder Baru</span>
          </button>
        </div>
      </div>

      <!-- Breadcrumbs if inside folder -->
      <div v-if="currentFolder" class="flex items-center gap-2 mb-8 text-body-md">
        <button @click="closeFolder" class="text-brand hover:underline">Koleksi</button>
        <ChevronRight class="w-4 h-4 text-muted" />
        <span class="text-muted">{{ currentFolder.name }}</span>
      </div>

      <!-- Root Level Folders -->
      <div v-if="!currentFolder && folders.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <div
          v-for="folder in folders"
          :key="folder.id"
          class="group p-6 rounded-xl border border-gray-200 hover:border-brand hover:shadow-lg transition-all duration-300 cursor-pointer bg-white"
          @click="openFolder(folder)"
        >
          <div class="flex items-center gap-4">
            <div class="p-3 rounded-lg bg-green-50 text-green-600 group-hover:bg-brand group-hover:text-white transition-colors duration-300">
              <Folder class="w-8 h-8" />
            </div>
            <div class="flex-1">
              <h3 class="text-heading-sm text-brand group-hover:text-brand-dark">{{ folder.name }}</h3>
              <p class="text-body-sm text-muted">Folder</p>
            </div>
            <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button @click.stop="editFolder(folder)" class="p-2 hover:bg-gray-100 rounded-lg text-gray-500">
                <Edit2 class="w-4 h-4" />
              </button>
              <button @click.stop="confirmDeleteFolder(folder)" class="p-2 hover:bg-red-50 rounded-lg text-red-500">
                <Trash2 class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Saved Amalan (Ungrouped or Root) -->
      <h2 v-if="savedAmalan.length > 0" class="text-heading-md text-brand mb-6">Amalan Tersimpan</h2>
      <div v-if="savedAmalan.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          v-for="item in savedAmalan"
          :key="item.id"
          class="flex flex-col p-6 rounded-xl border border-gray-200 hover:border-brand hover:shadow-lg transition-all duration-300 bg-white"
        >
          <div class="flex items-start justify-between gap-4 mb-4">
            <router-link :to="{ name: 'amalan-detail', params: { slug: item.slug } }" class="flex-1 group">
              <h3 class="text-heading-sm text-brand group-hover:text-brand-dark mb-2">{{ item.judul }}</h3>
              <p v-if="item.ringkasan" class="text-body-sm text-muted line-clamp-2">{{ item.ringkasan }}</p>
            </router-link>
            <div class="flex items-center gap-2">
              <button @click="showMoveToFolder(item)" class="p-2 hover:bg-gray-100 rounded-lg text-gray-500" title="Pindahkan ke folder">
                <Move class="w-4 h-4" />
              </button>
              <button @click="removeFromOffline(item)" class="p-2 hover:bg-red-50 rounded-lg text-red-500" title="Hapus dari offline">
                <Trash2 class="w-4 h-4" />
              </button>
            </div>
          </div>
          <div class="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
            <span class="text-xs text-muted">Disimpan pada {{ new Date(item.saved_at).toLocaleDateString() }}</span>
            <div v-if="item.has_update_available" class="flex items-center gap-1 text-orange-600 bg-orange-50 px-2 py-1 rounded-full text-xs font-medium">
              <RefreshCw class="w-3 h-3" />
              <span>Update Tersedia</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="folders.length === 0 && savedAmalan.length === 0" class="flex flex-col items-center justify-center py-20 text-center">
        <div class="w-24 h-24 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mb-6">
          <BookOpen class="w-12 h-12" />
        </div>
        <h2 class="text-heading-md text-brand mb-2">Belum ada amalan tersimpan</h2>
        <p class="text-body-md text-muted mb-8 max-w-md mx-auto">
          Cari amalan yang Anda sukai dan klik "Simpan Offline" untuk membacanya kapan saja tanpa koneksi internet.
        </p>
        <router-link :to="{ name: 'amalan-list' }" class="btn-primary">Jelajahi Amalan</router-link>
      </div>
    </div>

    <!-- Create/Edit Folder Modal -->
    <div v-if="isCreatingFolder || editingFolderData" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <h2 class="text-heading-md text-brand mb-6">{{ editingFolderData ? 'Edit Folder' : 'Folder Baru' }}</h2>
        <div class="mb-6">
          <label class="block text-body-sm font-semibold text-brand mb-2">Nama Folder</label>
          <input
            v-model="folderForm.name"
            type="text"
            placeholder="Contoh: Majelis Sholawat"
            class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
            @keyup.enter="saveFolder"
          />
        </div>
        <div class="flex items-center gap-3 justify-end">
          <button @click="closeFolderModal" class="btn-secondary px-6">Batal</button>
          <button @click="saveFolder" class="btn-primary px-6" :disabled="!folderForm.name">Simpan</button>
        </div>
      </div>
    </div>

    <!-- Move to Folder Modal -->
    <div v-if="movingItem" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <h2 class="text-heading-md text-brand mb-2">Pindahkan ke Folder</h2>
        <p class="text-body-sm text-muted mb-6">Pilih folder tujuan untuk "{{ movingItem.judul }}"</p>
        <div class="space-y-3 max-h-64 overflow-y-auto mb-6 pr-2">
          <button
            @click="moveToFolder(0)"
            class="w-full flex items-center gap-3 p-4 rounded-xl border border-gray-100 hover:border-brand hover:bg-green-50 text-left transition-all"
            :class="{ 'border-brand bg-green-50': movingItem.folder_id === 0 }"
          >
            <FolderX class="w-5 h-5 text-muted" />
            <span class="font-medium text-brand">Tanpa Folder (Root)</span>
          </button>
          <button
            v-for="folder in folders"
            :key="folder.id"
            @click="moveToFolder(folder.id!)"
            class="w-full flex items-center gap-3 p-4 rounded-xl border border-gray-100 hover:border-brand hover:bg-green-50 text-left transition-all"
            :class="{ 'border-brand bg-green-50': movingItem.folder_id === folder.id }"
          >
            <Folder class="w-5 h-5 text-brand" />
            <span class="font-medium text-brand">{{ folder.name }}</span>
          </button>
        </div>
        <div class="flex justify-end">
          <button @click="movingItem = null" class="btn-secondary">Tutup</button>
        </div>
      </div>
    </div>

    <ConfirmDialog
      v-model="isConfirmingDelete"
      title="Hapus Folder?"
      :message="`Apakah Anda yakin ingin menghapus folder '${folderToDelete?.name}'? Item di dalamnya tidak akan terhapus, hanya akan dikeluarkan dari folder.`"
      @confirm="deleteFolder"
      @cancel="isConfirmingDelete = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { db, type LocalSavedAmalan, type LocalFolder } from '@/utils/localDb'
import { 
  Folder, FolderPlus, FolderX, Edit2, Trash2, Move, RefreshCw, BookOpen, ChevronRight
} from 'lucide-vue-next'
import { useToast } from '@/composables/useToast'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'

const toast = useToast()

const folders = ref<LocalFolder[]>([])
const savedAmalan = ref<LocalSavedAmalan[]>([])
const currentFolder = ref<LocalFolder | null>(null)

async function loadData() {
  folders.value = await db.folders.toArray()
  if (currentFolder.value) {
    savedAmalan.value = await db.saved_amalan.where('folder_id').equals(currentFolder.value.id!).toArray()
  } else {
    savedAmalan.value = await db.saved_amalan.where('folder_id').equals(0).toArray()
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
  if (!folderForm.value.name) return

  if (editingFolderData.value) {
    await db.folders.update(editingFolderData.value.id!, {
      name: folderForm.value.name,
      updated_at: Date.now()
    })
    toast.success('Folder diperbarui.')
  } else {
    await db.folders.add({
      name: folderForm.value.name,
      created_at: Date.now(),
      updated_at: Date.now()
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
  
  // Update items in this folder to be at root (0)
  await db.saved_amalan.where('folder_id').equals(folderToDelete.value.id).modify({ folder_id: 0 })
  
  await db.folders.delete(folderToDelete.value.id)
  isConfirmingDelete.value = false
  folderToDelete.value = null
  toast.success('Folder dihapus.')
  loadData()
}

function openFolder(folder: LocalFolder) {
  currentFolder.value = folder
  loadData()
}

function closeFolder() {
  currentFolder.value = null
  loadData()
}

// Item Logic
const movingItem = ref<LocalSavedAmalan | null>(null)

function showMoveToFolder(item: LocalSavedAmalan) {
  movingItem.value = item
}

async function moveToFolder(folderId: number) {
  if (!movingItem.value?.id) return
  
  await db.saved_amalan.update(movingItem.value.id, { folder_id: folderId })
  toast.success('Berhasil dipindahkan.')
  movingItem.value = null
  loadData()
}

async function removeFromOffline(item: LocalSavedAmalan) {
  if (!item.id) return
  await db.saved_amalan.delete(item.id)
  toast.success('Dihapus dari koleksi offline.')
  loadData()
}
</script>
