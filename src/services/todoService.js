import axios from 'axios'
import { getToken } from './authService'

const BASE_URL = 'https://todo-snqo.onrender.com/api/todos'
// const BASE_URL = 'http://localhost:8080/api/todos'

// Add a request interceptor to include the token in the headers
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
export const getAllTodos = () => axios.get(`${BASE_URL}`)

// Save a new todo
export const saveTodo = (todo) => axios.post(`${BASE_URL}`, todo)

// Get a single todo by id
export const getTodo = (id) => axios.get(`${BASE_URL}/${id}`)

// Update an existing todo by id
export const updateTodo = (id, todo) => axios.put(`${BASE_URL}/${id}`, todo)

// Delete a todo by id
export const deleteTodo = (id) => axios.delete(`${BASE_URL}/${id}`)

// Mark a todo as completed
export const completeTodo = (id) => axios.patch(`${BASE_URL}/${id}/complete`)

// Mark a todo as incomplete
export const inCompleteTodo = (id) => axios.patch(`${BASE_URL}/${id}/in-complete`)
