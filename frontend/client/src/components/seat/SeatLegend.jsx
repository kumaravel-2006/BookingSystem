import React from 'react';

const SeatLegend = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '3rem', flexWrap: 'wrap' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
        <span style={{ width: '18px', height: '18px', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-main)' }} />
        <span style={{ color: 'var(--text-muted)' }}>Available</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
        <span style={{ width: '18px', height: '18px', borderRadius: '4px', background: 'var(--primary)' }} />
        <span style={{ color: 'var(--text-muted)' }}>Selected</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
        <span style={{ width: '18px', height: '18px', borderRadius: '4px', border: '1px solid rgba(239, 68, 68, 0.3)', background: 'rgba(239, 68, 68, 0.15)' }} />
        <span style={{ color: 'var(--text-muted)' }}>Reserved</span>
      </div>
    </div>
  );
};

export default SeatLegend;
