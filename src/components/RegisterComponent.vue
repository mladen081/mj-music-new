<template>
  <div class="container">
    <h1>Register</h1>
    <div class="form-container">
      <form @submit.prevent="handleRegistrationForm">
        <label for="name">Name</label>
        <input v-model="name" type="text" id="name" placeholder="Enter name" />

        <label for="username">Username</label>
        <input v-model="username" type="text" id="username" placeholder="Enter username" />

        <label for="email">Email</label>
        <input v-model="email" type="text" id="email" placeholder="Enter email" />

        <label for="password">Password</label>
        <input v-model="password" type="password" id="password" placeholder="Enter password" />

        <button type="submit" :disabled="isLoading || isSubmitting">Submit</button>

        <p v-if="isLoading" class="spinner">Loading...</p>
        <p
          v-if="successMessage"
          class="success-message"
          tabindex="-1"
          ref="successMessageRef"
          aria-live="polite"
        >
          {{ successMessage }}
        </p>
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
import { registerAPICall } from '../services/authService'

export default {
  setup() {
    const name = ref('')
    const username = ref('')
    const email = ref('')
    const password = ref('')
    const isLoading = ref(false)
    const isSubmitting = ref(false)
    const successMessage = ref('')
    const errorMessage = ref('')
    const lastSubmittedData = ref(null)
    const successMessageRef = ref(null)
    const errorMessageRef = ref(null)

    const handleRegistrationForm = async () => {
      if (!name.value || !username.value || !email.value || !password.value) {
        errorMessage.value = 'All fields are required.'
        await focusAndScrollToMessage(errorMessageRef)
        return
      }

      const currentData = {
        name: name.value,
        username: username.value,
        email: email.value,
        password: password.value
      }
      if (
        lastSubmittedData.value &&
        JSON.stringify(currentData) === JSON.stringify(lastSubmittedData.value)
      ) {
        errorMessage.value = 'You have already submitted this data.'
        await focusAndScrollToMessage(errorMessageRef)
        return
      }

      isLoading.value = true
      isSubmitting.value = true
      successMessage.value = ''
      errorMessage.value = ''

      try {
        await registerAPICall(currentData)
        successMessage.value = 'Successful registration!'
        lastSubmittedData.value = currentData
        await focusAndScrollToMessage(successMessageRef)
      } catch (error) {
        console.error(error)
        errorMessage.value = 'Registration failed. Please try again.'
        await focusAndScrollToMessage(errorMessageRef)
      } finally {
        isLoading.value = false
        isSubmitting.value = false
      }
    }

    const focusAndScrollToMessage = async (messageRef) => {
      await nextTick()
      if (messageRef.value) {
        messageRef.value.focus()
        messageRef.value.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }

    return {
      name,
      username,
      email,
      password,
      handleRegistrationForm,
      isLoading,
      isSubmitting,
      successMessage,
      errorMessage,
      successMessageRef,
      errorMessageRef
    }
  }
}
</script>

<style scoped></style>
