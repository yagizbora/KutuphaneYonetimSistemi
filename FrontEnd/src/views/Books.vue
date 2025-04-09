<script setup lang="ts">
import { ref } from 'vue'

interface Book {
  id: number
  title: string
  author: string
  isbn: string
  status: string
}

const books = ref<Book[]>([
  {
    id: 1,
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    isbn: '978-0743273565',
    status: 'Available'
  }
])
</script>

<template>
  <div class="books">
    <div class="header">
      <h2>Books Management</h2>
      <Button label="Add Book" icon="pi pi-plus" />
    </div>
    
    <DataTable :value="books" :paginator="true" :rows="10">
      <Column field="title" header="Title" sortable></Column>
      <Column field="author" header="Author" sortable></Column>
      <Column field="isbn" header="ISBN"></Column>
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
.books {
  padding: 1rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}
</style>