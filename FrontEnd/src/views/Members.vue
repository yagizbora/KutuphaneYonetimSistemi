<script setup lang="ts">
import { ref } from 'vue'

interface Member {
  id: number
  name: string
  email: string
  joinDate: string
  status: string
}

const members = ref<Member[]>([
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    joinDate: '2024-01-01',
    status: 'Active'
  }
])
</script>

<template>
  <div class="members">
    <div class="header">
      <h2>Members Management</h2>
      <Button label="Add Member" icon="pi pi-plus" />
    </div>
    
    <DataTable :value="members" :paginator="true" :rows="10">
      <Column field="name" header="Name" sortable></Column>
      <Column field="email" header="Email"></Column>
      <Column field="joinDate" header="Join Date" sortable></Column>
      <Column field="status" header="Status" sortable></Column>
      <Column header="Actions">
        <template #body>
          <Button icon="pi pi-pencil" severity="info" text />
          <Button icon="pi pi-trash" severity="danger" text />
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<style scoped>
.members {
  padding: 1rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}
</style>