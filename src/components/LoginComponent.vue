<template>
  <div class="container">
    <h1>Login</h1>
    <div class="form-container">
      <form @submit.prevent="handleLoginForm">
        <label for="username">Username or Email</label>
        <input v-model="username" type="text" id="username" placeholder="Enter username" />

        <label for="password">Password</label>
        <input v-model="password" type="password" id="password" placeholder="Enter password" />

        <button type="submit" :disabled="isLoading">Submit</button>

        <p v-if="isLoading" class="spinner">Loading...</p>
        <p
          v-if="errorMessage"
          class="error-message"
          tabindex="-1"
          ref="errorMessageRef"
          aria-live="assertive"
        >
          {{ errorMessage }}
        </p>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, nextTick } from 'vue'
import { useAuthStore } from '../stores/authStore'
import { useRouter } from 'vue-router'

export default {
  setup() {
    const username = ref('')
    const password = ref('')
    const isLoading = ref(false)
    const errorMessage = ref('')
    const errorMessageRef = ref(null) // Reference for the error message
    const authStore = useAuthStore()
    const router = useRouter()

    const handleLoginForm = async () => {
      isLoading.value = true
      errorMessage.value = ''
      try {
        await authStore.login(username.value, password.value)
        router.push('/todos')
      } catch (error) {
        errorMessage.value = 'Login failed. Please check your credentials.'
        await focusAndScrollToMessage(errorMessageRef) // Focus and scroll to the error message
        console.error(error)
      } finally {
        isLoading.value = false
      }
    }

    const focusAndScrollToMessage = async (messageRef) => {
      await nextTick()
      if (messageRef.value) {
        messageRef.value.focus()
        messageRef.value.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }

    return { username, password, handleLoginForm, isLoading, errorMessage, errorMessageRef }
  }
}
</script>

<style scoped></style>
