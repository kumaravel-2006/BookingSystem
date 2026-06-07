import React, { useState } from 'react';

const Checkout = ({ navigateTo, selectedEvent, selectedShowtime, selectedSeats, onPaymentSuccess }) => {
  if (!selectedEvent || !selectedShowtime || !selectedSeats || selectedSeats.length === 0) {
    return (
      <div className="placeholder-page">
        <h2>No Items in Cart</h2>
        <button className="btn-primary" onClick={() => navigateTo('home')}>Go to Home</button>
      </div>
    );
  }

  // Invoice calculations
  const basePrice = selectedEvent.ticketPrice * selectedSeats.length;
  const bookingFee = 1.50 * selectedSeats.length;
  const taxRate = 0.08;
  const taxFee = basePrice * taxRate;

  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [promoStatus, setPromoStatus] = useState(''); // '', 'valid', 'invalid'

  // Payment Form inputs
  const [email, setEmail] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);

  const applyPromoCode = () => {
    if (promoCode.toUpperCase() === 'CINEPASS20' || promoCode.toUpperCase() === 'WELCOME10') {
      const rate = promoCode.toUpperCase() === 'CINEPASS20' ? 0.20 : 0.10;
      setDiscount(basePrice * rate);
      setPromoStatus('valid');
    } else {
      setDiscount(0);
      setPromoStatus('invalid');
    }
  };

  const grandTotal = basePrice + bookingFee + taxFee - discount;

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setProcessingStep(1); // 'Verifying payment details...'

    // Simulation steps
    setTimeout(() => {
      setProcessingStep(2); // 'Securing tickets...'
      setTimeout(() => {
        setProcessingStep(3); // 'Success!'
        setTimeout(() => {
          onPaymentSuccess({
            bookingId: `CP-${Math.floor(100000 + Math.random() * 900000)}`,
            totalPaid: grandTotal,
            discountApplied: discount,
            selectedSeats: selectedSeats
          });
          navigateTo('booking-success');
        }, 800);
      }, 1000);
    }, 1200);
  };

  return (
    <div style={{ padding: '3rem 0', textAlign: 'left' }}>
      <button 
        className="btn-outline" 
        onClick={() => navigateTo('seat-selection')} 
        style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <line x1="19" x2="5" y1="12" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
        Modify Seats
      </button>

      <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Checkout Details</h1>

      {isProcessing ? (
        <div className="glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
            {/* Spinning Indicator */}
            <div style={{
              width: '4rem',
              height: '4rem',
              borderRadius: '50%',
              border: '4px solid var(--border-color)',
              borderTopColor: 'var(--primary)',
              animation: 'spin 1s linear infinite'
            }} />
          </div>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
          
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
            {processingStep === 1 && 'Authorizing Credit Card...'}
            {processingStep === 2 && 'Reserving Seat Allocations...'}
            {processingStep === 3 && 'Finalizing Ticket Purchase!'}
          </h2>
          <p style={{ color: 'var(--text-muted)' }}>Do not close this window or click refresh.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '2.5rem' }}>
          {/* Form Side */}
          <div style={{ flex: '2 2 500px' }}>
            <div className="glass-panel" style={{ padding: '2.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
                Secure Payment Details
              </h3>
              
              <form onSubmit={handlePaymentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text-main)' }}>Email Address</label>
                  <input 
                    type="email" 
                    className="search-input" 
                    placeholder="receipts@example.com" 
                    style={{ paddingLeft: '1rem' }} 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text-main)' }}>Name on Card</label>
                  <input 
                    type="text" 
                    className="search-input" 
                    placeholder="John Doe" 
                    style={{ paddingLeft: '1rem' }} 
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    required 
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text-main)' }}>Credit Card Number</label>
                  <input 
                    type="text" 
                    className="search-input" 
                    placeholder="1234 5678 1234 5678" 
                    style={{ paddingLeft: '1rem' }} 
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    maxLength="19"
                    required 
                  />
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text-main)' }}>Expiration (MM/YY)</label>
                    <input 
                      type="text" 
                      className="search-input" 
                      placeholder="12/28" 
                      style={{ paddingLeft: '1rem' }} 
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      maxLength="5"
                      required 
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text-main)' }}>CVV Code</label>
                    <input 
                      type="password" 
                      className="search-input" 
                      placeholder="•••" 
                      style={{ paddingLeft: '1rem' }} 
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      maxLength="3"
                      required 
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem', background: 'rgba(255,255,255,0.02)', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: 'var(--secondary)' }}>
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Payments are encrypted securely under 256-bit SSL encryption.
                  </span>
                </div>

                <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.8rem', fontSize: '1rem', marginTop: '0.5rem' }}>
                  Authorize & Pay ${(grandTotal).toFixed(2)}
                </button>
              </form>
            </div>
          </div>

          {/* Bill Summary Side */}
          <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Show Details Summary */}
            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <h4 style={{ color: 'var(--text-bright)', marginBottom: '1rem' }}>Showtime Information</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem' }}>
                <div>Event: <strong style={{ color: 'var(--text-bright)' }}>{selectedEvent.title}</strong></div>
                <div>Venue: <strong>Grand Regal Cinemas</strong></div>
                <div>Showtime: <strong>{selectedShowtime.date} @ {selectedShowtime.time}</strong></div>
                <div>Seats Reserved: <strong style={{ color: 'var(--secondary)' }}>{selectedSeats.join(', ')}</strong></div>
              </div>
            </div>

            {/* Bill Summary Breakdown */}
            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <h4 style={{ color: 'var(--text-bright)', marginBottom: '1rem' }}>Order Invoice Breakdown</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1rem' }}>
                
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Tickets ({selectedSeats.length} x ${selectedEvent.ticketPrice.toFixed(2)})</span>
                  <span style={{ color: 'var(--text-bright)' }}>${basePrice.toFixed(2)}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Convenience Service Fee</span>
                  <span style={{ color: 'var(--text-bright)' }}>${bookingFee.toFixed(2)}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Sales Tax (8%)</span>
                  <span style={{ color: 'var(--text-bright)' }}>${taxFee.toFixed(2)}</span>
                </div>

                {discount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#f87171' }}>Coupon Discount ({promoCode.toUpperCase()})</span>
                    <span style={{ color: '#f87171' }}>-${discount.toFixed(2)}</span>
                  </div>
                )}
              </div>

              {/* Promo Code Input */}
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <input 
                  type="text" 
                  className="search-input" 
                  placeholder="Coupon (e.g. CINEPASS20)" 
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }} 
                />
                <button 
                  type="button" 
                  className="btn-outline" 
                  onClick={applyPromoCode}
                  style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                >
                  Apply
                </button>
              </div>

              {promoStatus === 'valid' && (
                <div style={{ fontSize: '0.8rem', color: '#4ade80', marginBottom: '1rem', fontWeight: 600 }}>
                  ✓ Promo applied successfully! Saved 20% on tickets.
                </div>
              )}
              {promoStatus === 'invalid' && (
                <div style={{ fontSize: '0.8rem', color: '#f87171', marginBottom: '1rem', fontWeight: 600 }}>
                  ✗ Invalid promo code. Try CINEPASS20.
                </div>
              )}

              {/* Grand Total */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-bright)' }}>Total Invoice Due</span>
                <span style={{ fontSize: '1.75rem', fontWeight: '900', color: 'var(--secondary)' }}>
                  ${grandTotal.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
