<template>
  <div class="login-container">
    <h1>EV Charging Station Manager</h1>
    <div class="auth-form">
      <h2>Login</h2>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="username">Username</label>
          <input
            id="username"
            v-model="loginData.username"
            type="text"
            required
          />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input
            id="password"
            v-model="loginData.password"
            type="password"
            required
          />
        </div>
        <button type="submit" :disabled="loading">Login</button>
        <p v-if="error" class="error">{{ error }}</p>
      </form>
      
      <div class="divider">OR</div>
      
      <h2>Register</h2>
      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label for="reg-username">Username</label>
          <input
            id="reg-username"
            v-model="registerData.username"
            type="text"
            required
          />
        </div>
        <div class="form-group">
          <label for="reg-email">Email</label>
          <input
            id="reg-email"
            v-model="registerData.email"
            type="email"
            required
          />
        </div>
        <div class="form-group">
          <label for="reg-password">Password</label>
          <input
            id="reg-password"
            v-model="registerData.password"
            type="password"
            required
          />
        </div>
        <button type="submit" :disabled="loading">Register</button>
        <p v-if="registerError" class="error">{{ registerError }}</p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const loading = ref(false)
const error = ref(null)
const registerError = ref(null)

const loginData = ref({
  username: '',
  password: ''
})

const registerData = ref({
  username: '',
  email: '',
  password: ''
})

const handleLogin = async () => {
  error.value = null
  loading.value = true
  try {
    await authStore.login(loginData.value)
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

const handleRegister = async () => {
  registerError.value = null
  loading.value = true
  try {
    await authStore.register(registerData.value)
  } catch (err) {
    registerError.value = err.message
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  max-width: 500px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

.auth-form {
  background: #fff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h1 {
  color: #2c3e50;
  margin-bottom: 2rem;
}

h2 {
  color: #42b983;
  margin: 1.5rem 0 1rem;
}

.form-group {
  margin-bottom: 1rem;
  text-align: left;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

button {
  width: 100%;
  padding: 0.75rem;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 1rem;
}

button:hover {
  background-color: #3aa876;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.divider {
  margin: 1.5rem 0;
  position: relative;
  text-align: center;
  color: #777;
}

.divider::before,
.divider::after {
  content: '';
  position: absolute;
  top: 50%;
  width: 45%;
  height: 1px;
  background-color: #ddd;
}

.divider::before {
  left: 0;
}

.divider::after {
  right: 0;
}

.error {
  color: #e74c3c;
  margin-top: 1rem;
}
</style>