import axios from 'axios'
import { getToken, removeToken } from '../utils/jwtUtils'

const bookingApi = axios.create({
  baseURL: 'https://cinepassapi.kumaravel.online'
})

bookingApi.interceptors.request.use((config) => {
  const token = getToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

bookingApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      removeToken()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

const lockSeats = async (eventId, seatIds, totalAmount) => {
  const res = await bookingApi.post('/bookings/lock', { eventId, seatIds, totalAmount })
  return res.data
}

const confirmBooking = async (bookingId, paymentDetails) => {
  const res = await bookingApi.post('/bookings/confirm', { bookingId, ...paymentDetails })
  return res.data
}

const getMyBookings = async () => {
  const res = await bookingApi.get('/bookings')
  return res.data
}

const getBookingById = async (id) => {
  const res = await bookingApi.get(`/bookings/${id}`)
  return res.data
}

const cancelBooking = async (id) => {
  const res = await bookingApi.delete(`/bookings/${id}`)
  return res.data
}

const getSeatStatus = async (eventId, seatId) => {
  const res = await bookingApi.get(`/seats/${eventId}/${seatId}/status`)
  return res.data
}

export const bookingService = {
  lockSeats,
  confirmBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
  getSeatStatus
}