function OrderSuccess({ orderId, onClose }) {
  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <p style={styles.icon}>✅</p>
        <h2 style={styles.title}>Order Placed!</h2>
        <p style={styles.sub}>Thank you for shopping at Lumière</p>

        <div style={styles.orderIdBox}>
          <p style={styles.orderIdLabel}>Your Order ID</p>
          <p style={styles.orderId}>{orderId}</p>
          <p style={styles.orderIdHint}>Save this to track your order</p>
        </div>

        <button style={styles.trackBtn} onClick={() => {
          onClose()
          window.location.hash = '#track'
        }}>
          Track My Order
        </button>

        <button style={styles.closeBtn} onClick={onClose}>
          Continue Shopping
        </button>
      </div>
    </div>
  )
}

const styles = {
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' },
  modal: { backgroundColor: '#ffffff', padding: '2.5rem 2rem', textAlign: 'center', maxWidth: '360px', width: '100%' },
  icon: { fontSize: '48px', marginBottom: '1rem' },
  title: { fontSize: '20px', fontWeight: '500', marginBottom: '0.5rem', letterSpacing: '-0.5px' },
  sub: { fontSize: '14px', color: '#888', marginBottom: '1.5rem' },
  orderIdBox: { backgroundColor: '#f5f5f3', padding: '1rem', marginBottom: '1.5rem', border: '1px solid #e5e5e5' },
  orderIdLabel: { fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: '#888', marginBottom: '6px' },
  orderId: { fontSize: '22px', fontWeight: '600', letterSpacing: '2px', color: '#1a1a1a', marginBottom: '4px' },
  orderIdHint: { fontSize: '11px', color: '#aaa' },
  trackBtn: { width: '100%', padding: '12px', backgroundColor: '#1a1a1a', color: '#ffffff', border: 'none', fontSize: '13px', letterSpacing: '1px', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit', marginBottom: '10px' },
  closeBtn: { width: '100%', padding: '12px', backgroundColor: 'transparent', color: '#555', border: '1px solid #e5e5e5', fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit' },
}

export default OrderSuccess