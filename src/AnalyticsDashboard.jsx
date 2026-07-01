import { useState, useEffect } from 'react'
import { collection, onSnapshot } from 'firebase/firestore'
import { db } from './firebase'
import { useAdmin } from './AdminContext'
import { useProducts } from './useProducts'

function AnalyticsDashboard() {
  const { isAdmin } = useAdmin()
  const { products } = useProducts()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAdmin) return
    const unsub = onSnapshot(collection(db, 'orders'), snapshot => {
      const data = snapshot.docs.map(d => d.data())
      setOrders(data)
      setLoading(false)
    })
    return () => unsub()
  }, [isAdmin])

  if (!isAdmin) return null

  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0)
  const totalOrders = orders.length
  const pendingOrders = orders.filter(o => o.status === 'Pending').length
  const deliveredOrders = orders.filter(o => o.status === 'Delivered').length
  const cancelledOrders = orders.filter(o => o.status === 'Cancelled').length

  const productSales = {}
  orders.forEach(order => {
    order.items?.forEach(item => {
      if (!productSales[item.name]) productSales[item.name] = 0
      productSales[item.name] += item.qty
    })
  })
  const topProducts = Object.entries(productSales)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  const totalStock = products.reduce((sum, p) => sum + (p.stock || 0), 0)
  const outOfStock = products.filter(p => (p.stock || 0) === 0).length
  const lowStockCount = products.filter(p => (p.stock || 0) > 0 && (p.stock || 0) < 5).length

  const revenueByDate = {}
  orders.forEach(order => {
    const date = new Date(order.createdAt).toLocaleDateString('en-IN')
    revenueByDate[date] = (revenueByDate[date] || 0) + (order.total || 0)
  })
  const revenueEntries = Object.entries(revenueByDate).slice(-7)
  const maxRevenue = Math.max(...revenueEntries.map(([, v]) => v), 1)

  return (
    <section style={styles.section}>
      <p style={styles.eyebrow}>Admin Panel</p>
      <h2 style={styles.title}>Analytics Dashboard</h2>

      {loading ? (
        <p style={styles.loading}>Loading analytics...</p>
      ) : (
        <>
          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <p style={styles.statLabel}>Total Revenue</p>
              <p style={styles.statValue}>₹{totalRevenue.toLocaleString('en-IN')}</p>
            </div>
            <div style={styles.statCard}>
              <p style={styles.statLabel}>Total Orders</p>
              <p style={styles.statValue}>{totalOrders}</p>
            </div>
            <div style={styles.statCard}>
              <p style={styles.statLabel}>Pending Orders</p>
              <p style={{ ...styles.statValue, color: '#e67e22' }}>{pendingOrders}</p>
            </div>
            <div style={styles.statCard}>
              <p style={styles.statLabel}>Delivered</p>
              <p style={{ ...styles.statValue, color: '#27ae60' }}>{deliveredOrders}</p>
            </div>
            <div style={styles.statCard}>
              <p style={styles.statLabel}>Total Stock</p>
              <p style={styles.statValue}>{totalStock}</p>
            </div>
            <div style={styles.statCard}>
              <p style={styles.statLabel}>Out of Stock</p>
              <p style={{ ...styles.statValue, color: '#c0392b' }}>{outOfStock}</p>
            </div>
          </div>

          <div style={styles.row}>
            <div style={styles.card}>
              <p style={styles.cardTitle}>Revenue Last 7 Days</p>
              {revenueEntries.length === 0 ? (
                <p style={styles.noData}>No orders yet</p>
              ) : (
                <div style={styles.chart}>
                  {revenueEntries.map(([date, revenue]) => (
                    <div key={date} style={styles.bar}>
                      <div style={styles.barFill}>
                        <div style={{
                          ...styles.barInner,
                          height: `${(revenue / maxRevenue) * 100}%`,
                        }} />
                      </div>
                      <p style={styles.barLabel}>₹{(revenue / 1000).toFixed(1)}k</p>
                      <p style={styles.barDate}>{date.slice(0, 5)}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={styles.card}>
              <p style={styles.cardTitle}>Top Selling Products</p>
              {topProducts.length === 0 ? (
                <p style={styles.noData}>No sales yet</p>
              ) : (
                <div style={styles.topList}>
                  {topProducts.map(([name, qty], i) => (
                    <div key={name} style={styles.topItem}>
                      <span style={styles.topRank}>#{i + 1}</span>
                      <span style={styles.topName}>{name}</span>
                      <span style={styles.topQty}>{qty} sold</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div style={styles.row}>
            <div style={styles.card}>
              <p style={styles.cardTitle}>Order Status Breakdown</p>
              {totalOrders === 0 ? (
                <p style={styles.noData}>No orders yet</p>
              ) : (
                <div style={styles.statusList}>
                  {[
                    { label: 'Pending', count: pendingOrders, color: '#e67e22' },
                    { label: 'Confirmed', count: orders.filter(o => o.status === 'Confirmed').length, color: '#3498db' },
                    { label: 'Shipped', count: orders.filter(o => o.status === 'Shipped').length, color: '#9b59b6' },
                    { label: 'Delivered', count: deliveredOrders, color: '#27ae60' },
                    { label: 'Cancelled', count: cancelledOrders, color: '#c0392b' },
                  ].map(({ label, count, color }) => (
                    <div key={label} style={styles.statusRow}>
                      <div style={styles.statusLeft}>
                        <div style={{ ...styles.statusDot, backgroundColor: color }} />
                        <span style={styles.statusLabel}>{label}</span>
                      </div>
                      <div style={styles.statusBarWrap}>
                        <div style={{
                          ...styles.statusBar,
                          width: `${totalOrders > 0 ? (count / totalOrders) * 100 : 0}%`,
                          backgroundColor: color,
                        }} />
                      </div>
                      <span style={styles.statusCount}>{count}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={styles.card}>
              <p style={styles.cardTitle}>Inventory Status</p>
              <div style={styles.inventoryStats}>
                <div style={styles.inventoryStat}>
                  <p style={{ ...styles.inventoryValue, color: '#27ae60' }}>
                    {products.filter(p => (p.stock || 0) >= 5).length}
                  </p>
                  <p style={styles.inventoryLabel}>In Stock</p>
                </div>
                <div style={styles.inventoryStat}>
                  <p style={{ ...styles.inventoryValue, color: '#e67e22' }}>
                    {lowStockCount}
                  </p>
                  <p style={styles.inventoryLabel}>Low Stock</p>
                </div>
                <div style={styles.inventoryStat}>
                  <p style={{ ...styles.inventoryValue, color: '#c0392b' }}>
                    {outOfStock}
                  </p>
                  <p style={styles.inventoryLabel}>Out of Stock</p>
                </div>
              </div>
              <div style={styles.inventoryList}>
                {products
                  .sort((a, b) => (a.stock || 0) - (b.stock || 0))
                  .slice(0, 5)
                  .map(p => (
                    <div key={p.id} style={styles.inventoryItem}>
                      <span style={styles.inventoryName}>{p.name}</span>
                      <span style={{
                        color: (p.stock || 0) === 0 ? '#c0392b' : (p.stock || 0) < 5 ? '#e67e22' : '#27ae60',
                        fontWeight: '500',
                        fontSize: '13px',
                      }}>
                        {p.stock || 0} left
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  )
}

const styles = {
  section: { padding: '3rem 2rem', backgroundColor: '#f5f5f3', borderTop: '1px solid #e5e5e5' },
  eyebrow: { fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', color: '#888', marginBottom: '0.5rem', textAlign: 'center' },
  title: { fontSize: '24px', fontWeight: '400', letterSpacing: '-0.5px', marginBottom: '2rem', textAlign: 'center' },
  loading: { textAlign: 'center', color: '#aaa', fontSize: '13px' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem', marginBottom: '1.5rem', maxWidth: '900px', margin: '0 auto 1.5rem auto' },
  statCard: { backgroundColor: '#ffffff', padding: '1.25rem', border: '1px solid #e5e5e5', textAlign: 'center' },
  statLabel: { fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase', color: '#888', marginBottom: '8px' },
  statValue: { fontSize: '24px', fontWeight: '600', color: '#1a1a1a' },
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', maxWidth: '900px', margin: '0 auto 1rem auto' },
  card: { backgroundColor: '#ffffff', padding: '1.25rem', border: '1px solid #e5e5e5' },
  cardTitle: { fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: '#888', marginBottom: '1rem' },
  noData: { fontSize: '13px', color: '#aaa', textAlign: 'center', padding: '1rem' },
  chart: { display: 'flex', alignItems: 'flex-end', gap: '8px', height: '120px' },
  bar: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', height: '100%' },
  barFill: { flex: 1, width: '100%', display: 'flex', alignItems: 'flex-end', backgroundColor: '#f5f5f3' },
  barInner: { width: '100%', backgroundColor: '#1a1a1a', minHeight: '2px' },
  barLabel: { fontSize: '10px', color: '#888' },
  barDate: { fontSize: '9px', color: '#aaa' },
  topList: { display: 'flex', flexDirection: 'column', gap: '10px' },
  topItem: { display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px' },
  topRank: { width: '20px', height: '20px', backgroundColor: '#1a1a1a', color: '#fff', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  topName: { flex: 1, color: '#333' },
  topQty: { color: '#888', fontSize: '12px' },
  statusList: { display: 'flex', flexDirection: 'column', gap: '12px' },
  statusRow: { display: 'flex', alignItems: 'center', gap: '10px' },
  statusLeft: { display: 'flex', alignItems: 'center', gap: '6px', width: '80px', flexShrink: 0 },
  statusDot: { width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0 },
  statusLabel: { fontSize: '12px', color: '#555' },
  statusBarWrap: { flex: 1, backgroundColor: '#f0f0f0', height: '6px' },
  statusBar: { height: '100%', minWidth: '2px', transition: 'width 0.3s ease' },
  statusCount: { fontSize: '12px', color: '#888', width: '20px', textAlign: 'right' },
  inventoryStats: { display: 'flex', gap: '1rem', marginBottom: '1rem' },
  inventoryStat: { flex: 1, textAlign: 'center', padding: '0.75rem', backgroundColor: '#f5f5f3' },
  inventoryValue: { fontSize: '22px', fontWeight: '600' },
  inventoryLabel: { fontSize: '10px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '2px' },
  inventoryList: { display: 'flex', flexDirection: 'column', gap: '8px' },
  inventoryItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', paddingBottom: '8px', borderBottom: '1px solid #f0f0f0' },
  inventoryName: { color: '#555' },
}

export default AnalyticsDashboard