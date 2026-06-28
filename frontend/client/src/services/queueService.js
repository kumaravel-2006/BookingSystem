import axios from 'axios'
import { getToken } from '../utils/jwtUtils'

const queueApi = axios.create({
  baseURL: 'http://localhost:8083'
})

queueApi.interceptors.request.use((config) => {
  const token = getToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

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