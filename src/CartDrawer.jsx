function CartDrawer({ isOpen, onClose, cart, onChangeQty, onRemove }) {
  const total = cart.reduce((sum, item) => sum + (item.salePrice || item.price) * item.qty, 0)

  return (
    <>
      {isOpen && <div style={styles.overlay} onClick={onClose} />}

      <div style={{ ...styles.drawer, right: isOpen ? '0' : '-380px' }}>
        <div style={styles.header}>
          <button style={styles.backBtn} onClick={onClose}>← Continue Shopping</button>
          <button style={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div style={styles.items}>
          {cart.length === 0 ? (
            <div style={styles.empty}>
              <p style={styles.emptyIcon}>🛍</p>
              <p style={styles.emptyText}>Your bag is empty</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} style={styles.item}>
                <div style={styles.itemImage}>
                  {item.image && item.image.startsWith('data:') ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : item.image && item.image.startsWith('http') ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <span style={{ fontSize: '24px' }}>👕</span>
                  )}
                </div>

                <div style={styles.itemInfo}>
                  <p style={styles.itemName}>{item.name}</p>
                  <p style={styles.itemPrice}>₹{item.salePrice || item.price}</p>
                  <div style={styles.qtyRow}>
                    <button style={styles.qtyBtn} onClick={() => onChangeQty(item.id, -1)}>−</button>
                    <span style={styles.qtyVal}>{item.qty}</span>
                    <button style={styles.qtyBtn} onClick={() => onChangeQty(item.id, 1)}>+</button>
                  </div>
                </div>

                <button style={styles.removeBtn} onClick={() => onRemove(item.id)}>🗑</button>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div style={styles.footer}>
            <div style={styles.totalRow}>
              <span>Subtotal</span>
              <span style={{ fontWeight: '500' }}>₹{total}</span>
            </div>
            <button style={styles.checkoutBtn} onClick={() => alert(`Order placed! Total: ₹${total}. Payment coming soon.`)}>
              Proceed to Checkout
            </button>
            <p style={styles.freeShipping}>Free shipping on orders over ₹999</p>
          </div>
        )}
      </div>
    </>
  )
}

const styles = {
  overlay: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)', zIndex: 150
  },
  drawer: {
    position: 'fixed', top: 0, bottom: 0,
    width: window.innerWidth < 768 ? '100%' : '360px',
    backgroundColor: '#ffffff', borderLeft: '1px solid #e5e5e5',
    zIndex: 200, display: 'flex', flexDirection: 'column',
    transition: 'right 0.3s ease'
  },
  header: {
    padding: '1.25rem 1.5rem', borderBottom: '1px solid #e5e5e5',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between'
  },
  heading: {
    fontSize: '13px', letterSpacing: '2px',
    textTransform: 'uppercase', fontWeight: '500'
  },
  closeBtn: {
    background: 'none', border: 'none',
    fontSize: '16px', color: '#888', cursor: 'pointer'
  },
  closeBtn: {
  background: 'none', border: 'none',
  fontSize: '16px', color: '#888', cursor: 'pointer'
},
  backBtn: {
    background: 'none',
    border: 'none',
    fontSize: '13px',
    color: '#888',
    cursor: 'pointer',
    letterSpacing: '0.5px',
    fontFamily: 'inherit',
  },
  items: { flex: 1, overflowY: 'auto', padding: '1rem 1.5rem' },
  empty: { textAlign: 'center', padding: '3rem 1rem', color: '#aaa' },
  emptyIcon: { fontSize: '40px', marginBottom: '8px' },
  emptyText: { fontSize: '14px', letterSpacing: '1px' },
  item: {
    display: 'flex', gap: '12px', padding: '12px 0',
    borderBottom: '1px solid #f0f0f0', alignItems: 'flex-start'
  },
  itemImage: {
    width: '60px', height: '70px', backgroundColor: '#f0ede8',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0, border: '1px solid #e5e5e5', overflow: 'hidden'
  },
  itemInfo: { flex: 1 },
  itemName: { fontSize: '13px', marginBottom: '4px' },
  itemPrice: { fontSize: '12px', color: '#888', marginBottom: '8px' },
  qtyRow: { display: 'flex', alignItems: 'center', gap: '8px' },
  qtyBtn: {
    width: '24px', height: '24px', border: '1px solid #e5e5e5',
    background: 'none', fontSize: '14px', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center'
  },
  qtyVal: { fontSize: '13px', minWidth: '16px', textAlign: 'center' },
  removeBtn: {
    background: 'none', border: 'none',
    fontSize: '16px', color: '#aaa', cursor: 'pointer', padding: '4px'
  },
  footer: { padding: '1.25rem 1.5rem', borderTop: '1px solid #e5e5e5' },
  totalRow: {
    display: 'flex', justifyContent: 'space-between',
    fontSize: '14px', marginBottom: '1rem'
  },
  checkoutBtn: {
    width: '100%', padding: '13px', backgroundColor: '#1a1a1a',
    color: '#ffffff', border: 'none', fontSize: '13px',
    letterSpacing: '1px', textTransform: 'uppercase',
    marginBottom: '12px', cursor: 'pointer', fontFamily: 'inherit'
  },
  freeShipping: {
    fontSize: '11px', color: '#aaa',
    textAlign: 'center', letterSpacing: '0.5px'
  },
}

export default CartDrawer