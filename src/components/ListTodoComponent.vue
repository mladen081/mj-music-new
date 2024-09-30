<template>
  <div class="container">
    <h1>List of Todos</h1>

    <!-- Button to add new todo, visible only to admin users -->
    <div v-if="isAdmin" class="btn-holder">
      <button class="custom-btn" @click="addNewTodo">Add Todo</button>
    </div>

    <!-- List of todos -->
    <div v-for="todo in todos" :key="todo.id" class="item">
      <div class="sub-item">
        <h2>Todo Title</h2>
        <p>{{ todo.title }}</p>
      </div>

      <div class="sub-item">
        <h2>Todo Description</h2>
        <p>{{ todo.description }}</p>
      </div>

      <div class="sub-item">
        <h2>Todo Completed</h2>
        <p>{{ todo.completed ? 'Yes' : 'No' }}</p>
      </div>

      <div class="btn-holder">
        <!-- Buttons for updating and deleting todos, visible only to admin users -->
        <button v-if="isAdmin" class="custom-btn" @click="updateTodo(todo.id)">Update</button>
        <button v-if="isAdmin" class="custom-btn" @click="removeTodo(todo.id)">Delete</button>

        <!-- Buttons for marking todos as complete or incomplete -->
        <button class="custom-btn" @click="markCompleteTodo(todo.id)">Complete</button>
        <button class="custom-btn" @click="markInCompleteTodo(todo.id)">In Complete</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import { getAllTodos, deleteTodo, completeTodo, inCompleteTodo } from '../services/todoService'

export default {
  setup() {
    const todos = ref([])
    const router = useRouter()
    const authStore = useAuthStore()

    // Check login and initialize user role
    onMounted(async () => {
      await authStore.checkLogin()
      listTodos()
    })

    // Check if the current user is an admin
    const isAdmin = computed(() => authStore.role === 'ROLE_ADMIN')

    // Fetch the list of todos
    const listTodos = async () => {
      try {
        const response = await getAllTodos()
        todos.value = response.data
      } catch (error) {
        console.error('Error fetching todos:', error)
      }
    }

    // Define methods to handle todo operations
    const addNewTodo = () => {
      router.push('/add-todo')
    }

    const updateTodo = (id) => {
      router.push(`/update-todo/${id}`)
    }

    const removeTodo = async (id) => {
      try {
        await deleteTodo(id)
        listTodos()
      } catch (error) {
        console.error('Error deleting todo:', error)
      }
    }

    const markCompleteTodo = async (id) => {
      try {
        await completeTodo(id)
        listTodos()
      } catch (error) {
        console.error('Error completing todo:', error)
      }
    }

    const markInCompleteTodo = async (id) => {
      try {
        await inCompleteTodo(id)
        listTodos()
      } catch (error) {
        console.error('Error marking todo incomplete:', error)
      }
    }

    return {
      todos,
      isAdmin,
      addNewTodo,
      updateTodo,
      removeTodo,
      markCompleteTodo,
      markInCompleteTodo
    }
  }
}
</script>

<style scoped>
.item {
  padding: 4rem 0;
  border-bottom: 3px solid #ffd432;
}

.sub-item {
  padding: 2rem 0;
}

@media (max-width: 991px) {
  .item {
    padding: 3rem 0;
  }
}

@media (max-width: 767px) {
  .item {
    padding: 2rem 0;
  }
}
</style>
