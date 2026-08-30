<template>
  <article
    class="group relative flex flex-col rounded-[18px] border bg-white p-6 md:p-7 transition-all duration-300 hover:-translate-y-1 will-change-transform"
    :class="[
      isHighlighted
        ? 'border-emerald-100 shadow-[0_1px_2px_rgba(16,40,22,0.06)] hover:shadow-[0_16px_40px_-16px_rgba(16,40,22,0.16)]'
        : 'border-[#e8e6de] shadow-sm hover:border-emerald-200 hover:shadow-[0_16px_40px_-16px_rgba(16,40,22,0.16)]',
    ]"
    :style="animationStyle"
  >
    <!-- hover accent -->
    <div
      class="absolute top-0 left-7 right-7 h-px bg-gradient-to-r from-transparent via-emerald-200/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
    ></div>

    <!-- saved bookmark corner indicator -->
    <div
      v-if="saved"
      class="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-amber-300 border-2 border-white shadow-sm inline-flex items-center justify-center text-[#14532d]"
      title="Tersimpan"
    >
      <Bookmark class="w-3.5 h-3.5" :stroke-width="2" />
    </div>

    <!-- Top row: categories + badge/actions -->
    <div class="flex items-start justify-between gap-3 mb-3.5">
      <!-- categories pills -->
      <div class="flex flex-wrap gap-1.5 min-w-0">
        <span
          v-for="cat in categoriesList"
          :key="cat.id"
          class="inline-flex items-center px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-[11px] font-semibold tracking-[0.08em] uppercase text-emerald-800"
          >{{ cat.nama }}</span
        >
        <!-- placeholder only for list mode -->
        <span
          v-if="!categoriesList.length && mode === 'list'"
          class="inline-flex items-center px-2.5 py-1 rounded-full bg-stone-50 border border-stone-200 text-[11px] font-medium tracking-wide text-stone-500 uppercase"
          >Tanpa kategori</span
        >
      </div>

      <!-- right side: number badge or offline actions -->
      <div class="flex items-center gap-1.5 shrink-0">
        <!-- slot allows parent to override actions (e.g. Move/Delete in offline) -->
        <slot name="actions">
          <span
            v-if="showUrutanBadge"
            class="inline-flex items-center justify-center w-8 h-8 rounded-full border bg-stone-50 text-[11px] font-bold tracking-wide transition-colors"
            :class="isHighlighted ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-stone-200 text-stone-600 group-hover:border-emerald-200 group-hover:bg-emerald-50 group-hover:text-emerald-800'"
            >{{ String(normalizedUrutan).padStart(2, '0') }}</span
          >
        </slot>
        <!-- when offline with custom actions and urutan present, also show badge alongside -->
        <span
          v-if="mode === 'offline' && showUrutanBadge && hasActionsSlot"
          class="inline-flex items-center justify-center w-8 h-8 rounded-full border bg-stone-50 text-[11px] font-bold tracking-wide border-stone-200 text-stone-600"
          >{{ String(normalizedUrutan).padStart(2, '0') }}</span
        >
      </div>
    </div>

    <!-- Title -->
    <h2
      v-if="mode === 'list'"
      class="font-serif text-[20px] md:text-[21px] leading-[1.32] font-[600] tracking-[-0.015em] text-[#13291b] group-hover:text-emerald-900 transition-colors line-clamp-2 text-pretty"
      style="font-family: 'Fraunces', Georgia, serif"
    >
      {{ item.judul }}
    </h2>
    <h3
      v-else
      class="font-serif text-[17px] leading-[1.35] font-semibold tracking-[-0.015em] text-[#12291a] line-clamp-2 text-pretty transition-colors"
      style="font-family: 'Fraunces', Georgia, serif"
    >
      <RouterLink
        v-if="slug"
        :to="{ name: 'amalan-detail', params: { slug } }"
        class="hover:text-emerald-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/30 rounded"
      >
        {{ item.judul }}
      </RouterLink>
      <span v-else>{{ item.judul }}</span>
    </h3>

    <!-- Excerpt -->
    <p
      v-if="item.ringkasan"
      class="mt-2.5 text-[13.5px] leading-[1.72] text-[#5a6d5f] text-pretty"
      :class="mode === 'list' ? 'line-clamp-3' : 'line-clamp-2'"
    >
      {{ item.ringkasan }}
    </p>
    <p v-else-if="mode === 'list'" class="mt-2.5 text-[13px] leading-[1.6] text-stone-400 italic">Ringkasan belum tersedia.</p>
    <p v-else-if="mode === 'offline'" class="mt-1.5 text-[13px] leading-[1.6] text-stone-400 italic">Ringkasan belum tersedia.</p>

    <!-- offline extra slot content (e.g. custom actions row) inserted before footer if provided -->
    <slot />

    <!-- Footer -->
    <div class="mt-auto pt-5">
      <!-- list mode footer -->
      <template v-if="mode === 'list'">
        <div class="h-px bg-[#f0ede8] group-hover:bg-emerald-50 transition-colors"></div>
        <RouterLink
          v-if="slug"
          :to="{ name: 'amalan-detail', params: { slug } }"
          class="mt-4 flex items-center justify-between group/link focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/30 rounded-lg -mx-1 px-1 py-1"
        >
          <span class="inline-flex items-center gap-2 text-[13px] font-semibold text-emerald-800">
            Baca amalan
            <span
              class="inline-flex w-6 h-6 rounded-full bg-emerald-50 border border-emerald-100 items-center justify-center text-emerald-700 group-hover/link:bg-emerald-700 group-hover/link:text-white group-hover/link:border-emerald-700 transition-all duration-200"
            >
              <ArrowRight class="w-3.5 h-3.5 transition-transform duration-200 group-hover/link:translate-x-0.5" />
            </span>
          </span>
          <span class="text-[11px] tracking-[0.08em] uppercase font-medium text-stone-400 group-hover/link:text-stone-600 transition-colors"
            >Lihat detail</span
          >
        </RouterLink>
        <div v-else class="mt-4 flex items-center justify-between">
          <span class="text-[13px] font-semibold text-stone-400">Tanpa tautan</span>
        </div>
      </template>

      <!-- offline mode footer -->
      <template v-else>
        <div class="h-px bg-[#f0ede8] group-hover:bg-emerald-50 transition-colors mb-4"></div>
        <div class="flex items-center justify-between gap-2">
          <span
            v-if="savedAtFormatted"
            class="inline-flex items-center gap-1.5 text-[11px] text-stone-500"
          >
            <Calendar class="w-3 h-3" /> {{ savedAtFormatted }}
          </span>
          <span v-else class="inline-flex items-center gap-1.5 text-[11px] text-stone-400">
            <Bookmark class="w-3 h-3" /> Offline
          </span>

          <span
            v-if="hasUpdate"
            class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-semibold"
          >
            <RefreshCw class="w-3 h-3" /> Update tersedia
          </span>
          <span v-else class="text-[11px] tracking-[0.08em] uppercase font-medium text-stone-400">Tersimpan</span>
        </div>
        <!-- actions footer slot for offline extra buttons (move/delete) if not in top row -->
        <div v-if="$slots.footer" class="mt-3">
          <slot name="footer" />
        </div>
      </template>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue'
import { ArrowRight, Bookmark, Calendar, RefreshCw } from 'lucide-vue-next'

type CategoryLite = { id: string; nama: string }

type CardItem = {
  id?: string | number
  judul: string
  ringkasan?: string | null
  slug: string
  amalan_id?: string
  urutan?: number | null
  categories?: CategoryLite[]
  kategori?: string | null
  // offline extras
  saved_at?: number
  has_update_available?: boolean
  hasUpdateAvailable?: boolean
  // allow any other
  [k: string]: unknown
}

const props = withDefaults(
  defineProps<{
    item: CardItem
    index?: number
    mode?: 'list' | 'offline'
    showNumber?: boolean
    saved?: boolean
  }>(),
  {
    index: undefined,
    mode: 'list',
    showNumber: undefined,
    saved: false,
  },
)

defineSlots<{
  default?: () => unknown
  actions?: () => unknown
  footer?: () => unknown
}>()

// emit for offline actions (optional, parent may use slots instead)
defineEmits<{
  click: [item: CardItem]
  move: [item: CardItem]
  remove: [item: CardItem]
}>()

const slots = useSlots()

const isHighlighted = computed(() => props.index != null && props.index % 5 === 0)

const animationStyle = computed(() => {
  if (props.index == null) return undefined
  return { animationDelay: `${props.index * 45}ms`, animation: 'cardIn 0.5s ease both' } as Record<string, string>
})

const categoriesList = computed<CategoryLite[]>(() => {
  if (Array.isArray(props.item.categories) && props.item.categories.length) return props.item.categories as CategoryLite[]
  const k = props.item.kategori as string | undefined
  if (k) return [{ id: k, nama: k }]
  // also support category / kategori_ids fallback? ignore
  return []
})

const normalizedUrutan = computed(() => (props.item.urutan as number | null | undefined) ?? null)

const showUrutanBadge = computed(() => {
  if (props.showNumber === false) return false
  if (props.showNumber === true) return normalizedUrutan.value != null
  // default: show when urutan exists and (mode list or offline with no actions slot overriding)
  return normalizedUrutan.value != null
})

const hasActionsSlot = computed(() => !!slots.actions)

const slug = computed(() => (props.item.slug as string) || (props.item.amalan_id as string) || '')

const savedAtFormatted = computed(() => {
  const v = props.item.saved_at as number | undefined
  if (!v) return ''
  try {
    return new Date(v).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
  } catch {
    return ''
  }
})

const hasUpdate = computed(() => {
  const v = (props.item.has_update_available ?? (props.item as unknown as { hasUpdateAvailable?: boolean }).hasUpdateAvailable) as boolean | undefined
  return !!v
})
</script>

<style scoped>
@keyframes cardIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@media (prefers-reduced-motion: reduce) {
  article {
    animation: none !important;
  }
  .group {
    transition: none !important;
  }
}
</style>
