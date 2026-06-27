import axios from 'axios'
import { getToken } from '../utils/jwtUtils'

const bookingApi = axios.create({
  baseURL: 'http://localhost:8082'
})

bookingApi.interceptors.request.use((config) => {
  const token = getToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

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