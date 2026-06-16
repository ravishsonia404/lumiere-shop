import { useState } from 'react'
import { imageToBase64 } from './imageToBase64'

function AddProductModal({ onClose, onAdd }) {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Women',
    price: '',
    salePrice: '',
    badge: '',
  })
  const [imageFile, setImageFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  function handleImageChange(e) {
    const file = e.target.files[0]
    if (!file) return
    setImageFile(file)
    setPreview(URL.createObjectURL(file))
  }

  async function handleSubmit() {
    if (!formData.name.trim()) { setError('Please enter a product name.'); return }
    if (!formData.price) { setError('Please enter a price.'); return }

    setUploading(true)
    let imageUrl = null

    if (imageFile) {
      imageUrl = await imageToBase64(imageFile)
    }

    const newProduct = {
      name: formData.name.trim(),
      category: formData.category,
      price: Number(formData.price),
      salePrice: formData.salePrice ? Number(formData.salePrice) : null,
      badge: formData.badge || null,
      image: imageUrl,
      rating: 0,
      reviews: 0,
    }

    onAdd(newProduct)
    setUploading(false)
    onClose()
  }

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>

        <div style={styles.header}>
          <h2 style={styles.title}>Add New Product</h2>
          <button style={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div style={styles.body}>
          <div style={styles.imageUploadBox}>
            {preview ? (
              <img src={preview} alt="preview" style={styles.previewImg} />
            ) : (
              <div style={styles.imagePlaceholder}>
                <p style={styles.uploadIcon}>📷</p>
                <p style={styles.uploadText}>Click to upload photo</p>
              </div>
            )}
            <label style={styles.imageLabel}>
              {preview ? 'Change Photo' : 'Upload Photo'}
              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageChange} />
            </label>
          </div>

          <div style={styles.fields}>
            {error && <p style={styles.error}>{error}</p>}

            <label style={styles.label}>Product Name *</label>
            <input style={styles.input} name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Floral Summer Dress" />

            <label style={styles.label}>Category *</label>
            <select style={styles.input} name="category" value={formData.category} onChange={handleChange}>
              <option>Women</option>
              <option>Men</option>
              <option>Accessories</option>
            </select>

            <label style={styles.label}>Price (₹) *</label>
            <input style={styles.input} name="price" type="number" value={formData.price} onChange={handleChange} placeholder="e.g. 1999" />

            <label style={styles.label}>Sale Price (₹) — optional</label>
            <input style={styles.input} name="salePrice" type="number" value={formData.salePrice} onChange={handleChange} placeholder="e.g. 1499" />

            <label style={styles.label}>Badge — optional</label>
            <select style={styles.input} name="badge" value={formData.badge} onChange={handleChange}>
              <option value="">None</option>
              <option value="New">New</option>
              <option value="Sale">Sale</option>
            </select>
          </div>
        </div>

        <div style={styles.footer}>
          <button style={styles.cancelBtn} onClick={onClose}>Cancel</button>
          <button style={styles.addBtn} onClick={handleSubmit} disabled={uploading}>
            {uploading ? '⏳ Saving...' : '➕ Add Product'}
          </button>
        </div>

      </div>
    </div>
  )
}

const styles = {
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' },
  modal: { backgroundColor: '#ffffff', width: '100%', maxWidth: '560px', maxHeight: '90vh', overflowY: 'auto', display: 'flex', flexDirection: 'column' },
  header: { padding: '1.25rem 1.5rem', borderBottom: '1px solid #e5e5e5', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontSize: '14px', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: '500' },
  closeBtn: { background: 'none', border: 'none', fontSize: '16px', color: '#888', cursor: 'pointer' },
  body: { padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' },
  imageUploadBox: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' },
  imagePlaceholder: { width: '100%', height: '180px', backgroundColor: '#f0ede8', border: '2px dashed #ddd', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' },
  uploadIcon: { fontSize: '36px', marginBottom: '8px' },
  uploadText: { fontSize: '12px', color: '#aaa', letterSpacing: '1px' },
  previewImg: { width: '100%', height: '180px', objectFit: 'cover', border: '1px solid #e5e5e5' },
  imageLabel: { padding: '8px 20px', border: '1px solid #1a1a1a', fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase', cursor: 'pointer', color: '#1a1a1a' },
  fields: { display: 'flex', flexDirection: 'column', gap: '6px' },
  error: { fontSize: '12px', color: '#c0392b', backgroundColor: '#fdf0f0', padding: '8px 12px', border: '1px solid #f5c6cb' },
  label: { fontSize: '11px', color: '#888', letterSpacing: '0.5px', marginTop: '8px' },
  input: { padding: '9px 12px', border: '1px solid #e5e5e5', fontSize: '13px', fontFamily: 'inherit', width: '100%', backgroundColor: '#fafafa', outline: 'none' },
  footer: { padding: '1.25rem 1.5rem', borderTop: '1px solid #e5e5e5', display: 'flex', gap: '10px', justifyContent: 'flex-end' },
  cancelBtn: { padding: '10px 24px', background: 'transparent', border: '1px solid #e5e5e5', fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase', fontFamily: 'inherit', cursor: 'pointer', color: '#555' },
  addBtn: { padding: '10px 24px', backgroundColor: '#1a1a1a', color: '#ffffff', border: 'none', fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase', fontFamily: 'inherit', cursor: 'pointer' },
}

export default AddProductModal