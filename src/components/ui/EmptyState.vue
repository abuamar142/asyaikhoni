<template>
  <div class="flex flex-col items-center text-center">
    <!-- Icon container: canonical 88px rounded-[22px] + optional amber dot -->
    <div
      class="relative mx-auto inline-flex h-[88px] w-[88px] items-center justify-center rounded-[22px] bg-white shadow-[0_8px_24px_rgba(20,40,20,0.06)] border"
      :class="props.variant === 'amber' ? 'border-amber-200' : 'border-[#e8e6de]'"
    >
      <!-- custom icon composition (e.g. BookHeart + amber badge) -->
      <slot name="icon">
        <component
          :is="props.icon ?? FallbackIcon"
          class="h-9 w-9"
          :class="props.iconClass"
          :stroke-width="1.6"
        />
      </slot>

      <!-- canonical amber dot decoration — only when variant amber and no custom icon slot override that already includes badge -->
      <span
        v-if="props.variant === 'amber' && !$slots.icon"
        class="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-amber-300 shadow-sm"
        aria-hidden="true"
      >
        <span class="h-2 w-2 rounded-full bg-white/80"></span>
      </span>
    </div>

    <h3
      class="mt-6 font-serif text-[22px] font-semibold tracking-[-0.015em] text-[#12291a] text-balance leading-[1.3] py-0.5 overflow-visible"
      style="font-family: 'Fraunces', Georgia, serif"
    >
      {{ props.title }}
    </h3>

    <p
      v-if="props.description"
      class="mt-2 max-w-[42ch] text-pretty text-[14px] leading-[1.7] text-stone-500"
    >
      {{ props.description }}
    </p>

    <div
      v-if="$slots.actions || $slots.default"
      class="mt-6 flex flex-wrap items-center justify-center gap-3"
    >
      <slot name="actions">
        <slot />
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue'
import { FileX } from 'lucide-vue-next'

const props = withDefaults(
  defineProps<{
    icon?: Component
    title: string
    description?: string
    variant?: 'default' | 'amber'
    iconClass?: string
  }>(),
  {
    icon: undefined,
    description: undefined,
    variant: 'default',
    iconClass: 'text-stone-400',
  },
)

// default icon when none provided — neutral file placeholder
const FallbackIcon = FileX
</script>
