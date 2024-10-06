<template>
  <header :class="{ 'scrolled-nav': scrolledNav }">
    <nav>
      <div class="branding">
        <router-link class="link" exact-active-class="active-tab" to="/">MJ Music</router-link>
      </div>

      <ul v-show="!mobile" class="navigation">
        <li v-if="isAdmin">
          <router-link class="link" exact-active-class="active-tab" to="/delete-user"
            >Admin</router-link
          >
        </li>
        <li>
          <router-link class="link" exact-active-class="active-tab" to="/playlist"
            >Playlist</router-link
          >
        </li>
        <li v-if="isAuth">
          <router-link class="link" exact-active-class="active-tab" to="/contact"
            >Contact</router-link
          >
        </li>
        <li v-if="isAuth">
          <router-link class="link" exact-active-class="active-tab" to="/todos">Todos</router-link>
        </li>
        <li v-if="!isAuth">
          <router-link class="link" exact-active-class="active-tab" to="/register"
            >Register</router-link
          >
        </li>
        <li v-if="!isAuth">
          <router-link class="link" exact-active-class="active-tab" to="/login">Login</router-link>
        </li>
        <li v-if="isAuth">
          <router-link class="link" @click="handleLogout" to="#">Logout</router-link>
        </li>
      </ul>

      <div class="icon" @click.stop="toggleMobileNav">
        <i v-show="mobile" class="far fa-bars" :class="{ 'icon-active': mobileNav }"></i>
      </div>

      <transition name="mobile-nav">
        <ul v-show="mobileNav" class="dropdown-nav">
          <li v-if="isAdmin">
            <router-link class="link" exact-active-class="active-tab" to="/delete-user"
              >Admin</router-link
            >
          </li>
          <li>
            <router-link class="link" exact-active-class="active-tab" to="/playlist"
              >Playlist</router-link
            >
          </li>
          <li v-if="isAuth">
            <router-link class="link" exact-active-class="active-tab" to="/contact"
              >Contact</router-link
            >
          </li>
          <li v-if="isAuth">
            <router-link class="link" exact-active-class="active-tab" to="/todos"
              >Todos</router-link
            >
          </li>
          <li v-if="!isAuth">
            <router-link class="link" exact-active-class="active-tab" to="/register"
              >Register</router-link
            >
          </li>
          <li v-if="!isAuth">
            <router-link class="link" exact-active-class="active-tab" to="/login"
              >Login</router-link
            >
          </li>
          <li v-if="isAuth">
            <router-link class="link" @click="handleLogout" to="#">Logout</router-link>
          </li>
        </ul>
      </transition>
    </nav>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useAuthStore } from '../stores/authStore'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

// Check login status
authStore.checkLogin()

// Use computed to determine if the user is authenticated
const isAuth = computed(() => !!authStore.user)

// Use computed to determine if the user is ROLE_ADMIN
const isAdmin = computed(() => authStore.role === 'ROLE_ADMIN')

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

const scrolledNav = ref(false)
const mobile = ref(false)
const mobileNav = ref(false)
const windowWidth = ref(window.innerWidth)

// Toggle mobile navigation
const toggleMobileNav = () => {
  mobileNav.value = !mobileNav.value
}

// Handle click events outside of navigation links
const handleClickOutside = (event) => {
  if (!event.target.closest('router-link')) {
    mobileNav.value = false // Close mobile nav when clicking outside
  }
}

// Update scroll position
const updateScroll = () => {
  scrolledNav.value = window.scrollY > 50
}

// Check screen size
const checkScreen = () => {
  windowWidth.value = window.innerWidth
  mobile.value = windowWidth.value <= 767
  if (!mobile.value) {
    mobileNav.value = false // Close mobile nav if on larger screens
  }
}

onMounted(() => {
  window.addEventListener('resize', checkScreen)
  window.addEventListener('scroll', updateScroll)
  window.addEventListener('click', handleClickOutside) // Global click listener
  checkScreen()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkScreen)
  window.removeEventListener('scroll', updateScroll)
  window.removeEventListener('click', handleClickOutside) // Clean up listener
})
</script>

<style scoped>
header {
  width: 100%;
  position: fixed;
  color: #fff;
  background-color: #090909;
}

header nav {
  position: relative;
  display: flex;
  flex-direction: row;
  padding: 1.7rem 0;
  width: 99%;
  margin: 0 auto;
}

header nav ul,
header nav ul .link,
header nav .branding .link {
  font-weight: 200;
  color: #fff;
  list-style: none;
  text-decoration: none;
}

header nav ul li {
  margin-left: 1.6rem;
}

header nav ul li .link,
header nav .branding .link {
  font-size: 2rem;
  transition: 0.5s ease all;
  padding-bottom: 0.4rem;
  border-bottom: 0.1rem solid transparent;
}

header nav .branding .link {
  padding-left: 1rem;
}

header nav ul li .link:hover,
header nav .branding .link:hover,
header nav ul li .link:focus,
header nav .branding .link:focus {
  color: var(--yellow-color);
}

header nav .navigation {
  display: flex;
  align-items: center;
  flex: 1;
  justify-content: flex-end;
  padding-right: 2rem;
}

header nav .navigation li.active-tab .link {
  color: var(--yellow-color);
}

header nav .dropdown-nav li .link:hover,
header nav .dropdown-nav li .link:focus,
header nav .dropdown-nav li.active-tab .link {
  color: var(--yellow-color);
}

header nav .icon {
  display: flex;
  align-items: center;
  position: absolute;
  top: 0;
  right: 2.4rem;
  height: 100%;
}

header nav .icon i {
  cursor: pointer;
  font-size: 2.4rem;
  transition: 0.8s ease all;
}

header nav .icon-active {
  transform: rotate(180deg);
}

header nav .dropdown-nav {
  display: flex;
  flex-direction: column;
  position: fixed;
  width: 100%;
  max-width: 80%;
  height: max-content;
  padding: 1.3rem 0;
  background-color: rgba(38, 40, 45, 0.99);
  top: 0%;
  left: 0;
  border-right: 0.1rem solid #fff;
  border-bottom: 0.1rem solid #fff;
  border-radius: 1rem;
}

header nav .dropdown-nav li {
  margin-left: 0;
  margin-top: 1.5rem;
}

header nav .dropdown-nav li .link {
  color: #fff;
  padding-left: 0.6rem;
}

header nav .mobile-nav-enter-active,
header nav .mobile-nav-leave-active {
  transition: 1s ease all;
}

header nav .mobile-nav-enter-from,
header nav .mobile-nav-leave-to {
  transform: translateX(-30rem);
}

header nav .mobile-nav-enter-to {
  transform: translateX(0);
}

.scrolled-nav {
  background-color: var(--primary-color);
}

header nav ul li .active-tab,
header nav .branding .active-tab {
  color: var(--yellow-color);
}
</style>
