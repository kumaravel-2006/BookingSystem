import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import './App.css';

import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import EventForm from './pages/EventForm';
import SeatGenerator from './pages/SeatGenerator';

// Protected Route Component to restrict access to logged-in Event Managers
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function AppContent() {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="app-container">
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Manager routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/events/new" element={
            <ProtectedRoute>
              <EventForm />
            </ProtectedRoute>
          } />

          <Route path="/events/:id/edit" element={
            <ProtectedRoute>
              <EventForm />
            </ProtectedRoute>
          } />

          <Route path="/events/:id/seats" element={
            <ProtectedRoute>
              <SeatGenerator />
            </ProtectedRoute>
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
