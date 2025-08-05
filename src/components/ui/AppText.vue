<template>
  <component :is="tag" :class="textClasses">
    <slot />
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?:
    | 'display-lg'
    | 'display-md'
    | 'display-sm'
    | 'heading-xl'
    | 'heading-lg'
    | 'heading-md'
    | 'heading-sm'
    | 'body-lg'
    | 'body-md'
    | 'body-sm'
    | 'caption'
    | 'arabic-lg'
    | 'arabic-md'
  color?:
    | 'primary'
    | 'secondary'
    | 'muted'
    | 'light'
    | 'white'
    | 'brand'
    | 'accent'
    | 'success'
    | 'warning'
    | 'error'
    | 'on-dark'
    | 'on-dark-muted'
    | 'on-dark-light'
    | 'on-dark-brand'
    | 'on-dark-accent'
  tag?: string
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold'
  align?: 'left' | 'center' | 'right'
  theme?: 'light' | 'dark'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'body-md',
  color: undefined,
  tag: undefined,
  weight: undefined,
  align: 'left',
  theme: 'light',
})

const textClasses = computed(() => {
  // Use dark variant if theme is dark
  const variantSuffix = props.theme === 'dark' ? '-dark' : ''
  const baseVariant =
    props.variant === 'arabic-lg' || props.variant === 'arabic-md'
      ? props.variant
      : `${props.variant}${variantSuffix}`

  const classes = [`text-${baseVariant}`]

  // Add color class if specified
  if (props.color) {
    if (props.color === 'primary') {
      classes.push(props.theme === 'dark' ? 'text-on-dark' : 'text-text-primary')
    } else if (props.color === 'secondary') {
      classes.push(props.theme === 'dark' ? 'text-on-dark-muted' : 'text-text-secondary')
    } else if (props.color === 'muted') {
      classes.push(props.theme === 'dark' ? 'text-on-dark-muted' : 'text-muted')
    } else if (props.color === 'accent') {
      // Special handling for accent color on dark backgrounds
      classes.push(props.theme === 'dark' ? 'text-yellow-200' : 'text-accent')
    } else if (props.color.startsWith('on-dark')) {
      classes.push(`text-${props.color}`)
    } else {
      classes.push(`text-${props.color}`)
    }
  } else {
    // Default colors for arabic text when no color is specified
    if (
      (props.variant === 'arabic-lg' || props.variant === 'arabic-md') &&
      props.theme === 'dark'
    ) {
      classes.push('text-yellow-200')
    }
  }

  // Add weight class if specified
  if (props.weight) {
    const weightMap = {
      light: 'font-light',
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
    }
    classes.push(weightMap[props.weight])
  }

  // Add alignment
  if (props.align !== 'left') {
    classes.push(`text-${props.align}`)
  }

  return classes.join(' ')
})

// Auto-determine tag based on variant if not specified
const tag = computed(() => {
  if (props.tag) return props.tag

  const variantTagMap: Record<string, string> = {
    'display-lg': 'h1',
    'display-md': 'h1',
    'display-sm': 'h2',
    'heading-xl': 'h2',
    'heading-lg': 'h3',
    'heading-md': 'h4',
    'heading-sm': 'h5',
    'body-lg': 'p',
    'body-md': 'p',
    'body-sm': 'p',
    caption: 'span',
    'arabic-lg': 'p',
    'arabic-md': 'p',
  }

  return variantTagMap[props.variant] || 'p'
})
</script>

<style scoped>
/* Component-specific styles if needed */
</style>
