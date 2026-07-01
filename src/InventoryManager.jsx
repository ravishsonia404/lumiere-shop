import { useAdmin } from './AdminContext'
import { useProducts } from './useProducts'
import { useState } from 'react'

function InventoryManager() {
  const { isAdmin } = useAdmin()
  const { products, loading, updateStock } = useProducts()
  const [editing, setEditing] = useState({})

  if (!isAdmin) return null

  function handleStockChange(id, value) {
    setEditing({ ...editing, [id]: value })
  }

  async function handleSave(id) {
    const newStock = parseInt(editing[id])
    if (isNaN(newStock) || newStock < 0) return
    await updateStock(id, newStock)
    const updated = { ...editing }
    delete updated[id]
    setEditing(updated)
  }

  const lowStock = products.filter(p => (p.stock || 0) < 5)

  return (
    <section style={styles.section}>
      <p style={styles.eyebrow}>Admin Panel</p>
      <h2 style={styles.title}>Inventory Management</h2>

      {lowStock.length > 0 && (
        <div style={styles.alert}>
          ⚠️ {lowStock.length} product{lowStock.length > 1 ? 's' : ''} running low on stock:
          {lowStock.map(p => (
            <span key={p.id} style={styles.alertItem}> {p.name} ({p.stock} left)</span>
          ))}
        </div>
      )}

      {loading ? (
        <p style={styles.loading}>Loading inventory...</p>
      ) : (
        <div style={styles.table}>
          <div style={styles.tableHeader}>
            <span style={{ flex: 2 }}>Product</span>
            <span style={{ flex: 1 }}>Category</span>
            <span style={{ flex: 1 }}>Price</span>
            <span style={{ flex: 1 }}>Stock</span>
            <span style={{ flex: 1 }}>Status</span>
            <span style={{ flex: 1 }}>Action</span>
          </div>

          {products.map(product => {
            const stock = product.stock || 0
            const isEditing = editing[product.id] !== undefined
            const stockStatus = stock === 0 ? 'Out of Stock' : stock < 5 ? 'Low Stock' : 'In Stock'
            const statusColor = stock === 0 ? '#c0392b' : stock < 5 ? '#e67e22' : '#27ae60'

            return (
              <div key={product.id} style={styles.tableRow}>
                <span style={{ flex: 2, fontWeight: '500' }}>{product.name}</span>
                <span style={{ flex: 1, color: '#888', fontSize: '12px' }}>{product.category}</span>
                <span style={{ flex: 1 }}>₹{product.salePrice || product.price}</span>
                <span style={{ flex: 1 }}>
                  {isEditing ? (
                    <input
                      style={styles.stockInput}
                      type="number"
                      value={editing[product.id]}
                      onChange={e => handleStockChange(product.id, e.target.value)}
                      min="0"
                    />
                  ) : (
                    <span style={{ color: statusColor, fontWeight: '500' }}>{stock}</span>
                  )}
                </span>
                <span style={{ flex: 1 }}>
                  <span style={{ ...styles.statusBadge, backgroundColor: statusColor }}>
                    {stockStatus}
                  </span>
                </span>
                <span style={{ flex: 1 }}>
                  {isEditing ? (
                    <button style={styles.saveBtn} onClick={() => handleSave(product.id)}>
                      Save
                    </button>
                  ) : (
                    <button
                      style={styles.editBtn}
                      onClick={() => handleStockChange(product.id, stock)}
                    >
                      Edit
                    </button>
                  )}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}

const styles = {
  section: { padding: '3rem 2rem', backgroundColor: '#ffffff', borderTop: '1px solid #e5e5e5' },
  eyebrow: { fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', color: '#888', marginBottom: '0.5rem', textAlign: 'center' },
  title: { fontSize: '24px', fontWeight: '400', letterSpacing: '-0.5px', marginBottom: '1.5rem', textAlign: 'center' },
  alert: { backgroundColor: '#fff8f0', border: '1px solid #e67e22', padding: '12px 16px', fontSize: '13px', color: '#e67e22', marginBottom: '1.5rem', maxWidth: '800px', margin: '0 auto 1.5rem auto' },
  alertItem: { fontWeight: '500' },
  loading: { textAlign: 'center', color: '#aaa', fontSize: '13px' },
  table: { maxWidth: '900px', margin: '0 auto', border: '1px solid #e5e5e5' },
  tableHeader: { display: 'flex', padding: '10px 16px', backgroundColor: '#f5f5f3', fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase', color: '#888', borderBottom: '1px solid #e5e5e5' },
  tableRow: { display: 'flex', padding: '12px 16px', borderBottom: '1px solid #f0f0f0', fontSize: '13px', alignItems: 'center' },
  stockInput: { width: '60px', padding: '4px 8px', border: '1px solid #e5e5e5', fontSize: '13px', fontFamily: 'inherit', outline: 'none' },
  statusBadge: { color: '#ffffff', fontSize: '10px', padding: '3px 8px', letterSpacing: '0.5px', textTransform: 'uppercase' },
  editBtn: { background: 'none', border: '1px solid #e5e5e5', padding: '4px 12px', fontSize: '11px', cursor: 'pointer', fontFamily: 'inherit', color: '#555' },
  saveBtn: { background: '#1a1a1a', border: 'none', padding: '4px 12px', fontSize: '11px', cursor: 'pointer', fontFamily: 'inherit', color: '#fff' },
}

export default InventoryManager