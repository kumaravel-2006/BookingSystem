import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await register(name, email, password)
      navigate('/')
    } catch (err) {
      alert('Registration failed. Please try again.')
    }
  }

  return (
    <div className="placeholder-page">
      <div className="glass-panel" style={{ padding: '3rem 2.5rem', width: '100%', maxWidth: '420px', textAlign: 'left' }}>
        <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem', color: 'var(--text-bright)' }}>Join CinePass</h2>
        <p style={{ fontSize: '0.9rem', marginBottom: '2rem', color: 'var(--text-muted)' }}>Get early access to movie tickets, deals, and points.</p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text-main)' }}>Full Name</label>
            <input
              type="text"
              className="search-input"
              placeholder="John Doe"
              style={{ paddingLeft: '1rem' }}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

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
            Create Account
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', fontSize: '0.85rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <a href="#login" onClick={(e) => { e.preventDefault(); navigate('/login'); }} style={{ fontWeight: '600' }}>
            Sign In
          </a>
        </div>
      </div>
    </div>
  );
};

export default Register;
