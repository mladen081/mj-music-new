<template>
  <footer>
    <p>Just Music 2024 by Uros</p>
    <ToggleSwitch @toggle="toggleColor" class="toggle-element" />
  </footer>
</template>

<script setup>
import { ref } from 'vue'
import ToggleSwitch from '@/components/ToggleSwitch.vue'

const isGreen = ref(false)

const toggleColor = (value) => {
  isGreen.value = value

  // Update CSS variables based on the toggle state
  if (isGreen.value) {
    document.documentElement.style.setProperty('--yellow-color', '#4FD2EE') // green
    document.documentElement.style.setProperty('--green-color', '#ffd432') // yellow
    document.documentElement.style.setProperty('--primary-color', '#1A1A1A')
  } else {
    document.documentElement.style.setProperty('--yellow-color', '#ffd432') // yellow
    document.documentElement.style.setProperty('--green-color', '#4FD2EE') // green
    document.documentElement.style.setProperty('--primary-color', '#141417')
  }
}
</script>

<style scoped>
footer {
  width: 100%;
  height: 5rem;
  position: fixed;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--primary-color);
  color: var(--secondary-color);
}

.toggle-element {
  margin-left: 2rem;
}
</style>
