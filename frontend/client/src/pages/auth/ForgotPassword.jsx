import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom'
import { authService } from '../../services/authService'

const ForgotPassword = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await authService.forgotPassword(email)
      setIsSubmitted(true)
    } catch (err) {
      alert('Failed to send reset email. Please try again.')
    }
  }

  return (
    <div className="placeholder-page">
      <div className="glass-panel" style={{ padding: '3rem 2.5rem', width: '100%', maxWidth: '420px', textAlign: 'left' }}>
        {!isSubmitted ? (
          <>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem', color: 'var(--text-bright)' }}>Reset Password</h2>
            <p style={{ fontSize: '0.9rem', marginBottom: '2rem', color: 'var(--text-muted)' }}>Enter your email address and we'll send you a link to reset your password.</p>

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

              <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem', padding: '0.75rem' }}>
                Send Reset Link
              </button>
            </form>

            <div style={{ marginTop: '1.5rem', fontSize: '0.85rem', textAlign: 'center' }}>
              <a href="#login" onClick={(e) => { e.preventDefault(); navigate('/login'); }} style={{ fontWeight: '600', color: 'var(--text-muted)' }}>
                Back to Sign In
              </a>
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '4rem',
              height: '4rem',
              borderRadius: '50%',
              background: 'var(--secondary-glow)',
              color: 'var(--secondary)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              margin: '0 auto 1.5rem',
              border: '2px solid var(--secondary)'
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="m22 2-7 20-4-9-9-4Z" />
                <path d="M22 2 11 13" />
              </svg>
            </div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--text-bright)' }}>Reset Link Sent</h2>
            <p style={{ fontSize: '0.9rem', marginBottom: '2rem', color: 'var(--text-muted)' }}>
              An email has been sent to <strong>{email}</strong> with instructions to reset your password. Please check your inbox.
            </p>
            <div className="glass-panel" style={{ padding: '1rem', marginBottom: '2rem', fontSize: '0.85rem', borderStyle: 'dashed', borderColor: 'var(--secondary)' }}>
              <span>Temporary Verification Code: </span>
              <strong style={{ color: 'var(--secondary)', letterSpacing: '2px', fontSize: '1.1rem' }}>CP-RST99</strong>
            </div>
            <button className="btn-primary" onClick={() => navigate('/login')} style={{ width: '100%', justifyContent: 'center' }}>
              Return to Sign In
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
