<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits(['toggle-menu'])
const menu = ref()

const toggleMenu = (event: Event) => {
  menu.value.toggle(event)
}

const items = ref([
  {
    label: 'Profile',
    icon: 'pi pi-user'
  },
  {
    label: 'Settings',
    icon: 'pi pi-cog'
  },
  {
    separator: true
  },
  {
    label: 'Logout',
    icon: 'pi pi-sign-out'
  }
])
</script>

<template>
  <div class="topbar">
    <div class="logo">
      <Button icon="pi pi-bars" @click="$emit('toggle-menu')" text rounded />
      <i class="pi pi-book text-3xl text-primary"></i>
      <h1>Library MS</h1>
    </div>
    <div class="topbar-right">
      <span class="p-input-icon-left search-box">
        <i class="pi pi-search" />
        <InputText placeholder="Search..." />
      </span>
      <Button icon="pi pi-bell" text rounded />
      <div class="user-menu">
        <Button 
          type="button"
          @click="toggleMenu"
          class="user-button"
          text
        >
          <img src="https://www.gravatar.com/avatar/default?d=mp" alt="User" class="user-image" />
          <span class="username">User Settings</span>
          <i class="pi pi-angle-down" />
        </Button>
        <Menu ref="menu" :model="items" :popup="true" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.topbar {
  background: var(--surface-0);
  padding: 0.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0,0,0,.1);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 999;
  height: 4rem;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.logo i {
  font-size: 2rem;
  color: var(--primary-color);
}

.logo h1 {
  margin: 0;
  color: var(--primary-color);
  font-size: 1.5rem;
}

.topbar-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.search-box {
  width: 300px;
}

.user-menu {
  position: relative;
}

.user-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
}

.user-image {
  width: 32px;
  height: 32px;
  border-radius: 50%;
}

.username {
  font-weight: 500;
}

@media (max-width: 768px) {
  .search-box {
    display: none;
  }
  
  .username {
    display: none;
  }
  
  .topbar {
    padding: 0.5rem 1rem;
  }
}
</style>