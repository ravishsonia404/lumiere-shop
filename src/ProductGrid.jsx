import { useState } from 'react'
import ProductCard from './ProductCard'
import { useProducts } from './useProducts'
import AddProductModal from './AddProductModal'
import SearchBar from './SearchBar'
import { useAdmin } from './AdminContext'

const filters = ['All', 'Women', 'Men', 'Accessories']

function ProductGrid({ onAddToCart }) {
  const [activeFilter, setActiveFilter] = useState('All')
  const [showModal, setShowModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { products, loading, updateProduct, addProduct } = useProducts()
  const { isAdmin } = useAdmin()

  function handleImageUpload(id, imageUrl) {
    updateProduct(id, { image: imageUrl })
  }

  function handleUpdateProduct(id, updatedData) {
    updateProduct(id, updatedData)
  }

  function handleAddProduct(newProduct) {
    addProduct(newProduct)
  }

  const filteredProducts = products
    .filter(p => activeFilter === 'All' || p.category === activeFilter)
    .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))

  if (loading) {
    return (
      <section style={{ padding: '3rem 2rem', textAlign: 'center' }}>
        <p style={{ color: '#aaa', letterSpacing: '2px', fontSize: '13px' }}>
          Loading products...
        </p>
      </section>
    )
  }

  return (
    <section style={styles.section}>
      <div style={styles.header}>
        <p style={styles.title}>Featured Pieces</p>
        {isAdmin && (
          <button
            style={styles.newProductBtn}
            onClick={() => setShowModal(true)}
          >
            ➕ Add New Product
          </button>
        )}
      </div>

      <SearchBar value={searchQuery} onChange={setSearchQuery} />

      <div style={styles.filterBar}>
        {filters.map(filter => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            style={{
              ...styles.filterBtn,
              backgroundColor: activeFilter === filter ? '#1a1a1a' : 'transparent',
              color: activeFilter === filter ? '#ffffff' : '#555',
              borderColor: activeFilter === filter ? '#1a1a1a' : '#ccc',
            }}
          >
            {filter}
          </button>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div style={styles.noResults}>
          <p>No products found for "<strong>{searchQuery}</strong>"</p>
        </div>
      )}

      <div style={styles.grid}>
        {filteredProducts.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
            onImageUpload={handleImageUpload}
            onUpdateProduct={handleUpdateProduct}
            isAdmin={isAdmin}
          />
        ))}
      </div>

      {showModal && (
        <AddProductModal
          onClose={() => setShowModal(false)}
          onAdd={handleAddProduct}
        />
      )}
    </section>
  )
}

const styles = {
  section: {
    padding: '3rem 2rem',
    backgroundColor: '#ffffff',
    marginTop: '1px',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '1.5rem',
  },
  title: {
    fontSize: '11px',
    letterSpacing: '3px',
    textTransform: 'uppercase',
    color: '#888',
  },
  newProductBtn: {
    padding: '9px 20px',
    backgroundColor: '#1a1a1a',
    color: '#ffffff',
    border: 'none',
    fontSize: '12px',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    fontFamily: 'inherit',
    cursor: 'pointer',
  },
  filterBar: {
    display: 'flex',
    gap: '8px',
    marginBottom: '2rem',
    flexWrap: 'wrap',
  },
  filterBtn: {
    padding: '8px 20px',
    fontSize: '12px',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    border: '1px solid #ccc',
    fontFamily: 'inherit',
    transition: 'all 0.2s ease',
    cursor: 'pointer',
  },
  noResults: {
    textAlign: 'center',
    padding: '3rem',
    color: '#888',
    fontSize: '14px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '1.5rem',
  },
}

export default ProductGrid