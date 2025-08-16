<template>
  <div class="login-page">
    <h2>Login</h2>
    <input v-model="email" type="email" placeholder="Correo"/>
    <input v-model="password" type="password" placeholder="Contraseña"/>
    <button @click="loginUser">Ingresar</button>
    <div v-if="error" class="error">{{ error }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import { useAuthStore } from '~/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()
const email = ref('')
const password = ref('')
const error = ref('')

async function loginUser() {
  try {
    const { data } = await axios.post('http://localhost:4000/api/auth/login', {
      email: email.value,
      password: password.value
    })
    authStore.login(data.token, data.email)
    router.push('/') // redirige al index
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Error en login'
  }
}
</script>

<style scoped>
.login-page {
  max-width: 400px;
  margin: 5rem auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  input { padding: 0.5rem; font-size: 1rem; }
  button { padding: 0.5rem; background-color: #3498db; color: white; border: none; cursor: pointer; }
  .error { color: red; font-weight: bold; }
}
</style>
