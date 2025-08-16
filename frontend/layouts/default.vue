<template>
  <header class="header">
    <h1>EzBookReviews</h1>
    <div class="header-buttons">
      <button class="library-btn" @click="$router.push('/')">Buscador</button>
      <button class="library-btn" @click="$router.push('/my-library')">Mi Biblioteca</button>
      <button 
        v-if="auth.isLoggedIn" 
        class="logout-btn" 
        @click="logoutUser"
      >
        Cerrar sesión
      </button>
    </div>
  </header>

  <!-- Contenido de la página -->
  <main>
    <NuxtPage />
  </main>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

function logoutUser() {
  auth.logout()
  router.push('/login')
}
</script>

<style scoped lang="scss">
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #3498db;
  color: white;

  h1 {
    margin: 0;
    font-size: 1.5rem;
  }

  .header-buttons {
    display: flex;
    gap: 0.5rem;

    button {
      padding: 0.5rem 1rem;
      font-weight: bold;
      border-radius: 8px;
      border: none;
      cursor: pointer;
      transition: background 0.3s;

      &.library-btn {
        background-color: white;
        color: #3498db;

        &:hover {
          background-color: #ecf0f1;
        }
      }

      &.logout-btn {
        background-color: #e74c3c;
        color: white;

        &:hover {
          background-color: #c0392b;
        }
      }
    }
  }
}

main {
  padding: 2rem;
}
</style>
