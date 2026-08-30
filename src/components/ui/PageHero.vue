<template>
  <section class="relative overflow-hidden border-b border-[#e8e6de] bg-[#fdfcf8] supports-[backdrop-filter]:bg-white/85 supports-[backdrop-filter]:backdrop-blur-[8px]">
    <!-- top accent line -->
    <div
      aria-hidden="true"
      class="pointer-events-none absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-200/50 to-transparent"
    ></div>

    <!-- arc decoration -->
    <div
      v-if="showArc"
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div
        class="absolute -right-20 -top-10 hidden lg:block w-[520px] h-[520px] rounded-full border border-emerald-900/5"
      ></div>
      <div
        class="absolute -right-16 -top-16 hidden lg:block w-[420px] h-[420px] rounded-full border border-emerald-100/70"
      ></div>
      <div
        class="absolute -right-16 -top-16 hidden lg:block w-[320px] h-[320px] rounded-full border border-emerald-100/50"
      ></div>
    </div>

    <div class="relative container mx-auto max-w-[1280px] px-6 py-8">
      <div class="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 lg:gap-8">
          <!-- left: eyebrow + title + desc + actions-left -->
          <div class="max-w-[44rem]">
            <!-- eyebrow -->
            <div class="inline-flex flex-wrap items-center gap-2 mb-4">
              <span class="h-px w-8 bg-emerald-700 hidden sm:block"></span>
              <span
                class="text-[11px] tracking-[0.2em] font-semibold text-emerald-800 uppercase"
                >{{ eyebrow }}</span
              >
              <span
                v-if="eyebrowAccent"
                class="hidden sm:inline-flex items-center gap-2"
              >
                <span class="w-1 h-1 rounded-full bg-amber-400"></span>
                <span class="text-[11px] tracking-[0.2em] font-medium text-stone-500 uppercase"
                  >{{ eyebrowAccent }}</span
                >
              </span>
            </div>

            <h1
              class="font-serif text-4xl sm:text-[42px] lg:text-[48px] font-[600] tracking-[-0.03em] leading-none text-[#0f2318]"
              style="font-family: 'Fraunces', 'Cormorant Garamond', Georgia, serif"
            >
              {{ title }}
              <em class="font-light italic text-emerald-800">{{ titleAccent }}</em>
            </h1>

            <p
              class="mt-3.5 text-sm sm:text-[16px] leading-relaxed text-stone-600 max-w-[560px] max-w-[38rem] text-pretty"
            >
              {{ description }}
            </p>

            <!-- actions-left (and mobile fallback for actions-right) -->
            <div
              v-if="$slots['actions-left'] || $slots['actions-right']"
              class="mt-6 flex flex-wrap items-center gap-3"
            >
              <slot name="actions-left" />
              <!-- on mobile, show actions-right inline; on desktop it will also render in right column -->
              <span class="contents lg:hidden">
                <slot name="actions-right" />
              </span>
            </div>
          </div>

          <!-- right: actions-right (desktop) + stats-right -->
          <div
            v-if="$slots['stats-right'] || $slots['actions-right']"
            class="hidden lg:flex flex-col items-end gap-4 shrink-0"
          >
            <div v-if="$slots['actions-right']" class="flex flex-wrap items-center justify-end gap-3">
              <slot name="actions-right" />
            </div>
            <div v-if="$slots['stats-right']" class="flex flex-col items-end text-right">
              <slot name="stats-right" />
            </div>
          </div>
        </div>
    </div>
  </section>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    eyebrow: string
    eyebrowAccent?: string
    title: string
    titleAccent: string
    description: string
    showArc?: boolean
  }>(),
  {
    eyebrowAccent: undefined,
    showArc: true,
  },
)
</script>
