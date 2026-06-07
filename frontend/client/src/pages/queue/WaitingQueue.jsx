import React, { useState, useEffect } from 'react';

const WaitingQueue = ({ navigateTo, selectedEvent }) => {
  if (!selectedEvent) {
    return (
      <div className="placeholder-page">
        <h2>No Active Booking Session</h2>
        <button className="btn-primary" onClick={() => navigateTo('home')}>Go to Home</button>
      </div>
    );
  }

  const [progress, setProgress] = useState(0);
  const [queuePosition, setQueuePosition] = useState(348);
  const [secondsRemaining, setSecondsRemaining] = useState(5);

  useEffect(() => {
    // 5-second countdown & progress bar simulator
    const duration = 5000; // 5 seconds total
    const intervalTime = 100; // Tick every 100ms
    const steps = duration / intervalTime;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const currentProgress = Math.min((currentStep / steps) * 100, 100);
      setProgress(currentProgress);

      // Countdown seconds
      const secondsLeft = Math.max(5 - Math.floor((currentStep * intervalTime) / 1000), 0);
      setSecondsRemaining(secondsLeft);

      // Interpolate queue position down to 1
      const newPos = Math.max(Math.floor(348 - (currentProgress / 100) * 347), 1);
      setQueuePosition(newPos);

      if (currentStep >= steps) {
        clearInterval(timer);
        // Queue complete! Automatically route to seat selection
        setTimeout(() => {
          navigateTo('seat-selection');
        }, 600);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [navigateTo]);

  return (
    <div className="placeholder-page">
      <div className="glass-panel" style={{ padding: '3.5rem 3rem', width: '100%', maxWidth: '520px', textAlign: 'center' }}>
        
        {/* Visual Queue status icon */}
        <div style={{ position: 'relative', width: '80px', height: '80px', margin: '0 auto 2rem' }}>
          {/* Pulsing ring */}
          <div style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            border: '3px solid var(--primary)',
            animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite',
            opacity: 0.5
          }} />
          <style>{`
            @keyframes ping {
              75%, 100% {
                transform: scale(1.4);
                opacity: 0;
              }
            }
          `}</style>

          <div style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            background: 'var(--primary-glow)',
            border: '2px solid var(--primary)',
            color: 'var(--primary-hover)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
        </div>

        <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem', color: 'var(--text-bright)' }}>Queue Booking Session</h2>
        <p style={{ fontSize: '0.925rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
          Due to heavy traffic demand for <strong style={{ color: 'var(--text-bright)' }}>{selectedEvent.title}</strong>, you are in a temporary waiting room.
        </p>

        {/* Queue Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem', padding: '1.25rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Queue Position</span>
            <strong style={{ fontSize: '1.75rem', color: 'var(--secondary)' }}>#{queuePosition}</strong>
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Estimated Wait</span>
            <strong style={{ fontSize: '1.75rem', color: 'var(--text-bright)' }}>{secondsRemaining}s</strong>
          </div>
        </div>

        {/* Progress Bar Container */}
        <div style={{ background: 'rgba(255,255,255,0.05)', height: '8px', borderRadius: '4px', overflow: 'hidden', width: '100%', marginBottom: '1.5rem' }}>
          <div style={{ 
            background: 'linear-gradient(90deg, var(--primary), var(--secondary))', 
            height: '100%', 
            width: `${progress}%`,
            transition: 'width 0.1s linear'
          }} />
        </div>

        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          {queuePosition > 1 ? (
            <span>Securing checkout slot... Please do not close or navigate away.</span>
          ) : (
            <span style={{ color: 'var(--secondary)', fontWeight: '600' }}>Your turn has arrived! Redirecting to Seat Selection...</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default WaitingQueue;
