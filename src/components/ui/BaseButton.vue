<template>
  <component
    :is="as"
    :type="as === 'button' ? type : undefined"
    :disabled="disabled"
    :class="[
      'inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
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
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
    size?: 'sm' | 'md' | 'lg'
    block?: boolean
    disabled?: boolean
    class?: string
  }>(),
  {
    as: 'button',
    type: 'button',
    variant: 'primary',
    size: 'md',
    block: false,
    disabled: false,
    class: '',
  },
)

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'secondary':
      return 'bg-[#fde047] text-primary shadow hover:bg-[#facc15] focus-visible:ring-[#facc15]'
    case 'ghost':
      return 'border border-[#d1d5db] text-primary hover:bg-[#ecfdf3] focus-visible:ring-[#15803d]'
    case 'danger':
      return 'bg-[#ef4444] text-white shadow hover:bg-[#dc2626] focus-visible:ring-[#ef4444]'
    case 'primary':
    default:
      return 'bg-[#15803d] text-white shadow hover:bg-[#166534] focus-visible:ring-[#22c55e]'
  }
})

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'px-3 py-1.5 text-sm'
    case 'lg':
      return 'px-5 py-3 text-base'
    case 'md':
    default:
      return 'px-4 py-2 text-sm'
  }
})

const customClass = computed(() => props.class)
</script>
