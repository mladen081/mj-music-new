<template>
  <main>
    <div class="container">
      <div class="title">
        <h1>Contact Me</h1>
      </div>

      <div v-if="!formSent">
        <div class="form-wrapper">
          <div class="form-container">
            <form class="form" ref="form" @submit.prevent="sendEmail">
              <label for="email">Email</label>
              <input
                class="form-input"
                type="email"
                v-model="email"
                name="email"
                placeholder="Your Email"
                id="email"
              />
              <label for="message">Message</label>
              <textarea
                class="form-textarea"
                name="message"
                v-model="message"
                cols="30"
                rows="5"
                placeholder="Message"
                id="message"
              ></textarea>

              <button type="submit" value="Send" :disabled="isLoading">Submit</button>
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
      </div>

      <div v-else style="margin-top: 5rem">
        <h2>Email sent successfully!</h2>
      </div>
    </div>
  </main>
</template>

<script>
import { ref, nextTick, computed } from 'vue'
import emailjs from '@emailjs/browser'
import { useAuthStore } from '../stores/authStore'

export default {
  name: 'ContactView',

  setup() {
    const email = ref('')
    const message = ref('')
    const formSent = ref(false)
    const isLoading = ref(false)
    const errorMessage = ref('')
    const errorMessageRef = ref(null)
    const authStore = useAuthStore()

    const username = computed(() => authStore.user || '')

    const sendEmail = async () => {
      // Prevent form submission if email is not provided
      if (!email.value.trim()) {
        errorMessage.value = 'Please provide your email'
        await focusAndScrollToMessage(errorMessageRef)
        return
      }

      const templateParams = {
        name: username.value,
        email: email.value,
        message: message.value
      }

      isLoading.value = true
      errorMessage.value = ''

      try {
        await emailjs.send(
          'service_veysv5r',
          'template_69el6bn',
          templateParams,
          'cjNCChjwSXUbo8iL3'
        )
        // Reset form fields
        email.value = ''
        message.value = ''
        formSent.value = true
      } catch (error) {
        errorMessage.value = 'Failed to send email. Please try again later.'
        await focusAndScrollToMessage(errorMessageRef)
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

    return {
      email,
      message,
      formSent,
      isLoading,
      errorMessage,
      errorMessageRef,
      username,
      sendEmail
    }
  }
}
</script>

<style scoped></style>
