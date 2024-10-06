<template>
  <label class="toggle-switch">
    <label aria-label="toggle" for="toggle" style="visibility: hidden">toggle</label>
    <input id="toggle" name="toggle" type="checkbox" :checked="isGreen" @change="toggleColor" />
    <span class="slider"></span>
  </label>
</template>

<script setup>
import { ref } from 'vue'

// Define emitted events
const emit = defineEmits(['toggle'])

const isGreen = ref(false)

const toggleColor = (event) => {
  isGreen.value = event.target.checked // Update local state
  emit('toggle', isGreen.value) // Emit the toggle event
}
</script>

<style scoped>
.toggle-switch {
  position: relative;
  display: inline-block;
  width: 4rem;
  height: 2rem;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--yellow-color);
  transition:
    background-color 0.4s,
    transform 0.4s;
  border-radius: 0.6rem;
}

.slider:before {
  position: absolute;
  content: '';
  height: 1.5rem;
  width: 1.5rem;
  left: 0.4rem;
  bottom: 0.23rem;
  background-color: var(--primary-color);
  transition: transform 0.4s;
  border-radius: 0.6rem;
}

input:checked + .slider {
  background-color: var(--yellow-color);
}

input:checked + .slider:before {
  transform: translateX(1.7rem);
}
</style>
