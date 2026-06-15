import axios from 'axios'
import { getToken } from '../utils/jwtUtils'

const eventApi = axios.create({
  baseURL: 'http://localhost:8081'
})

eventApi.interceptors.request.use((config) => {
  const token = getToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

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