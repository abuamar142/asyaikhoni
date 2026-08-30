<template>
  <div class="min-h-screen bg-[#fdfcf8] selection:bg-emerald-100 selection:text-emerald-900">
    <div aria-hidden="true" class="pointer-events-none fixed inset-0">
      <div class="absolute inset-0 opacity-[0.025]" style="background-image: radial-gradient(circle at 1px 1px, #0f2e1c 1px, transparent 0); background-size: 22px 22px"></div>
    </div>

    <!-- Header -->
    <div class="relative border-b border-[#e8e6de] bg-white/85 backdrop-blur-[8px]">
      <div aria-hidden="true" class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute -right-16 -top-16 w-[360px] h-[360px] rounded-full border border-emerald-100/60 hidden lg:block"></div>
        <div class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-200/40 to-transparent"></div>
      </div>
      <div class="relative container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="py-10 md:py-12 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div class="max-w-2xl">
            <div class="inline-flex items-center gap-3 mb-3">
              <span class="h-px w-8 bg-emerald-700 hidden sm:block"></span>
              <span class="text-[11px] tracking-[0.18em] font-semibold text-emerald-800 uppercase">Koleksi Pribadi · Offline</span>
              <span class="w-1 h-1 rounded-full bg-amber-400 hidden sm:block"></span>
              <span class="text-[11px] tracking-[0.12em] font-medium text-stone-500 uppercase hidden sm:block">Tersimpan di perangkat</span>
            </div>
            <h1 class="font-serif text-[30px] sm:text-[36px] font-[600] tracking-[-0.02em] leading-[1] text-[#0f2318]" style="font-family: 'Fraunces', Georgia, serif">
              Koleksi <span class="font-[300] italic text-emerald-800">Amalan Saya</span>
            </h1>
            <p class="mt-3 text-[15px] leading-[1.7] text-[#5b6b5f] max-w-[42rem] text-pretty">
              Kelola amalan yang telah Anda simpan untuk akses offline. Atur dalam folder, bagikan sebagai koleksi, dan baca kapan saja tanpa koneksi.
            </p>
            <div class="mt-5 inline-flex items-center gap-2 text-[12.5px] text-stone-600 bg-white border border-[#ece9e0] rounded-full pl-1 pr-3 py-1 shadow-sm">
              <span class="inline-flex w-6 h-6 rounded-full bg-emerald-700 text-white items-center justify-center"><BookMarked class="w-3.5 h-3.5" /></span>
              <span class="font-medium text-stone-800">{{ savedAmalan.length }} amalan</span>
              <span class="w-px h-4 bg-stone-200"></span>
              <span>{{ allFolders.length }} folder</span>
            </div>
          </div>
          <div class="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              class="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white border border-[#e7e5e0] text-[13px] font-semibold text-stone-700 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-800 shadow-sm transition-all"
              @click="isCreatingFolder = true"
            >
              <FolderPlus class="w-4 h-4 text-emerald-700" />
              Folder Baru
            </button>
            <button
              v-if="currentFolderId !== null"
              type="button"
              class="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white border border-emerald-200 text-[13px] font-semibold text-emerald-800 hover:bg-emerald-50 shadow-sm transition-all"
              @click="isCreatingFolder = true"
            >
              <FolderPlus class="w-4 h-4" />
              Buat Subfolder
            </button>
            <button
              type="button"
              class="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-emerald-700 text-white text-[13px] font-semibold hover:bg-emerald-800 shadow-sm transition-colors"
              @click="startShare(null)"
            >
              <Share2 class="w-4 h-4" />
              Bagikan Semua
            </button>
          </div>
        </div>

        <!-- Breadcrumb nav -->
        <div v-if="breadcrumbPath.length > 0 || currentFolderId !== null" class="flex items-center gap-1.5 pb-4 text-[13px] flex-wrap">
          <button type="button" class="inline-flex items-center gap-1.5 text-emerald-800 hover:text-emerald-900 font-medium px-2.5 py-1 rounded-full hover:bg-emerald-50 transition-colors" @click="goToRoot">
            <ArrowLeft class="w-3.5 h-3.5" /> Koleksi
          </button>
          <template v-for="(crumb, idx) in breadcrumbPath" :key="crumb.id">
            <ChevronRight class="w-4 h-4 text-stone-400 shrink-0" />
            <button
              v-if="idx < breadcrumbPath.length - 1"
              type="button"
              class="inline-flex items-center gap-1.5 font-medium text-stone-600 hover:text-emerald-800 bg-white border border-stone-200 hover:border-emerald-200 px-2.5 py-1 rounded-full transition-colors"
              @click="goToBreadcrumb(crumb)"
            >
              <Folder class="w-3.5 h-3.5 text-emerald-700" /> {{ crumb.name }}
            </button>
            <span
              v-else
              class="inline-flex items-center gap-1.5 font-medium text-stone-700 bg-white border border-stone-200 px-2.5 py-1 rounded-full"
            >
              <Folder class="w-3.5 h-3.5 text-emerald-700" /> {{ crumb.name }}
            </span>
          </template>
        </div>
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
                <button
                  type="button"
                  class="w-8 h-8 rounded-full bg-white border border-stone-200 hover:border-emerald-200 hover:bg-emerald-50 text-stone-500 hover:text-emerald-700 inline-flex items-center justify-center transition-colors"
                  title="Bagikan folder"
                  @click.stop="startShare(folder)"
                >
                  <Share2 class="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  class="w-8 h-8 rounded-full bg-white border border-stone-200 hover:border-stone-300 text-stone-500 inline-flex items-center justify-center transition-colors"
                  @click.stop="editFolder(folder)"
                >
                  <Edit2 class="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  class="w-8 h-8 rounded-full bg-white border border-red-200 hover:bg-red-50 text-red-600 inline-flex items-center justify-center transition-colors"
                  @click.stop="confirmDeleteFolder(folder)"
                >
                  <Trash2 class="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- When inside a folder with no subfolders but also check empty handling: show Buat Subfolder hint -->
      <div v-if="currentFolderId !== null && displayFolders.length === 0" class="mb-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-[11px] tracking-[0.16em] font-semibold uppercase text-stone-500">Subfolder</h2>
          <button
            type="button"
            class="inline-flex items-center gap-1.5 text-[12px] font-medium text-emerald-700 hover:text-emerald-800"
            @click="isCreatingFolder = true"
          >
            <FolderPlus class="w-3.5 h-3.5" /> Buat Subfolder
          </button>
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
        <div
          v-for="item in savedAmalan"
          :key="item.id"
          class="group flex flex-col rounded-[18px] border border-[#e8e6de] bg-white p-6 hover:border-emerald-200 hover:shadow-[0_12px_28px_rgba(16,40,22,0.08)] hover:-translate-y-0.5 transition-all duration-300"
        >
          <div class="flex items-start justify-between gap-4 mb-3">
            <router-link :to="{ name: 'amalan-detail', params: { slug: item.slug } }" class="flex-1 min-w-0 group/link">
              <h3 class="font-serif text-[17px] leading-[1.35] font-semibold tracking-[-0.015em] text-[#12291a] group-hover/link:text-emerald-800 line-clamp-2 transition-colors" style="font-family: 'Fraunces', Georgia, serif">{{ item.judul }}</h3>
              <p v-if="item.ringkasan" class="mt-1.5 text-[13px] leading-[1.6] text-[#5a6d5f] line-clamp-2">{{ item.ringkasan }}</p>
            </router-link>
            <div class="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                class="w-8 h-8 rounded-full bg-white border border-stone-200 hover:border-emerald-200 hover:bg-emerald-50 text-stone-500 hover:text-emerald-700 inline-flex items-center justify-center transition-colors"
                title="Pindahkan ke folder"
                @click="showMoveToFolder(item)"
              >
                <Move class="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                class="w-8 h-8 rounded-full bg-white border border-stone-200 hover:border-red-200 hover:bg-red-50 text-stone-500 hover:text-red-600 inline-flex items-center justify-center transition-colors"
                title="Hapus dari offline"
                @click="removeFromOffline(item)"
              >
                <Trash2 class="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <div class="mt-auto pt-4 border-t border-[#f0ede8] flex items-center justify-between">
            <span class="inline-flex items-center gap-1.5 text-[11px] text-stone-500">
              <Calendar class="w-3 h-3" /> {{ new Date(item.saved_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) }}
            </span>
            <span v-if="item.has_update_available" class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-semibold">
              <RefreshCw class="w-3 h-3" /> Update tersedia
            </span>
            <span v-else class="text-[11px] tracking-[0.08em] uppercase font-medium text-stone-400">Tersimpan</span>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div v-if="allFolders.length === 0 && savedAmalan.length === 0" class="flex flex-col items-center justify-center py-16 md:py-20 text-center">
        <div class="w-[88px] h-[88px] rounded-[22px] bg-white border border-[#e8e6de] shadow-[0_8px_24px_rgba(16,40,22,0.06)] inline-flex items-center justify-center relative">
          <BookHeart class="w-9 h-9 text-emerald-700" :stroke-width="1.6" />
          <span class="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-amber-300 border-2 border-white flex items-center justify-center">
            <Bookmark class="w-3 h-3 text-[#14532d]" />
          </span>
        </div>
        <h2 class="mt-6 font-serif text-[20px] font-semibold tracking-[-0.015em] text-[#12291a]" style="font-family: 'Fraunces', Georgia, serif">Belum ada amalan tersimpan</h2>
        <p class="mt-2 text-[14px] leading-[1.7] text-stone-500 max-w-[42ch] mx-auto text-pretty">
          Jelajahi katalog dan ketuk “Simpan offline” pada halaman detail amalan untuk membacanya kapan saja tanpa koneksi.
        </p>
        <router-link :to="{ name: 'amalan-list' }" class="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-700 text-white text-[13px] font-semibold hover:bg-emerald-800 shadow-sm transition-colors">
          <Library class="w-4 h-4" /> Jelajahi Amalan
        </router-link>
      </div>
    </div>

    <!-- Create/Edit Folder Modal -->
    <div v-if="isCreatingFolder || editingFolderData" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-[#0f2318]/40 backdrop-blur-sm" @click="closeFolderModal"></div>
      <div class="relative bg-white rounded-[20px] shadow-[0_20px_60px_rgba(15,35,20,0.22)] w-full max-w-md overflow-hidden border border-[#e8e6de]">
        <div class="h-1 bg-gradient-to-r from-emerald-700 via-emerald-600 to-amber-300"></div>
        <div class="p-6 sm:p-7">
          <div class="flex items-start justify-between gap-4 mb-5">
            <div>
              <h2 class="font-serif text-[18px] font-semibold text-[#12291a]" style="font-family: 'Fraunces', Georgia, serif">{{ editingFolderData ? 'Edit Folder' : (currentFolderId !== null ? 'Subfolder Baru' : 'Folder Baru') }}</h2>
              <p class="text-[13px] text-stone-500 mt-1">Beri nama yang mudah dikenali.</p>
              <p v-if="!editingFolderData && currentFolder?.name" class="text-[12px] text-emerald-700 mt-1">Di dalam: {{ breadcrumbPath.map(b => b.name).join(' / ') }}</p>
            </div>
            <button type="button" class="w-8 h-8 rounded-full bg-stone-50 border border-stone-200 inline-flex items-center justify-center text-stone-500 hover:bg-stone-100" @click="closeFolderModal">
              <X class="w-4 h-4" />
            </button>
          </div>
          <label class="block text-[12px] font-semibold tracking-[0.08em] uppercase text-stone-600 mb-2">Nama Folder</label>
          <input
            v-model="folderForm.name"
            type="text"
            placeholder="Contoh: Wirid Harian"
            class="w-full px-4 py-3 rounded-xl border border-[#d7ddd7] bg-white text-[14px] text-[#12291a] placeholder:text-stone-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-300 transition-all"
            @keyup.enter="saveFolder"
          />
          <div class="mt-6 flex items-center justify-end gap-3">
            <button type="button" class="px-5 py-2.5 rounded-full bg-white border border-stone-200 text-[13px] font-medium text-stone-700 hover:bg-stone-50" @click="closeFolderModal">Batal</button>
            <button type="button" class="px-6 py-2.5 rounded-full bg-emerald-700 text-white text-[13px] font-semibold hover:bg-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm" :disabled="!folderForm.name.trim()" @click="saveFolder">Simpan</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Move to Folder Modal -->
    <div v-if="movingItem" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-[#0f2318]/40 backdrop-blur-sm" @click="movingItem = null"></div>
      <div class="relative bg-white rounded-[20px] shadow-[0_20px_60px_rgba(15,35,20,0.22)] w-full max-w-md overflow-hidden border border-[#e8e6de]">
        <div class="h-1 bg-gradient-to-r from-emerald-700 via-emerald-600 to-amber-300"></div>
        <div class="p-6 sm:p-7">
          <h2 class="font-serif text-[18px] font-semibold text-[#12291a]" style="font-family: 'Fraunces', Georgia, serif">Pindahkan ke Folder</h2>
          <p class="text-[13px] text-stone-500 mt-1">Pilih tujuan untuk “{{ movingItem.judul }}”</p>
          <div class="mt-5 space-y-2 max-h-64 overflow-auto pr-1 custom-scroll">
            <button
              type="button"
              class="w-full flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all"
              :class="movingItem.folder_id === 0 ? 'border-emerald-300 bg-emerald-50/70' : 'border-stone-200 bg-white hover:border-emerald-200 hover:bg-emerald-50/50'"
              @click="moveToFolder(0)"
            >
              <span class="w-9 h-9 rounded-xl bg-stone-100 border border-stone-200 inline-flex items-center justify-center shrink-0">
                <FolderX class="w-4 h-4 text-stone-500" />
              </span>
              <span class="text-[13.5px] font-medium" :class="movingItem.folder_id === 0 ? 'text-emerald-900' : 'text-stone-700'">Tanpa Folder (Root)</span>
              <Check v-if="movingItem.folder_id === 0" class="w-4 h-4 text-emerald-700 ml-auto" />
            </button>
            <button
              v-for="folder in allFolders"
              :key="folder.id"
              type="button"
              class="w-full flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all"
              :class="movingItem.folder_id === folder.id ? 'border-emerald-300 bg-emerald-50/70' : 'border-stone-200 bg-white hover:border-emerald-200 hover:bg-emerald-50/50'"
              @click="moveToFolder(folder.id!)"
            >
              <span class="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 inline-flex items-center justify-center shrink-0">
                <Folder class="w-4 h-4" />
              </span>
              <span class="text-[13.5px] font-medium" :class="movingItem.folder_id === folder.id ? 'text-emerald-900' : 'text-stone-700'">{{ folder.name }}</span>
              <Check v-if="movingItem.folder_id === folder.id" class="w-4 h-4 text-emerald-700 ml-auto" />
            </button>
          </div>
          <div class="mt-6 flex justify-end">
            <button type="button" class="px-5 py-2.5 rounded-full bg-white border border-stone-200 text-[13px] font-medium text-stone-700 hover:bg-stone-50" @click="movingItem = null">Tutup</button>
          </div>
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

    <!-- Share Modal -->
    <div v-if="sharingData" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-[#0f2318]/40 backdrop-blur-sm" @click="sharingData = null"></div>
      <div class="relative bg-white rounded-[20px] shadow-[0_20px_60px_rgba(15,35,20,0.22)] w-full max-w-lg overflow-hidden border border-[#e8e6de]">
        <div class="h-1 bg-gradient-to-r from-emerald-700 via-emerald-600 to-amber-300"></div>
        <div class="p-6 sm:p-8">
          <div v-if="!shareResult">
            <div class="flex items-start justify-between gap-4">
              <div>
                <h2 class="font-serif text-[18px] font-semibold text-[#12291a]" style="font-family: 'Fraunces', Georgia, serif">Bagikan Koleksi</h2>
                <p class="text-[13px] text-stone-500 mt-1 max-w-[36ch]">
                  {{ sharingData.folder ? `Bagikan folder '${sharingData.folder.name}' beserta seluruh isinya.` : 'Bagikan seluruh koleksi amalan offline Anda.' }}
                </p>
              </div>
              <button type="button" class="w-8 h-8 rounded-full bg-stone-50 border border-stone-200 inline-flex items-center justify-center text-stone-500 hover:bg-stone-100" @click="sharingData = null">
                <X class="w-4 h-4" />
              </button>
            </div>
            <div class="mt-6 space-y-4">
              <div>
                <label class="block text-[12px] font-semibold tracking-[0.08em] uppercase text-stone-600 mb-2">Judul Koleksi</label>
                <input v-model="shareForm.title" type="text" class="w-full px-4 py-3 rounded-xl border border-[#d7ddd7] bg-white text-[14px] focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-300 placeholder:text-stone-400" placeholder="Koleksi Wirid Saya" />
              </div>
              <div>
                <label class="block text-[12px] font-semibold tracking-[0.08em] uppercase text-stone-600 mb-2">Deskripsi (Opsional)</label>
                <textarea v-model="shareForm.description" class="w-full px-4 py-3 rounded-xl border border-[#d7ddd7] bg-white text-[14px] focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-300 placeholder:text-stone-400" rows="3" placeholder="Kumpulan doa dan wirid pilihan…"></textarea>
              </div>
            </div>
            <div class="mt-6 flex items-center gap-3 justify-end">
              <button type="button" class="px-5 py-2.5 rounded-full bg-white border border-stone-200 text-[13px] font-medium text-stone-700 hover:bg-stone-50" @click="sharingData = null">Batal</button>
              <button type="button" class="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-700 text-white text-[13px] font-semibold hover:bg-emerald-800 disabled:opacity-50 shadow-sm" :disabled="!shareForm.title.trim() || generatingShare" @click="generateShare">
                <Share2 v-if="!generatingShare" class="w-4 h-4" />
                <span v-else class="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></span>
                <span>{{ generatingShare ? 'Memproses…' : 'Buat Link Share' }}</span>
              </button>
            </div>
          </div>
          <div v-else class="text-center">
            <div class="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 inline-flex items-center justify-center mx-auto mb-4">
              <CheckCircle class="w-8 h-8" />
            </div>
            <h2 class="font-serif text-[18px] font-semibold text-[#12291a]" style="font-family: 'Fraunces', Georgia, serif">Link share berhasil dibuat!</h2>
            <p class="text-[13px] text-stone-500 mt-1">Salin tautan di bawah ini dan bagikan.</p>
            <div class="mt-6 flex items-center gap-2 p-2 bg-stone-50 rounded-xl border border-stone-200">
              <input readonly :value="shareResult.share_url" class="bg-transparent border-none focus:ring-0 flex-1 px-3 text-[13px] text-stone-700 truncate" />
              <button type="button" class="w-10 h-10 rounded-xl bg-emerald-700 text-white inline-flex items-center justify-center hover:bg-emerald-800 shrink-0" @click="copyShareLink">
                <Copy class="w-4 h-4" />
              </button>
            </div>
            <button type="button" class="mt-6 w-full px-5 py-2.5 rounded-full bg-white border border-stone-200 text-[13px] font-medium text-stone-700 hover:bg-stone-50" @click="sharingData = null">Tutup</button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { db, type LocalSavedAmalan, type LocalFolder, ensureDbReady, isIndexedDBAvailable } from '@/utils/localDb'
import {
  Folder,
  FolderPlus,
  FolderX,
  Edit2,
  Trash2,
  Move,
  RefreshCw,
  BookHeart,
  BookMarked,
  Bookmark,
  Share2,
  ChevronRight,
  Copy,
  CheckCircle,
  Check,
  X,
  ArrowLeft,
  Calendar,
  Library,
} from 'lucide-vue-next'
import { useToast } from '@/composables/useToast'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
import { createShareBundle } from '@/services/shareService'

const toast = useToast()

const allFolders = ref<LocalFolder[]>([])
const savedAmalan = ref<LocalSavedAmalan[]>([])
const currentFolderId = ref<number | null>(null)

const currentFolder = computed<LocalFolder | null>(() => {
  if (currentFolderId.value == null) return null
  return allFolders.value.find((f) => f.id === currentFolderId.value) ?? null
})

const displayFolders = computed(() => allFolders.value.filter((f) => (f.parent_id ?? null) === currentFolderId.value))

function buildBreadcrumb(id: number | null): LocalFolder[] {
  if (id == null) return []
  const path: LocalFolder[] = []
  let curId: number | null = id
  const visited = new Set<number>()
  while (curId != null && !visited.has(curId)) {
    visited.add(curId)
    const folder = allFolders.value.find((f) => f.id === curId)
    if (!folder) break
    path.unshift(folder)
    curId = folder.parent_id ?? null
  }
  return path
}

const breadcrumbPath = computed(() => buildBreadcrumb(currentFolderId.value))

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
    // collect all descendant folder ids recursively
    const all = await db.folders.toArray()
    const toDeleteIds = new Set<number>()
    toDeleteIds.add(targetId)
    let changed = true
    while (changed) {
      changed = false
      for (const f of all) {
        const pid = f.parent_id ?? null
        if (pid != null && toDeleteIds.has(pid) && f.id != null && !toDeleteIds.has(f.id)) {
          toDeleteIds.add(f.id)
          changed = true
        }
      }
    }
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

function goToBreadcrumb(folder: LocalFolder) {
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

// Item Logic
const movingItem = ref<LocalSavedAmalan | null>(null)

function showMoveToFolder(item: LocalSavedAmalan) {
  movingItem.value = item
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
const shareResult = ref<{ share_url: string } | null>(null)

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
        const plainLyrics = rawLyrics
          ? JSON.parse(
              JSON.stringify(
                rawLyrics.map((r: any) => ({
                  arab: String(r?.arab ?? ''),
                  latin: r?.latin == null ? null : String(r.latin),
                })),
              ),
            )
          : []

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

    shareResult.value = await createShareBundle(plainPayload as any)
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
  navigator.clipboard.writeText(shareResult.value.share_url)
  toast.success('Link berhasil disalin!')
}
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
