<template>
  <div class="overflow-x-auto rounded-lg border border-green-100 shadow-sm">
    <table class="w-full bg-white">
      <thead class="bg-primary-50 border-b border-green-100">
        <tr>
          <th class="text-left px-6 py-3 text-body-sm font-semibold text-text-primary">Judul</th>
          <th class="text-left px-6 py-3 text-body-sm font-semibold text-text-primary">Slug</th>
          <th class="text-left px-6 py-3 text-body-sm font-semibold text-text-primary">Kategori</th>
          <th class="text-center px-6 py-3 text-body-sm font-semibold text-text-primary">Status</th>
          <th class="text-right px-6 py-3 text-body-sm font-semibold text-text-primary">Aksi</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-green-100">
        <tr
          v-for="item in items"
          :key="item.id"
          class="hover:bg-primary-50/50 transition-colors duration-150"
        >
          <td class="px-6 py-4 text-body-sm text-text-primary font-medium">{{ item.judul }}</td>
          <td class="px-6 py-4 text-body-sm text-text-secondary">{{ item.slug }}</td>
          <td class="px-6 py-4 text-body-sm text-text-secondary">{{ item.kategori || '-' }}</td>
          <td class="px-6 py-4 text-center">
            <label class="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                :checked="item.aktif"
                @change="$emit('toggle', item)"
                class="w-4 h-4 rounded text-primary-600"
              />
              <span
                class="text-body-sm"
                :class="item.aktif ? 'text-text-success' : 'text-text-muted'"
                >{{ item.aktif ? 'Aktif' : 'Non-aktif' }}</span
              >
            </label>
          </td>
          <td class="px-6 py-4 text-right">
            <div class="flex justify-end gap-2">
              <router-link
                :to="{ name: 'admin-amalan-edit', params: { id: item.id } }"
                class="px-3 py-1.5 rounded text-body-sm font-medium bg-primary-100 text-primary-700 hover:bg-primary-200 transition-all duration-200"
                >Edit</router-link
              >
              <button
                @click="$emit('delete', item)"
                class="px-3 py-1.5 rounded text-body-sm font-medium bg-red-100 text-red-700 hover:bg-red-200 transition-all duration-200"
              >
                Hapus
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import type { Amalan } from '@/services/amalanService'

defineProps<{ items: Amalan[] }>()
defineEmits<{ (e: 'toggle', item: Amalan): void; (e: 'delete', item: Amalan): void }>()
</script>
