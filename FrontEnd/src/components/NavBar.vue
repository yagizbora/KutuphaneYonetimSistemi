<script setup lang="js">
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const props = defineProps<{
  visible: boolean
}

const router = useRouter()
const route = useRoute()

watch(
  () => route.path,
  () => {
    if (window.innerWidth <= 768) {
      visible.value = false
    }
  }
)

const items = ref([
  {
    label: 'Dashboard',
    icon: 'pi pi-home',
    command: () => router.push('/home'),
    class: route.path === '/home' ? 'active-route' : ''
  },
  {
    label: 'Books',
    icon: 'pi pi-book',
    command: () => router.push('/books'),
    class: route.path === '/books' ? 'active-route' : ''
  },
  {
    label: 'Members',
    icon: 'pi pi-users',
    command: () => router.push('/members'),
    class: route.path === '/members' ? 'active-route' : ''
  }
])
</script>

<template>
  <div class="layout-sidebar" :class="{ 'layout-sidebar-active': visible }">
    <PanelMenu :model="items" class="sidebar-menu" />
  </div>
</template>

<style scoped>
.layout-sidebar {
  position: fixed;
  left: 0;
  top: 4rem;
  height: calc(100vh - 4rem);
  z-index: 999;
  overflow-y: auto;
  user-select: none;
  padding: 0.5rem;
  background: var(--surface-overlay);
  border-right: 1px solid var(--surface-border);
  transition: transform 0.2s, left 0.2s;
  width: 250px;
  transform: translateX(-100%);
}

.layout-sidebar-active {
  transform: translateX(0);
}

.sidebar-menu {
  border: none;
  width: 100%;
  background: transparent;
}

.sidebar-menu :deep(.p-panelmenu-header-link) {
  padding: 0.75rem 1rem;
}

.sidebar-menu :deep(.p-menuitem-link) {
  padding: 0.75rem 1rem;
}

.sidebar-menu :deep(.p-menuitem-icon) {
  margin-right: 0.5rem;
}

.sidebar-menu :deep(.active-route) {
  background: var(--primary-50);
  border-radius: var(--border-radius);
}

@media (min-width: 769px) {
  .layout-sidebar {
    transform: none;
    left: 0;
  }

  .layout-sidebar:not(.layout-sidebar-active) {
    transform: translateX(-100%);
  }
}

@media (max-width: 768px) {
  .layout-sidebar {
    top: 4.5rem;
    height: calc(100vh - 4.5rem);
  }
}
</style>