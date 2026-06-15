import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { queueService } from '../../services/queueService'
import { useQueueStore } from '../../store/queueSlice'
import { useWebSocket } from '../../hooks/useWebSocket'
import { useAuth } from '../../hooks/useAuth'

const WaitingQueue = () => {
  const { eventId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { queuePosition, estimatedWaitMinutes, isInQueue, setQueueStatus, clearQueue } = useQueueStore()

  useEffect(() => {
    const joinQueue = async () => {
      try {
        const status = await queueService.joinQueue(eventId)
        setQueueStatus(status.position, status.estimatedWaitMinutes)
      } catch (err) {
        console.error('Failed to join queue')
      }
    }
    joinQueue()
    return () => {
      queueService.leaveQueue(eventId)
      clearQueue()
    }
  }, [eventId])

  // Live queue updates via WebSocket
  useWebSocket(`/topic/queue/${user?.sub}`, (payload) => {
    if (payload.type === 'QUEUE_UPDATED') {
      setQueueStatus(payload.position, payload.estimatedWaitMinutes)
    }
    if (payload.type === 'SEAT_ALLOCATED') {
      navigate(`/events/${eventId}/seats`)
    }
  })

  const handleLeaveQueue = async () => {
    await queueService.leaveQueue(eventId)
    clearQueue()
    navigate('/')
  }

  return (
    <div className="placeholder-page">
      <div className="glass-panel" style={{ padding: '3.5rem 3rem', width: '100%', maxWidth: '520px', textAlign: 'center' }}>

        {/* Visual Queue status icon */}
        <div style={{ position: 'relative', width: '80px', height: '80px', margin: '0 auto 2rem' }}>
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
              75%, 100% { transform: scale(1.4); opacity: 0; }
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

        <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem', color: 'var(--text-bright)' }}>You're in the Queue</h2>
        <p style={{ fontSize: '0.925rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
          We'll redirect you automatically when seats become available.
        </p>

        {/* Queue Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem', padding: '1.25rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Queue Position</span>
            <strong style={{ fontSize: '1.75rem', color: 'var(--secondary)' }}>
              #{queuePosition ?? '...'}
            </strong>
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Estimated Wait</span>
            <strong style={{ fontSize: '1.75rem', color: 'var(--text-bright)' }}>
              {estimatedWaitMinutes != null ? `~${estimatedWaitMinutes}m` : '...'}
            </strong>
          </div>
        </div>

        {/* Live indicator */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4ade80', display: 'inline-block', animation: 'ping 1.5s infinite' }} />
          Live updates enabled
        </div>

        <button
          onClick={handleLeaveQueue}
          className="btn-outline"
          style={{ color: '#f87171', borderColor: 'rgba(239,68,68,0.3)' }}
        >
          Leave Queue
        </button>
      </div>
    </div>
  )
}

export default WaitingQueue