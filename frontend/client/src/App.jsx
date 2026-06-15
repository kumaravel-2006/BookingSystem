import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import { NotificationProvider } from './context/NotificationContext'
import './App.css'

import Home from './pages/home/Home'
import EventList from './pages/events/EventList'
import EventDetails from './pages/events/EventDetails'
import SeatSelection from './pages/booking/SeatSelection'
import Checkout from './pages/booking/Checkout'
import BookingSuccess from './pages/booking/BookingSuccess'
import WaitingQueue from './pages/queue/WaitingQueue'
import MyBookings from './pages/profile/MyBookings'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ForgotPassword from './pages/auth/ForgotPassword'

import Navbar from './components/common/Navbar'
import Footer from './components/common/Footer'
import ToastNotification from './components/notifications/ToastNotification'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <Navbar />
          <main className="app-container">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Home />} />
              <Route path="/events" element={<EventList />} />
              <Route path="/events/:id" element={<EventDetails />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />

              {/* Protected routes */}
              <Route path="/events/:id/seats" element={<SeatSelection />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/booking-success" element={<BookingSuccess />} />
              <Route path="/queue/:eventId" element={<WaitingQueue />} />
              <Route path="/my-bookings" element={<MyBookings />} />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
          <ToastNotification />
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App