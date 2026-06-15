import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx'
import { useNavigate } from 'react-router-dom'


const Login = () => {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await login(email, password)
      navigate('/')
    } catch (err) {
      alert('Login failed. Check your credentials.')
    }
  }

  return (
    <div className="placeholder-page">
      <div className="glass-panel" style={{ padding: '3rem 2.5rem', width: '100%', maxWidth: '420px', textAlign: 'left' }}>
        <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem', color: 'var(--text-bright)' }}>Welcome Back</h2>
        <p style={{ fontSize: '0.9rem', marginBottom: '2rem', color: 'var(--text-muted)' }}>Sign in to book tickets, manage reservations, and earn points.</p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text-main)' }}>Email Address</label>
            <input
              type="email"
              className="search-input"
              placeholder="name@example.com"
              style={{ paddingLeft: '1rem' }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text-main)' }}>Password</label>
            <input
              type="password"
              className="search-input"
              placeholder="••••••••"
              style={{ paddingLeft: '1rem' }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem', padding: '0.75rem' }}>
            Sign In
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', fontSize: '0.85rem', textAlign: 'center', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div>
            Don't have an account?{' '}
            <a href="#register" onClick={(e) => { e.preventDefault(); navigate('/register'); }} style={{ fontWeight: '600' }}>
              Sign Up
            </a>
          </div>
          <div>
            <a href="#forgot-password" onClick={(e) => { e.preventDefault(); navigate('/forgot-password'); }} style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
              Forgot Password?
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
