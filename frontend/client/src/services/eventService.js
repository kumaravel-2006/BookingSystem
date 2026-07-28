import axios from 'axios'
import { getToken, removeToken } from '../utils/jwtUtils'

const eventApi = axios.create({
  baseURL: 'http://localhost:8081'
})

eventApi.interceptors.request.use((config) => {
  const token = getToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

eventApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      removeToken()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const eventService = {
  getEvents: async (params = {}) => {
    const res = await eventApi.get('/events', { params })
    return res.data
  },
  getEventById: async (id) => {
    const res = await eventApi.get(`/events/${id}`)
    return res.data
  },
  getSeatMap: async (eventId) => {
    const res = await eventApi.get(`/events/${eventId}/seats`)
    return res.data
  }
}