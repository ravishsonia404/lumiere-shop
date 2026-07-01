function ProductDetail({ product, onClose, onAddToCart, isAdmin, onImageUpload, onUpdateProduct }) {
  const displayPrice = product.salePrice || product.price

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>

        <button style={styles.closeBtn} onClick={onClose}>✕</button>

        <div style={styles.body}>
          <div style={styles.imageSide}>
            {product.image ? (
              <img src={product.image} alt={product.name} style={styles.image} />
            ) : (
              <div style={styles.placeholder}>
                <p style={{ fontSize: '48px' }}>👕</p>
                <p style={{ fontSize: '12px', color: '#aaa', letterSpacing: '1px' }}>No image</p>
              </div>
            )}

            {product.badge && (
              <span style={{
                ...styles.badge,
                backgroundColor: product.badge === 'Sale' ? '#c0392b' : '#1a1a1a'
              }}>
                {product.badge}
              </span>
            )}

            {isAdmin && (
              <label style={styles.uploadBtn}>
                📷 Change Photo
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={async (e) => {
                    const file = e.target.files[0]
                    if (!file) return
                    if (file.size > 800000) { alert('Image too large. Use under 800KB.'); return }
                    const compressed = await compressImage(file)
                    onImageUpload(product.id, compressed)
                  }}
                />
              </label>
            )}
          </div>

          <div style={styles.infoSide}>
            <p style={styles.category}>{product.category}</p>
            <h2 style={styles.name}>{product.name}</h2>

            <div style={styles.priceRow}>
              {product.salePrice && (
                <span style={styles.oldPrice}>₹{product.price}</span>
              )}
              <span style={styles.price}>₹{displayPrice}</span>
              {product.salePrice && (
                <span style={styles.discount}>
                  {Math.round((1 - product.salePrice / product.price) * 100)}% off
                </span>
              )}
            </div>

            <div style={styles.ratingRow}>
              <span style={styles.stars}>{'⭐'.repeat(Math.round(product.rating))}</span>
              <span style={styles.reviews}>{product.rating} ({product.reviews} reviews)</span>
            </div>

            <div style={styles.divider} />

            <div style={styles.details}>
              <p style={styles.detailTitle}>Product Details</p>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Category</span>
                <span>{product.category}</span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Stock</span>
                <span style={{
                  color: (product.stock || 0) === 0 ? '#c0392b' : (product.stock || 0) < 5 ? '#e67e22' : '#27ae60',
                  fontWeight: '500',
                }}>
                  {(product.stock || 0) === 0 ? 'Out of Stock' : (product.stock || 0) < 5 ? `Only ${product.stock} left!` : `${product.stock} in stock`}
                </span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Payment</span>
                <span>Cash on Delivery / UPI</span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Delivery</span>
                <span>3-7 business days</span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Returns</span>
                <span>7-day easy returns</span>
              </div>
            </div>

            <div style={styles.divider} />

            <button
              style={{
                ...styles.addBtn,
                opacity: (product.stock || 0) === 0 ? 0.5 : 1,
                cursor: (product.stock || 0) === 0 ? 'not-allowed' : 'pointer',
                backgroundColor: (product.stock || 0) === 0 ? '#aaa' : '#1a1a1a',
              }}
              onClick={() => {
                if ((product.stock || 0) > 0) {
                  onAddToCart(product)
                  onClose()
                }
              }}
              disabled={(product.stock || 0) === 0}
            >
              {(product.stock || 0) === 0 ? 'Out of Stock' : 'Add to Bag'}
            </button>

            {isAdmin && (
              <button
                style={styles.editAdminBtn}
                onClick={() => onUpdateProduct(product.id, { ...product })}
              >
                ✏️ Edit Product
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function compressImage(file) {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const MAX = 600
        let w = img.width
        let h = img.height
        if (w > h && w > MAX) { h = (h * MAX) / w; w = MAX }
        else if (h > MAX) { w = (w * MAX) / h; h = MAX }
        canvas.width = w
        canvas.height = h
        canvas.getContext('2d').drawImage(img, 0, 0, w, h)
        resolve(canvas.toDataURL('image/jpeg', 0.7))
      }
      img.src = e.target.result
    }
    reader.readAsDataURL(file)
  })
}

const styles = {
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' },
  modal: { backgroundColor: '#ffffff', width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', position: 'relative' },
  closeBtn: { position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#888', zIndex: 1 },
  body: { display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '400px' },
  imageSide: { position: 'relative', backgroundColor: '#f0ede8', minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  image: { width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0 },
  placeholder: { textAlign: 'center' },
  badge: { position: 'absolute', top: '1rem', left: '1rem', color: '#ffffff', fontSize: '10px', letterSpacing: '1px', textTransform: 'uppercase', padding: '4px 8px', zIndex: 1 },
  uploadBtn: { position: 'absolute', bottom: '1rem', left: '50%', transform: 'translateX(-50%)', backgroundColor: 'rgba(0,0,0,0.6)', color: '#ffffff', fontSize: '11px', letterSpacing: '1px', padding: '6px 14px', cursor: 'pointer', whiteSpace: 'nowrap', zIndex: 1 },
  infoSide: { padding: '2rem', display: 'flex', flexDirection: 'column', gap: '12px' },
  category: { fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: '#888' },
  name: { fontSize: '22px', fontWeight: '400', letterSpacing: '-0.5px' },
  priceRow: { display: 'flex', alignItems: 'center', gap: '10px' },
  oldPrice: { fontSize: '14px', textDecoration: 'line-through', color: '#aaa' },
  price: { fontSize: '22px', fontWeight: '600' },
  discount: { fontSize: '12px', backgroundColor: '#e8f5e9', color: '#27ae60', padding: '3px 8px', letterSpacing: '0.5px' },
  ratingRow: { display: 'flex', alignItems: 'center', gap: '8px' },
  stars: { fontSize: '14px' },
  reviews: { fontSize: '12px', color: '#888' },
  divider: { height: '1px', backgroundColor: '#e5e5e5' },
  details: { display: 'flex', flexDirection: 'column', gap: '8px' },
  detailTitle: { fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: '#888', marginBottom: '4px' },
  detailRow: { display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#555' },
  detailLabel: { color: '#aaa' },
  addBtn: { width: '100%', padding: '14px', color: '#ffffff', border: 'none', fontSize: '13px', letterSpacing: '1.5px', textTransform: 'uppercase', fontFamily: 'inherit', marginTop: 'auto' },
  editAdminBtn: { width: '100%', padding: '10px', backgroundColor: 'transparent', border: '1px solid #e5e5e5', fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase', fontFamily: 'inherit', cursor: 'pointer', color: '#555', marginTop: '8px' },
}

export default ProductDetail