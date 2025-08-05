<template>
  <div id="sejarah-page">
    <!-- Header -->
    <AppHeader />

    <!-- Main Content -->
    <main>
      <!-- Sejarah Section -->
      <SejarahSection />
    </main>

    <!-- Footer -->
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'SejarahPage',
})

import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import SejarahSection from '@/components/sections/SejarahSection.vue'
</script>

<style>
/* Global styles sudah ada di main.css */
</style>
