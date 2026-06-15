import { create } from 'zustand';

export const useBookingStore = create((set) => ({
  // state
  selectedSeats: [],
  lockedBookingId: null,
  lockExpiresAt: null,

  // actions
  addSeat: (seat) => set((state) => ({
    selectedSeats: state.selectedSeats.length < 6 ? [...state.selectedSeats, seat] : state.selectedSeats,
  })),

  removeSeat: (seatId) => set((state) => ({
    selectedSeats: state.selectedSeats.filter(seat => seat.id !== seatId)
  })),

  clearSeats: () => set({ selectedSeats: [] }),

  setLock: (bookingId, expiresAt) => set({ lockedBookingId: bookingId, lockExpiresAt: expiresAt }),

  clearBooking: () => set({ selectedSeats: [], lockedBookingId: null, lockExpiresAt: null }),

}))