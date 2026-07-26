<template>
  <div class="min-h-screen bg-white py-12">
    <div class="container mx-auto px-4 max-w-4xl">
      <!-- Loading State -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand mb-4"></div>
        <p class="text-body-md text-muted">Memuat koleksi yang dibagikan...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error || !bundle" class="text-center py-20">
        <div class="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle class="w-10 h-10" />
        </div>
        <h1 class="text-heading-lg text-brand mb-2">Koleksi Tidak Ditemukan</h1>
        <p class="text-body-md text-muted mb-8">Maaf, link share ini mungkin sudah tidak valid atau sudah kedaluwarsa.</p>
        <router-link :to="{ name: 'amalan-list' }" class="btn-primary">Kembali ke Beranda</router-link>
      </div>

      <!-- Bundle Content -->
      <div v-else>
        <div class="bg-gradient-to-r from-primary-50 to-white p-8 rounded-2xl border border-green-100 mb-12">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span class="inline-block px-3 py-1 bg-brand text-white text-xs font-bold rounded-full mb-3 uppercase tracking-wider">Koleksi Dibagikan</span>
              <h1 class="text-heading-xl text-brand mb-3">{{ bundle.title }}</h1>
              <p v-if="bundle.description" class="text-body-md text-muted">{{ bundle.description }}</p>
            </div>
            <button 
              @click="importBundle" 
              class="btn-primary flex items-center gap-2 px-8 py-4 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
              :disabled="importing"
            >
              <Download class="w-6 h-6" />
              <span>{{ importing ? 'Mengimpor...' : 'Impor Koleksi' }}</span>
            </button>
          </div>
          <div class="mt-6 flex items-center gap-6 text-body-sm text-muted">
            <div class="flex items-center gap-2">
              <BookOpen class="w-4 h-4 text-brand" />
              <span>{{ bundle.share_bundle_items.length }} Amalan</span>
            </div>
            <div class="flex items-center gap-2">
              <Calendar class="w-4 h-4 text-brand" />
              <span>Dibuat {{ new Date(bundle.created_at).toLocaleDateString() }}</span>
            </div>
          </div>
        </div>

        <h2 class="text-heading-md text-brand mb-6">Isi Koleksi</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div 
            v-for="item in bundle.share_bundle_items" 
            :key="item.id"
            class="p-6 rounded-xl border border-gray-100 bg-white hover:border-brand transition-colors"
          >
            <div class="flex items-start gap-4">
              <div class="p-3 rounded-lg bg-green-50 text-green-600">
                <FileText class="w-6 h-6" />
              </div>
              <div>
                <h3 class="text-heading-sm text-brand mb-1">{{ item.amalan.judul }}</h3>
                <p class="text-body-sm text-muted line-clamp-2 mb-3">{{ item.amalan.ringkasan }}</p>
                <div v-if="item.folder_path" class="flex items-center gap-1.5 text-xs text-brand/70 bg-brand/5 px-2 py-1 rounded-md w-fit">
                  <Folder class="w-3 h-3" />
                  <span>Folder: {{ item.folder_path }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getShareBundle } from '@/services/shareService'
import { downloadMarkdown, getById } from '@/services/amalanService'
import { db, type LocalFolder } from '@/utils/localDb'
import { 
  Download, BookOpen, Calendar, FileText, Folder, AlertCircle 
} from 'lucide-vue-next'
import { useToast } from '@/composables/useToast'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const loading = ref(true)
const error = ref(false)
const bundle = ref<any>(null)
const importing = ref(false)

async function loadBundle() {
  const shareId = route.params.share_id as string
  try {
    loading.value = true
    bundle.value = await getShareBundle(shareId)
  } catch (err) {
    console.error('Error loading bundle:', err)
    error.value = true
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadBundle()
})

async function importBundle() {
  if (!bundle.value) return
  
  importing.value = true
  try {
    const folderMap = new Map<string, number>()
    
    for (const item of bundle.value.share_bundle_items) {
      let folder_id = 0
      
      // Create folders if they don't exist
      if (item.folder_path) {
        const parts = item.folder_path.split('/')
        let parent_id: number | null = null
        let pathAccumulator = ''
        
        for (const part of parts) {
          pathAccumulator = pathAccumulator ? `${pathAccumulator}/${part}` : part
          
          if (folderMap.has(pathAccumulator)) {
            parent_id = folderMap.get(pathAccumulator)!
          } else {
            // Check if folder exists in DB
            const existing: LocalFolder | undefined = await db.folders.where({ name: part, parent_id }).first()
            if (!existing) {
              const newId = await db.folders.add({
                name: part,
                parent_id,
                created_at: Date.now(),
                updated_at: Date.now()
              }) as number
              folderMap.set(pathAccumulator, newId)
              parent_id = newId
            } else {
              parent_id = existing.id!
              folderMap.set(pathAccumulator, parent_id)
            }
          }
        }
        folder_id = parent_id || 0
      }
      
      // Download and save amalan content
      const fullAmalan = await getById(item.amalan_id)
        
      if (fullAmalan) {
        const content = await downloadMarkdown(fullAmalan.id)
        
        // Check if already saved
        const existingLocal = await db.saved_amalan.where('amalan_id').equals(fullAmalan.id).first()
        if (existingLocal) {
          await db.saved_amalan.update(existingLocal.id!, {
            folder_id,
            content,
            content_version: fullAmalan.content_version,
            server_updated_at: fullAmalan.updated_at || new Date().toISOString(),
            last_synced_at: Date.now()
          })
        } else {
          await db.saved_amalan.add({
            amalan_id: fullAmalan.id,
            judul: fullAmalan.judul,
            slug: fullAmalan.slug,
            ringkasan: fullAmalan.ringkasan,
            content,
            content_version: fullAmalan.content_version,
            server_updated_at: fullAmalan.updated_at || new Date().toISOString(),
            saved_at: Date.now(),
            last_synced_at: Date.now(),
            has_update_available: false,
            folder_id
          })
        }
      }
    }
    
    toast.success('Koleksi berhasil diimpor ke koleksi offline Anda.')
    router.push({ name: 'amalan-offline' })
  } catch (err) {
    console.error('Error importing bundle:', err)
    toast.error('Gagal mengimpor koleksi. Pastikan Anda memiliki koneksi internet.')
  } finally {
    importing.value = false
  }
}
</script>
