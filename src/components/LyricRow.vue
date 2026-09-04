<template>
  <div
    class="lyric-row"
    :class="{ 'lyric-row--toggleable': toggleable, 'lyric-row--checked': checked }"
    :style="rowStyle as any"
    @click="onRowClick"
  >
    <!-- Arab: always center, if • then 2 cols center with bullet -->
    <div
      class="lyric-arab"
      dir="rtl"
      lang="ar"
    >
      <template v-if="hasArabBullet">
        <div class="lyric-split">
          <span class="arab-cell">{{ arabParts[0] }}</span>
          <span
            class="bullet"
            aria-hidden="true"
          >•</span>
          <span class="arab-cell">{{ arabParts[1] }}</span>
        </div>
      </template>
      <template v-else>
        <span class="arab-single">{{ row.arab }}</span>
      </template>
    </div>

    <!-- Latin: below Arab, also split if •, hide via showLatin -->
    <div
      v-if="row.latin && showLatin"
      class="lyric-latin"
    >
      <template v-if="hasLatinBullet">
        <div class="lyric-split lyric-split--latin">
          <span class="latin-cell">{{ latinParts[0] }}</span>
          <span
            class="bullet bullet--latin"
            aria-hidden="true"
          >•</span>
          <span class="latin-cell">{{ latinParts[1] }}</span>
        </div>
      </template>
      <template v-else>
        <span class="latin-single">{{ row.latin }}</span>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { LyricRow as LyricRowType } from '@/utils/lyric'

const props = withDefaults(
  defineProps<{
    row: LyricRowType
    showLatin: boolean
    fontSize?: number
    /** render in "checked" (hafalan selesai) state — reduced opacity + strike on latin */
    checked?: boolean
    /** enable tap-to-toggle affordance (emits `toggle` on click); default keeps rendering identical */
    toggleable?: boolean
  }>(),
  {
    fontSize: undefined,
    checked: false,
    toggleable: false,
  },
)

const emit = defineEmits<{
  (e: 'toggle'): void
}>()

function onRowClick() {
  if (props.toggleable) emit('toggle')
}

function splitBullet(text: string): [string, string] {
  const parts = text.split('•').map((s) => s.trim())
  if (parts.length > 2) {
    const mid = Math.floor(parts.length / 2)
    return [parts.slice(0, mid).join(' • '), parts.slice(mid).join(' • ')]
  }
  return [parts[0] || '', parts[1] || '']
}

const hasArabBullet = computed(() => !!props.row.arab && props.row.arab.includes('•'))
const hasLatinBullet = computed(() => !!props.row.latin && props.row.latin.includes('•'))

const arabParts = computed<[string, string]>(() => splitBullet(props.row.arab))
const latinParts = computed<[string, string]>(() => (props.row.latin ? splitBullet(props.row.latin) : ['', '']))

const rowStyle = computed(() => {
  if (props.fontSize == null) return {}
  return {
    '--arab': props.fontSize + 'px',
    '--latin': Math.round(props.fontSize * 0.58) + 'px',
  } as Record<string, string>
})
</script>

<style scoped>
.lyric-row {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 14px 10px 12px;
  border-radius: 12px;
  transition: background-color 180ms ease;
  text-align: center;
}
.lyric-row:hover {
  background: rgba(232, 230, 222, 0.22);
}
@media (min-width: 640px) {
  .lyric-row {
    padding: 14px 16px 12px;
  }
}

/* Arab: uses CSS var --arab (18-36px), rtl, center */
.lyric-arab {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-family: 'Amiri', serif;
  font-size: var(--arab, 24px);
  line-height: 1.95;
  color: #0f2318;
  font-weight: 400;
  direction: rtl;
  transition:
    font-size 180ms ease,
    color 260ms ease;
}
.arab-single {
  display: block;
  width: 100%;
  text-align: center;
}
.lyric-split {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 18px;
  width: 100%;
  text-align: center;
}
@media (min-width: 640px) {
  .lyric-split {
    gap: 28px;
  }
}
.arab-cell {
  flex: 1;
  text-align: center;
  font-family: 'Amiri', serif;
}
.arab-cell:first-child {
  text-align: center;
}
.arab-cell:last-child {
  text-align: center;
}
.bullet {
  flex-shrink: 0;
  color: #15803d;
  opacity: 0.55;
  font-size: 1.1rem;
  line-height: 1;
  user-select: none;
  transition: color 260ms ease;
}

/* Latin: uses CSS var --latin (58% of --arab), DM Sans italic muted, center */
.lyric-latin {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-family: 'DM Sans', ui-sans-serif, system-ui, sans-serif;
  font-size: var(--latin, 14px);
  line-height: 1.65;
  font-style: italic;
  font-weight: 400;
  color: #6e7d71;
  letter-spacing: 0.006em;
  margin-top: 2px;
  transition:
    font-size 180ms ease,
    color 260ms ease;
}
.latin-single {
  display: block;
  width: 100%;
  text-align: center;
}
.lyric-split--latin {
  gap: 14px;
}
@media (min-width: 640px) {
  .lyric-split--latin {
    gap: 22px;
  }
}
.latin-cell {
  flex: 1;
  text-align: center;
  font-family: 'DM Sans', sans-serif;
  font-style: italic;
}
.bullet--latin {
  color: #6e7d71;
  opacity: 0.45;
  font-size: 0.9rem;
}

/* when Latin hidden, tighten rhythm - handled via v-if, but keep transition */
.lyric-row:has(.lyric-latin) {
  gap: 6px;
}

/* hafalan progress: toggleable row + checked state (minimal — no layout change) */
.lyric-row--toggleable {
  cursor: pointer;
}
.lyric-row--checked {
  opacity: 0.5;
  transition:
    background-color 180ms ease,
    opacity 180ms ease;
}
.lyric-row--checked .lyric-latin,
.lyric-row--checked .latin-single,
.lyric-row--checked .latin-cell {
  text-decoration: line-through;
  text-decoration-thickness: 1px;
  text-decoration-color: rgba(110, 125, 113, 0.6);
}
</style>
