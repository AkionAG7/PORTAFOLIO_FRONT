import axios from 'axios'
import { getTokenCookie } from './cookies'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
})

api.interceptors.request.use((config) => {
  const token = getTokenCookie()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
