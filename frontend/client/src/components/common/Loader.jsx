import React from 'react';

const Loader = ({ fullScreen = false, text = 'Loading...' }) => {
  const loaderStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '2rem',
    textAlign: 'center',
    ...(fullScreen && {
      position: 'fixed',
      inset: 0,
      background: 'rgba(9, 9, 14, 0.95)',
      backdropFilter: 'blur(12px)',
      zIndex: 2000
    })
  };

  return (
    <div style={loaderStyle}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
        <div style={{
          width: '3.5rem',
          height: '3.5rem',
          borderRadius: '50%',
          border: '4px solid var(--border-color)',
          borderTopColor: 'var(--primary)',
          animation: 'spin 1s linear infinite'
        }} />
      </div>
      
      {/* Dynamic Keyframes injected globally */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}} />
      
      <h3 style={{ fontSize: '1.25rem', margin: 0, color: 'var(--text-bright)' }}>{text}</h3>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.5rem', marginBottom: 0 }}>
        Do not close this window or click refresh.
      </p>
    </div>
  );
};

export default Loader;
