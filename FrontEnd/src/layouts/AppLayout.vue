<script setup lang="js">
import { ref } from 'vue'
import TopBar from '../components/TopBar.vue'
import NavBar from '../components/NavBar.vue'
import Footer from '../components/Footer.vue'

const menuVisible = ref(true)

const toggleMenu = () => {
  menuVisible.value = !menuVisible.value
}
</script>

<template>
  <div class="layout-wrapper">
    <Toast />
    <TopBar @toggle-menu="toggleMenu" />
    <NavBar :visible="menuVisible" />
    <main class="main-content" :class="{ 'full-width': !menuVisible }">
      <router-view></router-view>
    </main>
    <Footer />
  </div>
</template>

<style>
.layout-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding: 2rem;
  margin-left: 250px;
  transition: margin-left 0.2s;
  background: var(--surface-ground);
}

.main-content.full-width {
  margin-left: 0;
}

@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
    padding: 1rem;
  }
}
</style>