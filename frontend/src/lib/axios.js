import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3001',
  withCredentials: true,
})

// Unwrap { data: payload } → payload ; normalize errors
api.interceptors.response.use(
  (res) => res.data?.data ?? res.data,
  (err) => {
    const message = err.response?.data?.message ?? err.message ?? 'Erreur serveur'
    const code    = err.response?.data?.error
    const status  = err.response?.status
    return Promise.reject(Object.assign(new Error(message), { code, status }))
  }
)

export default api
