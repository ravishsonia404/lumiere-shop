import { useState, useEffect } from 'react'
import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore'
import { db } from './firebase'
import { useAdmin } from './AdminContext'

function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const { isAdmin } = useAdmin()

  useEffect(() => {
    if (!isAdmin) return
    const unsub = onSnapshot(collection(db, 'orders'), snapshot => {
      const data = snapshot.docs.map(d => ({ ...d.data(), docId: d.id }))
      data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      setOrders(data)
      setLoading(false)
    })
    return () => unsub()
  }, [isAdmin])

  async function updateStatus(docId, newStatus) {
    await updateDoc(doc(db, 'orders', docId), { status: newStatus })
  }

  if (!isAdmin) return null

  return (
    <section style={styles.section}>
      <p style={styles.eyebrow}>Admin Panel</p>
      <h2 style={styles.title}>All Orders</h2>

      {loading ? (
        <p style={styles.loading}>Loading orders...</p>
      ) : orders.length === 0 ? (
        <p style={styles.empty}>No orders yet.</p>
      ) : (
        <div style={styles.list}>
          {orders.map(order => (
            <div key={order.docId} style={styles.card}>
              <div style={styles.cardHeader}>
                <div>
                  <p style={styles.orderId}>{order.orderId}</p>
                  <p style={styles.date}>{new Date(order.createdAt).toLocaleDateString('en-IN')}</p>
                </div>
                <select
                  style={styles.statusSelect}
                  value={order.status}
                  onChange={e => updateStatus(order.docId, e.target.value)}
                >
                  <option>Pending</option>
                  <option>Confirmed</option>
                  <option>Shipped</option>
                  <option>Delivered</option>
                  <option>Cancelled</option>
                </select>
              </div>

              <div style={styles.customerInfo}>
                <p><strong>{order.customer.name}</strong> — {order.customer.phone}</p>
                <p style={styles.address}>{order.customer.address}, {order.customer.city} - {order.customer.pincode}</p>
              </div>

              <div style={styles.itemsList}>
                {order.items.map((item, i) => (
                  <div key={i} style={styles.item}>
                    <span>{item.name} × {item.qty}</span>
                    <span>₹{item.price * item.qty}</span>
                  </div>
                ))}
              </div>

              <div style={styles.cardFooter}>
                <span style={styles.payment}>{order.paymentMethod}</span>
                <span style={styles.total}>Total: ₹{order.total}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

const styles = {
  section: { padding: '3rem 2rem', backgroundColor: '#f5f5f3', borderTop: '1px solid #e5e5e5' },
  eyebrow: { fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', color: '#888', marginBottom: '0.5rem', textAlign: 'center' },
  title: { fontSize: '24px', fontWeight: '400', letterSpacing: '-0.5px', marginBottom: '2rem', textAlign: 'center' },
  loading: { textAlign: 'center', color: '#aaa', fontSize: '13px' },
  empty: { textAlign: 'center', color: '#aaa', fontSize: '13px' },
  list: { display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '700px', margin: '0 auto' },
  card: { backgroundColor: '#ffffff', border: '1px solid #e5e5e5', padding: '1.25rem' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' },
  orderId: { fontSize: '16px', fontWeight: '600', letterSpacing: '1px' },
  date: { fontSize: '12px', color: '#aaa', marginTop: '2px' },
  statusSelect: { padding: '6px 10px', border: '1px solid #e5e5e5', fontSize: '12px', fontFamily: 'inherit', backgroundColor: '#fafafa', cursor: 'pointer' },
  customerInfo: { marginBottom: '1rem', fontSize: '13px', color: '#555' },
  address: { color: '#aaa', fontSize: '12px', marginTop: '2px' },
  itemsList: { borderTop: '1px solid #f0f0f0', paddingTop: '0.75rem', marginBottom: '0.75rem' },
  item: { display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#555', marginBottom: '4px' },
  cardFooter: { display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #f0f0f0', paddingTop: '0.75rem' },
  payment: { fontSize: '12px', color: '#888', letterSpacing: '0.5px' },
  total: { fontSize: '14px', fontWeight: '500' },
}

export default AdminOrders