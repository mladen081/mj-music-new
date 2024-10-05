<template>
  <div class="container">
    <h1>Delete User</h1>

    <div v-for="user in users" :key="user.id" class="item">
      <div class="sub-item">
        <p>User Name: {{ user.name }}</p>
      </div>

      <div class="sub-item">
        <p>User Email: {{ user.email }}</p>
      </div>

      <div class="sub-item">
        <p>User ID: {{ user.id }}</p>
      </div>

      <div class="btn-holder">
        <button v-if="isAdmin && user.id !== 1" class="custom-btn" @click="removeUser(user.id)">
          Delete
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getAllUsers, deleteUser } from '../services/userService'
import { useAuthStore } from '../stores/authStore'

const authStore = useAuthStore()

const users = ref([])

// const userId = ref(0)

// Check login and initialize user role
onMounted(async () => {
  await authStore.checkLogin()
  listUsers()
})

// Check if the current user is an admin
const isAdmin = computed(() => authStore.role === 'ROLE_ADMIN')

// Fetch the list of todos
const listUsers = async () => {
  try {
    const response = await getAllUsers()
    users.value = response.data
  } catch (error) {
    console.error('Error fetching users:', error)
  }
}

const removeUser = async (userId) => {
  try {
    await deleteUser(userId)
    listUsers()
  } catch (error) {
    console.error('Error deleting user:', error)
  }
}
</script>

<style scoped>
.item {
  width: 50%;
  margin: 3rem auto;
  border-bottom: 1px solid var(--yellow-color);
}
.sub-item {
  margin: 3rem 0;
}

@media (max-width: 991px) {
  .item {
    width: 90%;
    margin: 3rem auto;
    border-bottom: 1px solid var(--yellow-color);
  }
}
</style>
