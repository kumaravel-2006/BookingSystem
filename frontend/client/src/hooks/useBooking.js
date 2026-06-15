import { useState } from 'react';
import { bookingService } from '../services/bookingService';
import { useNotifications } from '../context/NotificationContext';

export function useBooking() {
    const [loading, setLoading] = useState(false)
    const { addNotification } = useNotifications()

    const lockSeats = async (eventId, seatId) => {
        try {
            setLoading(true)
            const result = await bookingService.lockSeats(eventId, seatId)
            addNotification('Seats Locked Successfully!', 'success')
            return result;
        }
        catch (err) {
            addNotification('Failed to lock seats', 'error')
            return null;
        }
        finally {
            setLoading(false)
        }
    }

    const confirmBooking = async (bookingId, paymentDetails) => {
        try {
            setLoading(true)
            const result = await bookingService.confirmBooking(bookingId, paymentDetails)
            addNotification('Booking confirmed successfully', 'success')
            return result
        }
        catch (err) {
            addNotification('Booking failed', 'error')
            return null
        }
        finally {
            setLoading(false)
        }
    }
    return { loading, lockSeats, confirmBooking }

}