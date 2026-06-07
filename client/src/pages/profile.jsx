import React from 'react';

const Profile = ({ navigateTo, user, setUser }) => {
  const handleLogout = () => {
    setUser(null);
    navigateTo('home');
  };

  const activeUser = user || { name: 'Guest User', email: 'guest@cinepass.com' };

  return (
    <div className="placeholder-page">
      <div className="glass-panel" style={{ padding: '3rem 2.5rem', width: '100%', maxWidth: '500px', textAlign: 'center' }}>
        <div style={{ 
          width: '5rem', 
          height: '5rem', 
          borderRadius: '50%', 
          background: 'var(--primary-glow)', 
          border: '2px solid var(--primary)', 
          color: 'var(--primary-hover)',
          fontSize: '2rem',
          fontWeight: '700',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          margin: '0 auto 1.5rem'
        }}>
          {activeUser.name.charAt(0).toUpperCase()}
        </div>
        
        <h2 style={{ margin: '0 0 0.25rem 0', color: 'var(--text-bright)' }}>{activeUser.name}</h2>
        <p style={{ margin: '0 0 2rem 0', color: 'var(--text-muted)' }}>{activeUser.email}</p>

        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', textAlign: 'left', marginBottom: '2rem' }}>
          <h4 style={{ color: 'var(--text-bright)', marginBottom: '0.75rem' }}>Account Details</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Membership Status:</span>
              <span style={{ color: 'var(--secondary)', fontWeight: '600' }}>CinePass Gold</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Rewards Points:</span>
              <span style={{ color: 'var(--text-bright)', fontWeight: '600' }}>450 pts</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn-outline" onClick={handleLogout} style={{ flex: 1 }}>
            Sign Out
          </button>
          <button className="btn-primary" onClick={() => navigateTo('bookings')} style={{ flex: 1, justifyContent: 'center' }}>
            My Tickets
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
