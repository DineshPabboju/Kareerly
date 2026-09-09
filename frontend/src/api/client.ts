import axios from 'axios'

// Prefer relative path so Vite proxy works smoothly; fallback to VITE_API_URL or localhost
const baseURL = import.meta.env.VITE_API_URL || ''

export const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Attach Bearer token from localStorage if present
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('folio_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Global error logger
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API call failed:', error.response?.status, error.response?.data || error.message)
    return Promise.reject(error)
  }
)

export default apiClient
