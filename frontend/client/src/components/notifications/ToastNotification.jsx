import React, { useEffect } from 'react';

const ToastNotification = ({ message, type = 'info', show, onClose, duration = 3000 }) => {
  useEffect(() => {
    if (show && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  if (!show) return null;

  // Colors based on notification type
  const typeConfig = {
    success: {
      border: '1px solid #10b981',
      background: 'rgba(16, 185, 129, 0.15)',
      color: '#34d399',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      )
    },
    error: {
      border: '1px solid #ef4444',
      background: 'rgba(239, 68, 68, 0.15)',
      color: '#f87171',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <circle cx="12" cy="12" r="10" />
          <line x1="15" x2="9" y1="9" y2="15" />
          <line x1="9" x2="15" y1="9" y2="15" />
        </svg>
      )
    },
    info: {
      border: '1px solid var(--primary)',
      background: 'rgba(168, 85, 247, 0.15)',
      color: 'var(--primary-hover)',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" x2="12" y1="16" y2="12" />
          <line x1="12" x2="12.01" y1="8" y2="8" />
        </svg>
      )
    },
    warning: {
      border: '1px solid #f59e0b',
      background: 'rgba(245, 158, 11, 0.15)',
      color: '#fbbf24',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
          <line x1="12" x2="12" y1="9" y2="13" />
          <line x1="12" x2="12.01" y1="17" y2="17" />
        </svg>
      )
    }
  };

  const config = typeConfig[type] || typeConfig.info;

  return (
    <div style={{
      position: 'fixed',
      top: '1.5rem',
      right: '1.5rem',
      zIndex: 3000,
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '1rem 1.5rem',
      borderRadius: '12px',
      border: config.border,
      background: config.background,
      backdropFilter: 'blur(12px)',
      boxShadow: 'var(--shadow-md)',
      color: config.color,
      animation: 'slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
    }}>
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>

      {config.icon}
      
      <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-bright)' }}>
        {message}
      </span>

      <button 
        onClick={onClose}
        style={{
          background: 'transparent',
          border: 'none',
          color: 'inherit',
          padding: 0,
          cursor: 'pointer',
          marginLeft: '0.5rem',
          display: 'flex',
          alignItems: 'center',
          opacity: 0.7
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <line x1="18" x2="6" y1="6" y2="18" />
          <line x1="6" x2="18" y1="6" y2="18" />
        </svg>
      </button>
    </div>
  );
};

export default ToastNotification;
