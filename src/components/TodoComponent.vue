<template>
  <div class="container">
    <h1>{{ isEditing ? 'Update Todo' : 'Add Todo' }}</h1>

    <div class="form-container">
      <form @submit.prevent="saveOrUpdateTodo">
        <label for="title">Todo Title:</label>
        <input type="text" placeholder="Enter Todo Title" id="title" name="title" v-model="title" />

        <label for="description">Todo Description:</label>
        <input
          type="text"
          placeholder="Enter Todo Description"
          id="description"
          name="description"
          v-model="description"
        />

        <label for="completed">Todo Completed:</label>
        <select id="completed" name="completed" v-model="completed">
          <option :value="false">No</option>
          <option :value="true">Yes</option>
        </select>

        <button :disabled="!title || !description || completed === null">Save Todo</button>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getTodo, saveTodo, updateTodo } from '../services/todoService'

export default {
  setup() {
    const title = ref('')
    const description = ref('')
    const completed = ref(false)
    const router = useRouter()
    const route = useRoute()
    const isEditing = computed(() => !!route.params.id)

    const saveOrUpdateTodo = async () => {
      const todo = {
        title: title.value,
        description: description.value,
        completed: completed.value
      }

      try {
        if (isEditing.value) {
          await updateTodo(route.params.id, todo)
        } else {
          await saveTodo(todo)
        }
        router.push('/todos')
      } catch (error) {
        console.error('Error saving todo:', error)
      }
    }

    onMounted(async () => {
      if (isEditing.value) {
        try {
          const response = await getTodo(route.params.id)
          title.value = response.data.title
          description.value = response.data.description
          completed.value = response.data.completed
        } catch (error) {
          console.error('Error fetching todo:', error)
        }
      }
    })

    return {
      title,
      description,
      completed,
      saveOrUpdateTodo,
      isEditing
    }
  }
}
</script>

<style scoped></style>
