<script setup lang="js">
import { ref, onMounted } from 'vue'

const stats = ref({
  totalBooks: 1250,
  availableBooks: 1100,
  totalMembers: 500,
  activeLoans: 150
})

onMounted(() => {
})
</script>

<template>
  <div class="dashboard p-4">
    <div class="mb-6 bg-white p-6 rounded-lg shadow">
      <h5 class="text-xl font-semibold text-gray-800 mb-2">Welcome to Library Management System</h5>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-white p-6 rounded-lg shadow flex justify-between items-center">
        <div>
          <p class="text-gray-500 font-medium mb-2">Total Books</p>
          <p class="text-gray-900 text-xl font-semibold">{{ stats.totalBooks }}</p>
        </div>
        <div class="w-10 h-10 bg-blue-100 flex items-center justify-center rounded-full">
          <i class="pi pi-book text-blue-500 text-xl"></i>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow flex justify-between items-center">
        <div>
          <p class="text-gray-500 font-medium mb-2">Available Books</p>
          <p class="text-gray-900 text-xl font-semibold">{{ stats.availableBooks }}</p>
        </div>
        <div class="w-10 h-10 bg-green-100 flex items-center justify-center rounded-full">
          <i class="pi pi-check-circle text-green-500 text-xl"></i>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow flex justify-between items-center">
        <div>
          <p class="text-gray-500 font-medium mb-2">Total Members</p>
          <p class="text-gray-900 text-xl font-semibold">{{ stats.totalMembers }}</p>
        </div>
        <div class="w-10 h-10 bg-purple-100 flex items-center justify-center rounded-full">
          <i class="pi pi-users text-purple-500 text-xl"></i>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow flex justify-between items-center">
        <div>
          <p class="text-gray-500 font-medium mb-2">Active Loans</p>
          <p class="text-gray-900 text-xl font-semibold">{{ stats.activeLoans }}</p>
        </div>
        <div class="w-10 h-10 bg-orange-100 flex items-center justify-center rounded-full">
          <i class="pi pi-sync text-orange-500 text-xl"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  padding: 1rem;
}

.card {
  background: var(--surface-card);
  padding: 1.5rem;
  margin-bottom: 1rem;
  border-radius: var(--border-radius);
  box-shadow: var(--card-shadow);
}

h5 {
  margin: 0 0 1rem 0;
  color: var(--surface-900);
}

.text-500 {
  color: var(--surface-500);
}

.text-900 {
  color: var(--surface-900);
}
</style>