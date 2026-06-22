import { useState } from 'react'

function ProductCard({ product, onAddToCart, onImageUpload, onUpdateProduct, isAdmin }) {
  const [isEditing, setIsEditing] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [editData, setEditData] = useState({
    name: product.name,
    price: product.price,
    salePrice: product.salePrice || '',
    category: product.category,
    badge: product.badge || '',
  })

  const displayPrice = product.salePrice || product.price

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

async function handleFileChange(e) {
  const file = e.target.files[0]
  if (!file) return

  if (file.size > 800000) {
    alert('Image too large. Please use a photo under 800KB.')
    return
  }

  setUploading(true)
  const compressed = await compressImage(file)
  onImageUpload(product.id, compressed)
  setUploading(false)
}

  function handleChange(e) {
    setEditData({ ...editData, [e.target.name]: e.target.value })
  }

  function handleSave() {
    onUpdateProduct(product.id, {
      ...editData,
      price: Number(editData.price),
      salePrice: editData.salePrice ? Number(editData.salePrice) : null,
      badge: editData.badge || null,
    })
    setIsEditing(false)
  }

  function handleCancel() {
    setEditData({
      name: product.name,
      price: product.price,
      salePrice: product.salePrice || '',
      category: product.category,
      badge: product.badge || '',
    })
    setIsEditing(false)
  }

  return (
    <div style={styles.card}>
      <div style={styles.imageBox}>
        {product.image ? (
          <img src={product.image} alt={product.name} style={styles.image} />
        ) : (
          <div style={styles.placeholder}>
            <p style={styles.placeholderText}>No image yet</p>
          </div>
        )}

        {product.badge && !isEditing && (
          <span style={{
            ...styles.badge,
            backgroundColor: product.badge === 'Sale' ? '#c0392b' : '#1a1a1a'
          }}>
            {product.badge}
          </span>
        )}

      {isAdmin && (
          <label style={styles.uploadBtn}>
            {uploading ? '⏳ Saving...' : '📷 Upload Photo'}
            <input
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFileChange}
              disabled={uploading}
            />
          </label>
        )} 

      </div>

      <div style={styles.info}>
        {isEditing ? (
          <div style={styles.editForm}>
            <label style={styles.label}>Product Name</label>
            <input style={styles.input} name="name" value={editData.name} onChange={handleChange} />

            <label style={styles.label}>Category</label>
            <select style={styles.input} name="category" value={editData.category} onChange={handleChange}>
              <option>Women</option>
              <option>Men</option>
              <option>Accessories</option>
            </select>

            <label style={styles.label}>Price (₹)</label>
            <input style={styles.input} name="price" type="number" value={editData.price} onChange={handleChange} />

            <label style={styles.label}>Sale Price (₹) — leave empty if no sale</label>
            <input style={styles.input} name="salePrice" type="number" value={editData.salePrice} onChange={handleChange} placeholder="Optional" />

            <label style={styles.label}>Badge</label>
            <select style={styles.input} name="badge" value={editData.badge} onChange={handleChange}>
              <option value="">None</option>
              <option value="New">New</option>
              <option value="Sale">Sale</option>
            </select>

          {isAdmin && (
            <button style={styles.editBtn} onClick={() => setIsEditing(true)}>
              ✏️ Edit
            </button>
          )} 

          </div>
        ) : (
          <>
            <div style={styles.nameRow}>
              <p style={styles.name}>{product.name}</p>
              {isAdmin && ( 
               <button style={styles.editBtn} onClick={() => setIsEditing(true)}>✏️ Edit</button>
              )} 
            </div>

            <div style={styles.row}>
              <p style={styles.price}>
                {product.salePrice && (
                  <span style={styles.oldPrice}>₹{product.price} </span>
                )}
                ₹{displayPrice}
              </p>
              <p style={styles.rating}>⭐ {product.rating} ({product.reviews})</p>
            </div>

            <p style={styles.categoryTag}>{product.category}</p>

            <button style={styles.addBtn} onClick={() => onAddToCart(product)}>
              Add to Bag
            </button>
          </>
        )}
      </div>
    </div>
  )
}

const styles = {
  card: { backgroundColor: '#ffffff', border: '1px solid #e5e5e5' },
  imageBox: { height: '260px', position: 'relative', overflow: 'hidden', backgroundColor: '#f0ede8' },
  image: { width: '100%', height: '100%', objectFit: 'cover' },
  placeholder: { width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0ede8' },
  placeholderText: { fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase', color: '#aaa' },
  badge: { position: 'absolute', top: '10px', left: '10px', color: '#ffffff', fontSize: '10px', letterSpacing: '1px', textTransform: 'uppercase', padding: '4px 8px' },
  uploadBtn: { position: 'absolute', bottom: '10px', left: '50%', transform: 'translateX(-50%)', backgroundColor: 'rgba(0,0,0,0.6)', color: '#ffffff', fontSize: '11px', letterSpacing: '1px', padding: '6px 14px', cursor: 'pointer', whiteSpace: 'nowrap' },
  info: { padding: '1rem' },
  nameRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' },
  name: { fontSize: '14px' },
  editBtn: { background: 'none', border: '1px solid #e5e5e5', fontSize: '11px', padding: '4px 8px', cursor: 'pointer', color: '#888', fontFamily: 'inherit' },
  row: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' },
  price: { fontSize: '14px', fontWeight: '500' },
  oldPrice: { textDecoration: 'line-through', color: '#aaa', fontWeight: '400', fontSize: '12px', marginRight: '4px' },
  rating: { fontSize: '12px', color: '#888' },
  categoryTag: { fontSize: '11px', color: '#aaa', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '12px' },
  addBtn: { width: '100%', padding: '10px', backgroundColor: 'transparent', border: '1px solid #1a1a1a', fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase', fontFamily: 'inherit', cursor: 'pointer' },
  editForm: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '11px', color: '#888', letterSpacing: '0.5px', marginTop: '4px' },
  input: { padding: '7px 10px', border: '1px solid #e5e5e5', fontSize: '13px', fontFamily: 'inherit', width: '100%', backgroundColor: '#fafafa', outline: 'none' },
  editButtons: { display: 'flex', gap: '8px', marginTop: '8px' },
  saveBtn: { flex: 1, padding: '9px', backgroundColor: '#1a1a1a', color: '#ffffff', border: 'none', fontSize: '12px', letterSpacing: '1px', fontFamily: 'inherit', cursor: 'pointer' },
  cancelBtn: { flex: 1, padding: '9px', backgroundColor: 'transparent', color: '#555', border: '1px solid #e5e5e5', fontSize: '12px', letterSpacing: '1px', fontFamily: 'inherit', cursor: 'pointer' },
}

export default ProductCard