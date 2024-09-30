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
        <button type="submit">Submit</button>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { registerAPICall } from '../services/authService'

export default {
  setup() {
    const name = ref('')
    const username = ref('')
    const email = ref('')
    const password = ref('')

    const handleRegistrationForm = async () => {
      try {
        await registerAPICall({
          name: name.value,
          username: username.value,
          email: email.value,
          password: password.value
        })
        // Handle successful registration
        console.log('USPESNA REGISTRACIJA')
      } catch (error) {
        console.error(error)
      }
    }

    return { name, username, email, password, handleRegistrationForm }
  }
}
</script>

<style scoped></style>
