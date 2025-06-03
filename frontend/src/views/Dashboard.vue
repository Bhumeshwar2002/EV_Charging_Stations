<template>
  <div class="dashboard">
    <header class="header">
      <h1>EV Charging Station Manager</h1>
      <button @click="logout" class="logout-btn">Logout</button>
    </header>
    
    <nav class="sidebar">
      <router-link :to="{ name: 'stations' }" class="nav-link">
        <span>Charging Stations</span>
      </router-link>
    </nav>
    
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()

const logout = () => {
  authStore.logout()
}
</script>

<style scoped>
.dashboard {
  display: grid;
  grid-template-areas:
    "header header"
    "sidebar content";
  grid-template-columns: 250px 1fr;
  grid-template-rows: auto 1fr;
  min-height: 100vh;
}

.header {
  grid-area: header;
  background-color: #2c3e50;
  color: white;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header h1 {
  margin: 0;
  font-size: 1.5rem;
}

.logout-btn {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.logout-btn:hover {
  background-color: #c0392b;
}

.sidebar {
  grid-area: sidebar;
  background-color: #34495e;
  color: white;
  padding: 1rem 0;
}

.nav-link {
  display: block;
  padding: 0.75rem 1.5rem;
  color: white;
  text-decoration: none;
  transition: background-color 0.2s;
}

.nav-link:hover {
  background-color: #3d566e;
}

.nav-link.router-link-active {
  background-color: #42b983;
  font-weight: bold;
}

.main-content {
  grid-area: content;
  padding: 2rem;
  background-color: #f5f7fa;
}
</style>