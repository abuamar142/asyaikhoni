<template>
  <div id="app">
    <!-- Header -->
    <AppHeader />

    <!-- Main Content -->
    <main>
      <!-- Hero Section -->
      <HeroSection />

      <!-- About Section -->
      <AboutSection />

      <!-- Programs Section -->
      <ProgramsSection />

      <!-- Facilities Section -->
      <FacilitiesSection />

      <!-- Testimonials Section -->
      <TestimonialsSection />

      <!-- Contact Section -->
      <ContactSection />
    </main>

    <!-- Footer -->
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'HomePage',
})

import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import HeroSection from '@/components/sections/HeroSection.vue'
import AboutSection from '@/components/sections/AboutSection.vue'
import ProgramsSection from '@/components/sections/ProgramsSection.vue'
import FacilitiesSection from '@/components/sections/FacilitiesSection.vue'
import TestimonialsSection from '@/components/sections/TestimonialsSection.vue'
import ContactSection from '@/components/sections/ContactSection.vue'
</script>

<style>
/* Global styles sudah ada di main.css */
</style>
