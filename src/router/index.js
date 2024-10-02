import { createRouter, createWebHistory } from 'vue-router'
import LoginComponent from '../components/LoginComponent.vue'
import RegisterComponent from '../components/RegisterComponent.vue'
import ListTodoComponent from '../components/ListTodoComponent.vue'
import TodoComponent from '../components/TodoComponent.vue'
import HomeView from '../views/HomeView.vue'
import PlayList from '../views/PlayList.vue'
import ContactView from '@/views/ContactView.vue'
import AdminView from '@/views/AdminView.vue'
import { useAuthStore } from '../stores/authStore'

const routes = [
  { path: '/', component: HomeView },
  { path: '/login', component: LoginComponent },
  { path: '/register', component: RegisterComponent },
  {
    path: '/playlist',
    component: PlayList
    // beforeEnter: (to, from, next) => {
    //   const authStore = useAuthStore() // Access the auth store
    //   authStore.checkLogin() // Ensure we check login status
    //   return authStore.user ? next() : next('/')
    // }
  },
  {
    path: '/contact',
    component: ContactView,
    beforeEnter: (to, from, next) => {
      const authStore = useAuthStore() // Access the auth store
      authStore.checkLogin() // Ensure we check login status
      return authStore.user ? next() : next('/')
    }
  },
  {
    path: '/delete-user',
    component: AdminView,
    beforeEnter: (to, from, next) => {
      const authStore = useAuthStore() // Access the auth store
      authStore.checkLogin() // Ensure we check login status
      return authStore.role === 'ROLE_ADMIN' ? next() : next('/')
    }
  },
  {
    path: '/todos',
    component: ListTodoComponent,
    beforeEnter: (to, from, next) => {
      const authStore = useAuthStore() // Access the auth store
      authStore.checkLogin() // Ensure we check login status
      return authStore.user ? next() : next('/')
    }
  },
  {
    path: '/add-todo',
    component: TodoComponent,
    beforeEnter: (to, from, next) => {
      const authStore = useAuthStore() // Access the auth store
      authStore.checkLogin() // Ensure we check login status
      return authStore.user ? next() : next('/')
    }
  },
  {
    path: '/update-todo/:id',
    component: TodoComponent,
    beforeEnter: (to, from, next) => {
      const authStore = useAuthStore() // Access the auth store
      authStore.checkLogin() // Ensure we check login status
      return authStore.user ? next() : next('/')
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
