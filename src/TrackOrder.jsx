import { useState } from 'react'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from './firebase'

function TrackOrder() {
  const [orderId, setOrderId] = useState('')
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleTrack() {
    if (!orderId.trim()) { setError('Please enter your order ID.'); return }
    setLoading(true)
    setError('')
    setOrder(null)

    try {
      const q = query(collection(db, 'orders'), where('orderId', '==', orderId.trim().toUpperCase()))
      const snapshot = await getDocs(q)

      if (snapshot.empty) {
        setError('No order found with this ID. Please check and try again.')
      } else {
        setOrder(snapshot.docs[0].data())
      }
    } catch (err) {
      setError('Something went wrong. Please try again.')
    }

    setLoading(false)
  }

  const statusSteps = ['Pending', 'Confirmed', 'Shipped', 'Delivered']

  return (
    <section style={styles.section} id="track">
      <p style={styles.eyebrow}>Order Tracking</p>
      <h2 style={styles.title}>Track Your Order</h2>
      <p style={styles.sub}>Enter your order ID to see the latest status</p>

      <div style={styles.searchBox}>
        <input
          style={styles.input}
          value={orderId}
          onChange={e => setOrderId(e.target.value)}
          placeholder="e.g. LUM123456"
          onKeyDown={e => e.key === 'Enter' && handleTrack()}
        />
        <button style={styles.trackBtn} onClick={handleTrack}>
          {loading ? '⏳' : 'Track'}
        </button>
      </div>

      {error && <p style={styles.error}>{error}</p>}

      {order && (
        <div style={styles.orderCard}>
          <div style={styles.orderHeader}>
            <div>
              <p style={styles.orderIdLabel}>Order ID</p>
              <p style={styles.orderId}>{order.orderId}</p>
            </div>
            <div style={styles.statusBadge}>
              {order.status}
            </div>
          </div>

          <div style={styles.progressBar}>
            {statusSteps.map((step, i) => {
              const currentIndex = statusSteps.indexOf(order.status)
              const isDone = i <= currentIndex
              return (
                <div key={step} style={styles.step}>
                  <div style={{
                    ...styles.stepDot,
                    backgroundColor: isDone ? '#1a1a1a' : '#e5e5e5',
                    border: isDone ? '2px solid #1a1a1a' : '2px solid #e5e5e5',
                  }} />
                  <p style={{
                    ...styles.stepLabel,
                    color: isDone ? '#1a1a1a' : '#aaa',
                    fontWeight: isDone ? '500' : '400',
                  }}>{step}</p>
                  {i < statusSteps.length - 1 && (
                    <div style={{
                      ...styles.stepLine,
                      backgroundColor: i < currentIndex ? '#1a1a1a' : '#e5e5e5',
                    }} />
                  )}
                </div>
              )
            })}
          </div>

          <div style={styles.details}>
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Customer</span>
              <span>{order.customer.name}</span>
            </div>
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Phone</span>
              <span>{order.customer.phone}</span>
            </div>
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Delivery To</span>
              <span>{order.customer.address}, {order.customer.city} - {order.customer.pincode}</span>
            </div>
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Payment</span>
              <span>{order.paymentMethod}</span>
            </div>
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Order Date</span>
              <span>{new Date(order.createdAt).toLocaleDateString('en-IN')}</span>
            </div>
          </div>

          <div style={styles.items}>
            <p style={styles.itemsTitle}>Items Ordered</p>
            {order.items.map((item, i) => (
              <div key={i} style={styles.item}>
                <span>{item.name} × {item.qty}</span>
                <span>₹{item.price * item.qty}</span>
              </div>
            ))}
            <div style={styles.itemTotal}>
              <span>Total</span>
              <span>₹{order.total}</span>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

const styles = {
  section: { padding: '4rem 2rem', backgroundColor: '#ffffff', textAlign: 'center', borderTop: '1px solid #e5e5e5' },
  eyebrow: { fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', color: '#888', marginBottom: '0.5rem' },
  title: { fontSize: '28px', fontWeight: '400', letterSpacing: '-0.5px', marginBottom: '0.5rem' },
  sub: { fontSize: '14px', color: '#888', marginBottom: '2rem' },
  searchBox: { display: 'flex', gap: '8px', maxWidth: '400px', margin: '0 auto 1rem auto' },
  input: { flex: 1, padding: '11px 16px', border: '1px solid #e5e5e5', fontSize: '13px', fontFamily: 'inherit', outline: 'none', textTransform: 'uppercase' },
  trackBtn: { padding: '11px 24px', backgroundColor: '#1a1a1a', color: '#ffffff', border: 'none', fontSize: '13px', letterSpacing: '1px', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit' },
  error: { fontSize: '13px', color: '#c0392b', marginBottom: '1rem' },
  orderCard: { maxWidth: '500px', margin: '0 auto', textAlign: 'left', border: '1px solid #e5e5e5', padding: '1.5rem' },
  orderHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' },
  orderIdLabel: { fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: '#888', marginBottom: '4px' },
  orderId: { fontSize: '20px', fontWeight: '600', letterSpacing: '1px' },
  statusBadge: { backgroundColor: '#1a1a1a', color: '#ffffff', padding: '6px 14px', fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase' },
  progressBar: { display: 'flex', alignItems: 'flex-start', marginBottom: '1.5rem', position: 'relative' },
  step: { display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, position: 'relative' },
  stepDot: { width: '14px', height: '14px', borderRadius: '50%', marginBottom: '6px', zIndex: 1 },
  stepLabel: { fontSize: '10px', letterSpacing: '0.5px', textTransform: 'uppercase', textAlign: 'center' },
  stepLine: { position: 'absolute', top: '7px', left: '50%', width: '100%', height: '2px', zIndex: 0 },
  details: { borderTop: '1px solid #e5e5e5', paddingTop: '1rem', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '8px' },
  detailRow: { display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#555' },
  detailLabel: { color: '#aaa', fontSize: '12px' },
  items: { borderTop: '1px solid #e5e5e5', paddingTop: '1rem' },
  itemsTitle: { fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: '#888', marginBottom: '10px' },
  item: { display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#555', marginBottom: '6px' },
  itemTotal: { display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: '500', borderTop: '1px solid #e5e5e5', paddingTop: '8px', marginTop: '8px' },
}

export default TrackOrder