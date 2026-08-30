<template>
  <div
    class="amalan-paper"
    :class="{ 'dark-paper': dark }"
    :style="paperStyle as any"
  >
    <div
      class="amalan-paper__texture"
      aria-hidden="true"
    ></div>
    <div
      class="amalan-paper__inner-border"
      aria-hidden="true"
    ></div>

    <div class="amalan-paper__content">
      <slot name="header" />
      <slot />
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    dark?: boolean
    fontSize?: number
  }>(),
  {
    dark: false,
    fontSize: undefined,
  },
)

const paperStyle = computed(() => {
  if (props.fontSize == null) return undefined
  return {
    '--arab': props.fontSize + 'px',
    '--latin': Math.round(props.fontSize * 0.58) + 'px',
  } as Record<string, string>
})
</script>

<style scoped>
/* ── Paper card ── */
.amalan-paper {
  position: relative;
  background: #fdfcf8;
  border: 1px solid #e8e6de;
  border-radius: 20px;
  box-shadow:
    0 1px 2px rgba(31, 33, 26, 0.04),
    0 8px 24px rgba(31, 33, 26, 0.06),
    0 1px 0 rgba(255, 255, 255, 0.9) inset;
  overflow: hidden;
  transition:
    background-color 260ms ease,
    border-color 260ms ease,
    box-shadow 260ms ease;
}
.amalan-paper__texture {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.028;
  background-image:
    radial-gradient(circle at 1px 1px, #8a7a5a 1.2px, transparent 0),
    radial-gradient(circle at 1px 1px, #c2b59b 0.9px, transparent 0);
  background-size:
    22px 22px,
    22px 22px;
  background-position:
    0 0,
    11px 11px;
  transition: opacity 260ms ease;
}
.amalan-paper__inner-border {
  position: absolute;
  inset: 10px;
  border: 1.35px dotted #e6ddd0;
  border-radius: 14px;
  pointer-events: none;
  transition: border-color 260ms ease;
}
.amalan-paper__content {
  position: relative;
  padding: 28px 20px 26px;
}
@media (min-width: 640px) {
  .amalan-paper__content {
    padding: 40px 40px 36px;
  }
}
@media (min-width: 768px) {
  .amalan-paper__content {
    padding: 44px 48px 40px;
  }
}

/* ── Dark paper ── */
.amalan-paper.dark-paper {
  background: #1a2420;
  border-color: #2a3a32;
  box-shadow:
    0 1px 2px rgba(0, 0, 0, 0.14),
    0 12px 32px rgba(0, 0, 0, 0.22),
    0 1px 0 rgba(255, 255, 255, 0.04) inset;
}
.amalan-paper.dark-paper .amalan-paper__inner-border {
  border-color: rgba(232, 230, 222, 0.1);
}
.amalan-paper.dark-paper .amalan-paper__texture {
  opacity: 0.045;
}
.amalan-paper.dark-paper :deep(.title-ar),
.amalan-paper.dark-paper :deep(.lyric-arab) {
  color: #e8e6d8;
}
.amalan-paper.dark-paper :deep(.title-latin),
.amalan-paper.dark-paper :deep(.lyric-latin) {
  color: #9bb0a5;
}
.amalan-paper.dark-paper :deep(.lyric-title-ornament span:first-child),
.amalan-paper.dark-paper :deep(.lyric-title-ornament span:last-child) {
  background: #2a3a32 !important;
}
.amalan-paper.dark-paper :deep(.lyric-title-ornament span:nth-child(2)) {
  background: rgba(52, 211, 153, 0.85) !important;
  box-shadow: 0 0 0 4px #1a2420 !important;
}
.amalan-paper.dark-paper :deep(.lyric-row:hover) {
  background: rgba(255, 255, 255, 0.04);
}
.amalan-paper.dark-paper :deep(.bullet) {
  color: #34d399;
  opacity: 0.65;
}
.amalan-paper.dark-paper :deep(.bullet--latin) {
  color: #9bb0a5;
  opacity: 0.5;
}
</style>
