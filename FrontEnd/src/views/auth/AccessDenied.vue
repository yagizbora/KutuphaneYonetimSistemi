<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  router.back()
}

const goHome = () => {
  router.push('/')
}
</script>

<template>
  <div class="access-denied">
    <div class="error-box">
      <i class="pi pi-ban text-6xl text-pink-500 mb-4"></i>
      <h1>Access Denied</h1>
      <p>You don't have permission to access this page.</p>
      <div class="actions">
        <Button label="Go Back" icon="pi pi-arrow-left" @click="goBack" outlined />
        <Button label="Go Home" icon="pi pi-home" @click="goHome" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.access-denied {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--surface-ground);
  padding: 2rem;
}

.error-box {
  text-align: center;
  background: var(--surface-card);
  padding: 3rem;
  border-radius: var(--border-radius);
  box-shadow: var(--card-shadow);
}

h1 {
  font-size: 2rem;
  margin: 0 0 1rem 0;
  color: var(--pink-500);
}

p {
  color: var(--text-color-secondary);
  margin-bottom: 2rem;
}

.actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}
</style>