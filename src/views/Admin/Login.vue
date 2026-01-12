<template>
  <section class="min-h-screen flex items-center justify-center bg-white px-4 py-12">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <h1 class="text-heading-xl text-brand mb-2">Admin Login</h1>
        <p class="text-body-md text-muted">Masuk untuk mengelola amalan</p>
      </div>
      <form
        @submit.prevent="onSubmit"
        class="space-y-4 bg-white border border-green-100 rounded-lg p-6 shadow-sm"
      >
        <div>
          <label class="block text-body-sm text-text-primary font-medium mb-2">Email</label>
          <input
            v-model="email"
            type="email"
            required
            class="w-full px-4 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            placeholder="admin@example.com"
          />
        </div>
        <div>
          <label class="block text-body-sm text-text-primary font-medium mb-2">Password</label>
          <input
            v-model="password"
            type="password"
            required
            class="w-full px-4 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            placeholder="••••••••"
          />
        </div>
        <button
          :disabled="loading"
          class="btn-primary w-full inline-flex items-center justify-center gap-2 text-body-md disabled:opacity-80 disabled:cursor-not-allowed mt-6"
        >
          {{ loading ? 'Sedang masuk...' : 'Masuk' }}
        </button>
        <p v-if="error" class="text-text-error text-body-sm text-center">{{ error }}</p>
      </form>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { login } from '@/services/authService'

defineOptions({
  name: 'LoginPage',
})

const router = useRouter()
const route = useRoute()
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

async function onSubmit() {
  loading.value = true
  error.value = ''
  try {
    await login(email.value, password.value)
    const redirect = route.query.redirect as string | undefined
    router.push(redirect || { name: 'admin-index' })
  } catch (e: unknown) {
    error.value = (e instanceof Error ? e.message : 'Login gagal') || 'Login gagal'
  } finally {
    loading.value = false
  }
}
</script>
