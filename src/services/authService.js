import axios from 'axios'

const AUTH_REST_API_BASE_URL = 'https://todo-snqo.onrender.com/api/auth'
// const AUTH_REST_API_BASE_URL = 'http://localhost:8080/api/auth'

// Registers a new user
export const registerAPICall = (registerObj) =>
  axios.post(`${AUTH_REST_API_BASE_URL}/register`, registerObj)

// Logs in a user
export const loginAPICall = (usernameOrEmail, password) =>
  axios.post(`${AUTH_REST_API_BASE_URL}/login`, { usernameOrEmail, password })

// Stores the token in localStorage
export const storeToken = (token) => localStorage.setItem('token', token)

// Retrieves the token from localStorage
export const getToken = () => localStorage.getItem('token')

// Saves the logged-in user's information in sessionStorage
export const saveLoggedInUser = (username, role) => {
  sessionStorage.setItem('authenticatedUser', username)
  sessionStorage.setItem('role', role)
}

// Checks if the user is logged in
export const isUserLoggedIn = () => {
  return sessionStorage.getItem('authenticatedUser') !== null
}

// Retrieves the logged-in user's username from sessionStorage
export const getLoggedInUser = () => {
  return sessionStorage.getItem('authenticatedUser')
}

// Retrieves the logged-in user's role from sessionStorage
export const getLoggedInUserRole = () => {
  return sessionStorage.getItem('role')
}

// Logs out the user by clearing localStorage and sessionStorage
export const logout = () => {
  localStorage.clear()
  sessionStorage.clear()
}
