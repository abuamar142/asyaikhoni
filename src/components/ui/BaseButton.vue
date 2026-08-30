<template>
  <component
    :is="as"
    :type="as === 'button' ? type : undefined"
    :disabled="disabled"
    :class="[
      'inline-flex items-center justify-center gap-2 font-semibold leading-none whitespace-nowrap shrink-0 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 border [&_svg]:shrink-0',
      roundedClass,
      sizeClasses,
      block ? 'w-full' : '',
      variantClasses,
      disabled ? 'opacity-80 cursor-not-allowed' : 'hover:-translate-y-0.5',
      customClass,
    ]"
    v-bind="$attrs"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    as?: 'button' | 'a' | 'router-link'
    type?: 'button' | 'submit' | 'reset'
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'warning'
    size?: 'sm' | 'md' | 'lg'
    block?: boolean
    disabled?: boolean
    pill?: boolean
    class?: string
  }>(),
  {
    as: 'button',
    type: 'button',
    variant: 'primary',
    size: 'md',
    block: false,
    disabled: false,
    pill: false,
    class: '',
  },
)

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'secondary':
      return 'bg-white text-stone-700 border border-[#e7e5e0] hover:border-emerald-200 hover:bg-emerald-50 focus-visible:ring-emerald-600/20 shadow-sm'
    case 'ghost':
      return 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50 focus-visible:ring-stone-300 shadow-sm'
    case 'danger':
      return 'bg-[#ef4444] text-white shadow hover:bg-[#dc2626] focus-visible:ring-[#ef4444] border border-transparent'
    case 'warning':
      return 'bg-amber-300 text-[#14532d] border border-amber-300 hover:bg-amber-200 focus-visible:ring-amber-400 shadow-sm'
    case 'primary':
    default:
      return 'bg-emerald-700 text-white border border-emerald-700 shadow-sm hover:bg-emerald-800 focus-visible:ring-emerald-700'
  }
})

const roundedClass = computed(() => (props.pill ? 'rounded-full' : 'rounded-lg'))

const sizeClasses = computed(() => {
  const cls = props.class || ''
  // If caller provides explicit dimensions (icon squares w-8 h-8 !p-0, or h-11 etc),
  // skip the fixed pill height so custom dimensions win. This keeps the hero
  // pill system (h-10) from fighting square icon buttons.
  const isIconOrCustomH = cls.includes('!p-0') || /\bh-(8|9|10|11|\[)/.test(cls)
  if (isIconOrCustomH) {
    switch (props.size) {
      case 'sm':
        return 'text-[13px] leading-none'
      case 'lg':
        return 'text-sm leading-none'
      case 'md':
      default:
        return 'text-[13px] leading-none'
    }
  }
  switch (props.size) {
    case 'sm':
      return 'h-8 min-h-[32px] px-3.5 text-[13px] leading-none'
    case 'lg':
      return 'h-11 min-h-[44px] px-6 text-sm leading-none'
    case 'md':
    default:
      return 'h-10 min-h-[40px] px-5 text-[13px] leading-none'
  }
})

const customClass = computed(() => props.class)
</script>
