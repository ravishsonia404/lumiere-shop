import { useState } from 'react'
import { collection, addDoc } from 'firebase/firestore'
import { db } from './firebase'

function CheckoutModal({ cart, total, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    pincode: '',
    paymentMethod: 'COD',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  async function handleOrder() {
    if (!formData.name.trim()) { setError('Please enter your name.'); return }
    if (!formData.phone.trim()) { setError('Please enter your phone number.'); return }
    if (!formData.address.trim()) { setError('Please enter your address.'); return }
    if (!formData.city.trim()) { setError('Please enter your city.'); return }
    if (!formData.pincode.trim()) { setError('Please enter your pincode.'); return }

    setLoading(true)
    setError('')

    try {
      const orderId = 'LUM' + Date.now().toString().slice(-6)

      const order = {
        orderId,
        customer: {
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim(),
          address: formData.address.trim(),
          city: formData.city.trim(),
          pincode: formData.pincode.trim(),
        },
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.salePrice || item.price,
          qty: item.qty,
        })),
        total,
        paymentMethod: formData.paymentMethod,
        status: 'Pending',
        createdAt: new Date().toISOString(),
      }

      await addDoc(collection(db, 'orders'), order)
      onSuccess(orderId)
    } catch (err) {
      setError('Something went wrong. Please try again.')
    }

    setLoading(false)
  }

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>

        <div style={styles.header}>
          <button style={styles.backBtn} onClick={onClose}>← Back</button>
          <h2 style={styles.title}>Checkout</h2>
        </div>

        <div style={styles.body}>

          <p style={styles.sectionTitle}>Delivery Details</p>

          {error && <p style={styles.error}>{error}</p>}

          <label style={styles.label}>Full Name *</label>
          <input style={styles.input} name="name" value={formData.name} onChange={handleChange} placeholder="Your full name" />

          <label style={styles.label}>Phone Number *</label>
          <input style={styles.input} name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="10-digit mobile number" />

          <label style={styles.label}>Email — optional</label>
          <input style={styles.input} name="email" type="email" value={formData.email} onChange={handleChange} placeholder="your@email.com" />

          <label style={styles.label}>Delivery Address *</label>
          <input style={styles.input} name="address" value={formData.address} onChange={handleChange} placeholder="House no, street, area" />

          <label style={styles.label}>City *</label>
          <input style={styles.input} name="city" value={formData.city} onChange={handleChange} placeholder="City" />

          <label style={styles.label}>Pincode *</label>
          <input style={styles.input} name="pincode" value={formData.pincode} onChange={handleChange} placeholder="6-digit pincode" />

          <p style={{ ...styles.sectionTitle, marginTop: '1.5rem' }}>Payment Method</p>

          <div style={styles.paymentOptions}>
            <label style={styles.paymentOption}>
              <input
                type="radio"
                name="paymentMethod"
                value="COD"
                checked={formData.paymentMethod === 'COD'}
                onChange={handleChange}
              />
              <span>Cash on Delivery</span>
            </label>
            <label style={styles.paymentOption}>
              <input
                type="radio"
                name="paymentMethod"
                value="UPI"
                checked={formData.paymentMethod === 'UPI'}
                onChange={handleChange}
              />
              <span>UPI / Online Payment</span>
            </label>
          </div>

          <div style={styles.orderSummary}>
            <p style={styles.sectionTitle}>Order Summary</p>
            {cart.map(item => (
              <div key={item.id} style={styles.summaryItem}>
                <span>{item.name} × {item.qty}</span>
                <span>₹{(item.salePrice || item.price) * item.qty}</span>
              </div>
            ))}
            <div style={styles.summaryTotal}>
              <span>Total</span>
              <span>₹{total}</span>
            </div>
          </div>

        </div>

        <div style={styles.footer}>
          <button
            style={{ ...styles.orderBtn, opacity: loading ? 0.7 : 1 }}
            onClick={handleOrder}
            disabled={loading}
          >
            {loading ? '⏳ Placing Order...' : '✓ Place Order'}
          </button>
        </div>

      </div>
    </div>
  )
}

const styles = {
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' },
  modal: { backgroundColor: '#ffffff', width: '100%', maxWidth: '480px', maxHeight: '90vh', overflowY: 'auto', display: 'flex', flexDirection: 'column' },
  header: { padding: '1rem 1.5rem', borderBottom: '1px solid #e5e5e5', display: 'flex', alignItems: 'center', gap: '1rem' },
  backBtn: { background: 'none', border: 'none', fontSize: '13px', color: '#888', cursor: 'pointer', fontFamily: 'inherit' },
  title: { fontSize: '14px', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: '500' },
  body: { padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '6px' },
  sectionTitle: { fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: '#888', marginBottom: '4px' },
  error: { fontSize: '12px', color: '#c0392b', backgroundColor: '#fdf0f0', padding: '8px 12px', border: '1px solid #f5c6cb' },
  label: { fontSize: '11px', color: '#888', marginTop: '8px' },
  input: { padding: '9px 12px', border: '1px solid #e5e5e5', fontSize: '13px', fontFamily: 'inherit', width: '100%', backgroundColor: '#fafafa', outline: 'none', boxSizing: 'border-box' },
  paymentOptions: { display: 'flex', flexDirection: 'column', gap: '10px', margin: '8px 0' },
  paymentOption: { display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', cursor: 'pointer' },
  orderSummary: { backgroundColor: '#f9f9f9', padding: '1rem', marginTop: '1rem', border: '1px solid #e5e5e5' },
  summaryItem: { display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#555', marginBottom: '6px' },
  summaryTotal: { display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: '500', borderTop: '1px solid #e5e5e5', paddingTop: '8px', marginTop: '8px' },
  footer: { padding: '1rem 1.5rem', borderTop: '1px solid #e5e5e5' },
  orderBtn: { width: '100%', padding: '13px', backgroundColor: '#1a1a1a', color: '#ffffff', border: 'none', fontSize: '13px', letterSpacing: '1px', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit' },
}

export default CheckoutModal