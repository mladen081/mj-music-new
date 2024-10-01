import { defineStore } from 'pinia'
import {
  loginAPICall,
  storeToken,
  saveLoggedInUser,
  isUserLoggedIn,
  logout as logoutService,
  getLoggedInUser,
  getLoggedInUserRole
} from '../services/authService.js'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null,
    user: null,
    role: null // Add role to the state
  }),
  actions: {
    async login(username, password) {
      try {
        const response = await loginAPICall(username, password)
        this.token = 'Bearer ' + response.data.accessToken
        storeToken(this.token)
        saveLoggedInUser(username, response.data.role)
        this.user = username
        this.role = response.data.role // Store role in the state
      } catch (error) {
        console.error(error)
        throw error // Re-throw the error to be caught in the component
      }
    },
    logout() {
      logoutService()
      this.token = null
      this.user = null
      this.role = null // Clear the role on logout
    },
    checkLogin() {
      if (isUserLoggedIn()) {
        this.user = getLoggedInUser()
        this.role = getLoggedInUserRole() // Set the role on login check
      } else {
        this.user = null
        this.role = null
      }
    }
  }
})
