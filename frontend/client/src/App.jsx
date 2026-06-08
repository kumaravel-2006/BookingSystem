import { useState } from 'react';
import './App.css';

// Import new modular page components
import Home from './pages/home/Home';
import EventList from './pages/events/EventList';
import EventDetails from './pages/events/EventDetails';
import SeatSelection from './pages/booking/SeatSelection';
import Checkout from './pages/booking/Checkout';
import BookingSuccess from './pages/booking/BookingSuccess';
import WaitingQueue from './pages/queue/WaitingQueue';
import MyBookings from './pages/profile/MyBookings';
import Theatres from './pages/theatres';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';

// Import modular layouts and shared components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ToastNotification from './components/notifications/ToastNotification';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [activeCity, setActiveCity] = useState('New York');
  const [user, setUser] = useState(null); // Simulated user session

  // Dynamic booking transaction states
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [lastBookingDetails, setLastBookingDetails] = useState(null);
  const [sessionBookings, setSessionBookings] = useState([]);

  // Toast notification state
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });

  const triggerToast = (message, type = 'info') => {
    setToast({ show: true, message, type });
  };

  // Helper function to handle page switching
  const navigateTo = (pageName) => {
    setCurrentPage(pageName);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Render active page component
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <Home 
            navigateTo={navigateTo} 
            activeCity={activeCity} 
            onSelectEvent={setSelectedEvent} 
          />
        );
      case 'movies':
        return (
          <EventList 
            navigateTo={navigateTo} 
            onSelectEvent={setSelectedEvent} 
          />
        );
      case 'event-details':
        return (
          <EventDetails 
            navigateTo={navigateTo} 
            selectedEvent={selectedEvent} 
            onSelectShowtime={setSelectedShowtime} 
          />
        );
      case 'waiting-queue':
        return (
          <WaitingQueue 
            navigateTo={navigateTo} 
            selectedEvent={selectedEvent} 
          />
        );
      case 'seat-selection':
        return (
          <SeatSelection 
            navigateTo={navigateTo} 
            selectedEvent={selectedEvent} 
            selectedShowtime={selectedShowtime} 
            onConfirmSeats={setSelectedSeats} 
          />
        );
      case 'checkout':
        return (
          <Checkout 
            navigateTo={navigateTo} 
            selectedEvent={selectedEvent} 
            selectedShowtime={selectedShowtime} 
            selectedSeats={selectedSeats}
            triggerToast={triggerToast}
            onPaymentSuccess={(details) => {
              setLastBookingDetails(details);
              setSessionBookings(prev => [
                {
                  bookingId: details.bookingId,
                  movieTitle: selectedEvent.title,
                  date: selectedShowtime.date,
                  time: selectedShowtime.time,
                  seats: details.selectedSeats,
                  totalPaid: details.totalPaid,
                  status: 'upcoming'
                },
                ...prev
              ]);
              triggerToast('Tickets booked successfully!', 'success');
            }}
          />
        );
      case 'booking-success':
        return (
          <BookingSuccess 
            navigateTo={navigateTo} 
            selectedEvent={selectedEvent} 
            selectedShowtime={selectedShowtime} 
            selectedSeats={selectedSeats} 
            lastBookingDetails={lastBookingDetails}
          />
        );
      case 'theatres':
        return (
          <Theatres 
            navigateTo={navigateTo} 
            activeCity={activeCity} 
          />
        );
      case 'bookings':
      case 'profile':
        return (
          <MyBookings 
            navigateTo={navigateTo} 
            user={user} 
            setUser={(val) => {
              setUser(val);
              if (!val) triggerToast('Signed out successfully', 'info');
            }} 
            sessionBookings={sessionBookings}
            onCancelSessionBooking={(bookingId) => {
              setSessionBookings(prev => 
                prev.map(sb => sb.bookingId === bookingId ? { ...sb, status: 'cancelled' } : sb)
              );
              triggerToast('Booking cancelled successfully', 'info');
            }}
          />
        );
      case 'login':
        return (
          <Login 
            navigateTo={navigateTo} 
            setUser={(val) => {
              setUser(val);
              if (val) triggerToast(`Welcome back, ${val.name}!`, 'success');
            }} 
          />
        );
      case 'register':
        return (
          <Register 
            navigateTo={navigateTo} 
            setUser={(val) => {
              setUser(val);
              if (val) triggerToast('Registration complete!', 'success');
            }} 
          />
        );
      case 'forgot-password':
        return (
          <ForgotPassword 
            navigateTo={navigateTo} 
          />
        );
      default:
        return (
          <Home 
            navigateTo={navigateTo} 
            activeCity={activeCity} 
            onSelectEvent={setSelectedEvent} 
          />
        );
    }
  };

  return (
    <div className="app-root">
      {/* Navbar Component */}
      <Navbar 
        currentPage={currentPage}
        navigateTo={navigateTo}
        activeCity={activeCity}
        setActiveCity={setActiveCity}
        user={user}
      />

      {/* Main Content Area */}
      <main className="app-container">
        {renderPage()}
      </main>

      {/* Footer Component */}
      <Footer navigateTo={navigateTo} />

      {/* Toast Notification popup */}
      <ToastNotification 
        message={toast.message}
        type={toast.type}
        show={toast.show}
        onClose={() => setToast(prev => ({ ...prev, show: false }))}
      />
    </div>
  );
}

export default App;


