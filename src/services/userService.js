import axios from 'axios'
import { getToken } from './authService'

const BASE_URL = 'https://todo-snqo.onrender.com/api/users'
// const BASE_URL = 'http://localhost:8080/api/users'

axios.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) {
      config.headers['Authorization'] = token
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Fetch all todos
export const getAllUsers = () => axios.get(`${BASE_URL}`)

// Delete a todo by id
export const deleteUser = (id) => axios.delete(`${BASE_URL}/${id}`)
