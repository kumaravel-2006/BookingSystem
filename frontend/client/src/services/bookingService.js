import api from './api';

const lockSeats = async (eventId, seatIds) => {
    const res = await api.post(`/bookings/lock`, { eventId, seatIds })
    return res.data
}
const confirmBooking = async (bookingId, paymentDetails) => {
    const res = await api.post('/bookings/confirm', { bookingId, paymentDetails })
    return res.data
}
const getMyBookings = async () => {
    const res = await api.get('/bookings')
    return res.data

}
const getBookingById = async (id) => {
    const res = await api.get(`/bookings/${id}`)
    return res.data
}

const cancelBooking = async (id) => {
    const res = await api.delete(`/bookings/${id}`)
    return res.data
}


export const bookingService = {
    lockSeats,
    confirmBooking,
    getMyBookings,
    getBookingById,
    cancelBooking
}