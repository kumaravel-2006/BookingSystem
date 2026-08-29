import axios from 'axios'
import { getToken, removeToken } from '../utils/jwtUtils'

const queueApi = axios.create({
  baseURL: 'https://cinepassapi.kumaravel.online'
})

queueApi.interceptors.request.use((config) => {
  const token = getToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

queueApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      removeToken()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

const joinQueue = async (eventId) => {
    const res = await queueApi.post('/queue/join', { eventId })
    return res.data
}

const leaveQueue = async (eventId) => {
    const res = await queueApi.post('/queue/leave', { eventId })
    return res.data
}

const getQueueStatus = async (eventId) => {
    const res = await queueApi.get('/queue/status', { params: { eventId } })
    return res.data
}

export const queueService = {
    joinQueue,
    leaveQueue,
    getQueueStatus
}