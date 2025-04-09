<script setup lang="js">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const username = ref('')
const password = ref('')
const loading = ref(false)

const login = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    router.push('/')
  }, 1000)
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="w-full max-w-md p-6">
      <div class="text-center mb-8">
        <i class="pi pi-book text-4xl text-indigo-600"></i>
        <h1 class="text-xl font-bold text-indigo-600 mt-2">Library MS</h1>
      </div>

      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-2xl font-semibold text-gray-800 mb-1">Welcome Back</h2>
        <p class="text-gray-500 mb-6">Please sign in to continue</p>

        <form @submit.prevent="login">
          <div class="mb-4">
            <label for="username" class="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <div class="relative">
              <i class="pi pi-user absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <input id="username" v-model="username" type="text" required placeholder="Enter username"
                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
          </div>

          <div class="mb-6">
            <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div class="relative">
              <i class="pi pi-lock absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <input id="password" v-model="password" type="password" required placeholder="Enter password"
                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
          </div>

          <button type="submit"
            class="w-full bg-indigo-600 text-white py-2 px-4 rounded-md font-medium hover:bg-indigo-700 transition"
            :disabled="loading">
            <span v-if="loading">Signing in...</span>
            <span v-else>Sign In</span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Nothing needed here anymore unless you want extra styles */
</style>
