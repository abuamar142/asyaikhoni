<template>
  <div class="space-y-6 bg-white border border-green-100 rounded-lg p-6">
    <div>
      <label for="judul" class="block text-body-sm text-text-primary font-medium mb-2"
        >Judul <span class="text-text-error">*</span></label
      >
      <input
        :model-value="model.judul"
        @input="updateField('judul', ($event.target as HTMLInputElement).value)"
        type="text"
        required
        class="w-full px-4 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
        placeholder="Contoh: Tahlil Pagi"
      />
    </div>
    <div>
      <label for="slug" class="block text-body-sm text-text-primary font-medium mb-2"
        >Slug <span class="text-text-error">*</span></label
      >
      <input
        :model-value="model.slug"
        @input="updateField('slug', ($event.target as HTMLInputElement).value)"
        type="text"
        required
        class="w-full px-4 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
        placeholder="tahlil-pagi"
      />
      <p class="text-caption text-muted mt-2">
        Gunakan huruf kecil, tanpa spasi. Contoh: tahlil, doa-malam
      </p>
    </div>
    <div>
      <label for="ringkasan" class="block text-body-sm text-text-primary font-medium mb-2"
        >Ringkasan</label
      >
      <textarea
        :model-value="model.ringkasan"
        @input="updateField('ringkasan', ($event.target as HTMLTextAreaElement).value)"
        rows="3"
        class="w-full px-4 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
        placeholder="Deskripsi singkat tentang amalan ini..."
      ></textarea>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label for="kategori" class="block text-body-sm text-text-primary font-medium mb-2"
          >Kategori</label
        >
        <input
          :model-value="model.kategori"
          @input="updateField('kategori', ($event.target as HTMLInputElement).value)"
          type="text"
          class="w-full px-4 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          placeholder="Contoh: tahlil, doa"
        />
      </div>
      <div>
        <label for="ikon_url" class="block text-body-sm text-text-primary font-medium mb-2"
          >URL Ikon</label
        >
        <input
          :model-value="model.ikon_url"
          @input="updateField('ikon_url', ($event.target as HTMLInputElement).value)"
          type="text"
          class="w-full px-4 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          placeholder="https://example.com/icon.png"
        />
      </div>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label for="urutan" class="block text-body-sm text-text-primary font-medium mb-2"
          >Urutan</label
        >
        <input
          id="urutan"
          :model-value="model.urutan"
          @input="updateField('urutan', Number(($event.target as HTMLInputElement).value))"
          type="number"
          class="w-full px-4 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          placeholder="1"
        />
      </div>
      <div class="flex items-end">
        <label class="flex items-center gap-3 cursor-pointer">
          <input
            id="aktif"
            :checked="model.aktif"
            @change="updateField('aktif', ($event.target as HTMLInputElement).checked)"
            type="checkbox"
            class="w-4 h-4 rounded text-primary-600"
          />
          <span class="text-body-sm text-text-primary font-medium">Aktif</span>
        </label>
      </div>
    </div>
    <div>
      <label for="mdFile" class="block text-body-sm text-text-primary font-medium mb-2"
        >File Markdown (.md) <span class="text-text-error">*</span></label
      >
      <input
        id="mdFile"
        type="file"
        accept=".md,text/markdown"
        @change="onFileChange"
        class="w-full px-4 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
      />
      <p class="text-caption text-muted mt-2">
        Konten amalan harus dalam format Markdown. File akan disimpan di Storage.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Amalan } from '@/services/amalanService'

defineProps<{ model: Partial<Amalan> & { mdFile?: File } }>()
const emit = defineEmits<{
  (e: 'update:model', value: Partial<Amalan> & { mdFile?: File }): void
  (e: 'file', file: File): void
}>()

function updateField<K extends keyof (Partial<Amalan> & { mdFile?: File })>(
  field: K,
  value: (Partial<Amalan> & { mdFile?: File })[K]
) {
  emit('update:model', { [field]: value } as Partial<Amalan> & { mdFile?: File })
}

function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  const file = (input.files && input.files[0]) || undefined
  if (file) emit('file', file)
}
</script>
