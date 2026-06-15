import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBookingStore } from '../../store/bookingSlice'
import { useBooking } from '../../hooks/useBooking'
import { useNotifications } from '../../context/NotificationContext'
import Loader from '../../components/common/Loader';

const Checkout = () => {
  const navigate = useNavigate()
  const { addNotification } = useNotifications()

  const { selectedSeats, lockedBookingId, lockExpiresAt, clearBooking } = useBookingStore()
  const { confirmBooking, loading } = useBooking()

  const [timeLeft, setTimeLeft] = useState(null)

  useEffect(() => {
    if (!lockExpiresAt) return
    const interval = setInterval(() => {
      const diff = Math.max(0, new Date(lockExpiresAt) - Date.now())
      setTimeLeft(Math.floor(diff / 1000))
      if (diff === 0) {
        clearBooking()
        navigate('/')
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [lockExpiresAt])

  // Invoice calculations
  const basePrice = selectedSeats.reduce((total, seat) => total + (seat.price ?? 0), 0)
  const bookingFee = 1.50 * selectedSeats.length
  const taxRate = 0.08
  const taxFee = basePrice * taxRate

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
      addNotification('Coupon discount applied!', 'success')

    } else {
      setDiscount(0);
      setPromoStatus('invalid');
      addNotification('Invalid promo code code', 'error');
    }
  };

  const grandTotal = basePrice + bookingFee + taxFee - discount;

  const handlePaymentSubmit = async (e) => {
    e.preventDefault()
    const result = await confirmBooking(lockedBookingId, {
      method: 'CARD',
      cardName,
      email
    })
    if (result) {
      clearBooking()
      navigate('/booking-success', { state: { booking: result } })
    }
  }

  const getLoaderText = () => {
    switch (processingStep) {
      case 1:
        return 'Authorizing Credit Card...';
      case 2:
        return 'Reserving Seat Allocations...';
      case 3:
        return 'Finalizing Ticket Purchase!';
      default:
        return 'Verifying Transaction...';
    }
  };


  if (!lockedBookingId) {
    navigate('/')
    return null
  }


  return (
    <div style={{ padding: '3rem 0', textAlign: 'left' }}>
      <button
        className="btn-outline"
        onClick={() => navigate(-1)}
        style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0.8rem', fontSize: '0.8rem', cursor: 'pointer' }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <line x1="19" x2="5" y1="12" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
        Modify Seats
      </button>

      <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Checkout Details</h1>

      {timeLeft !== null && (
        <div style={{ color: timeLeft < 60 ? '#f87171' : '#facc15', marginBottom: '1rem' }}>
          ⏱ Seats reserved for: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
        </div>
      )}

      {isProcessing ? (
        <div className="glass-panel" style={{ maxWidth: '600px', margin: '0 auto', border: '1px solid var(--border-color)', borderRadius: '16px', overflow: 'hidden' }}>
          <Loader text={getLoaderText()} />
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

                <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.8rem', fontSize: '1rem', marginTop: '0.5rem', cursor: 'pointer' }}>
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
                <div>Seats: <strong>{selectedSeats.length} seat(s)</strong></div>
                <div>Seats Reserved: <strong>{selectedSeats.map(s => s.id).join(', ')}</strong></div>
              </div>
            </div>

            {/* Bill Summary Breakdown */}
            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <h4 style={{ color: 'var(--text-bright)', marginBottom: '1rem' }}>Order Invoice Breakdown</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1rem' }}>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Tickets ({selectedSeats.length} seat(s))</span>
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
                  style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', cursor: 'pointer' }}
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
