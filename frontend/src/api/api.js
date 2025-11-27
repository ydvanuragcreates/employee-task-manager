import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

// Debug: Log the API URL being used
console.log('🔧 API Base URL:', API_BASE_URL)
console.log('🔧 Environment:', import.meta.env.MODE)

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add request interceptor to attach JWT token
api.interceptors.request.use(
  async (config) => {
    try {
      // Get the Clerk session token from window.Clerk
      // Clerk is automatically available on window after ClerkProvider loads
      if (window.Clerk && window.Clerk.session) {
        const token = await window.Clerk.session.getToken()
        
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
      }
    } catch (error) {
      console.error('Error getting auth token:', error)
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Employee API
export const employeeAPI = {
  getAll: () => api.get('/employees'),
  getById: (id) => api.get(`/employees/${id}`),
  create: (data) => api.post('/employees', data),
  update: (id, data) => api.put(`/employees/${id}`, data),
  delete: (id) => api.delete(`/employees/${id}`),
}

// Task API
export const taskAPI = {
  getAll: () => api.get('/tasks'),
  getById: (id) => api.get(`/tasks/${id}`),
  create: (data) => api.post('/tasks', data),
  update: (id, data) => api.put(`/tasks/${id}`, data),
  delete: (id) => api.delete(`/tasks/${id}`),
}

// Profile API
export const profileAPI = {
  get: () => api.get('/profile'),
  update: (data) => api.put('/profile', data),
  uploadAvatar: (file) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post('/profile/upload-avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },
  deleteAvatar: () => api.delete('/profile/avatar'),
}

export default api
