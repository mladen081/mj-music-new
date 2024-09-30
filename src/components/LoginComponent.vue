<template>
  <div class="container">
    <h1>Login</h1>
    <div class="form-container">
      <form @submit.prevent="handleLoginForm">
        <label for="username">Username or Email</label>
        <input v-model="username" type="text" id="username" placeholder="Enter username" />
        <label for="password">Password</label>
        <input v-model="password" type="password" id="password" placeholder="Enter password" />
        <button type="submit">Submit</button>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useAuthStore } from '../stores/authStore'
import { useRouter } from 'vue-router'

export default {
  setup() {
    const username = ref('')
    const password = ref('')
    const authStore = useAuthStore()
    const router = useRouter()

    const handleLoginForm = async () => {
      await authStore.login(username.value, password.value)
      router.push('/todos')
    }

    return { username, password, handleLoginForm }
  }
}
</script>

<style scoped></style>
