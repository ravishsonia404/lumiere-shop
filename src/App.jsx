import { useState } from 'react'
import './index.css'
import Navbar from './Navbar'
import Hero from './Hero'
import ProductGrid from './ProductGrid'
import CartDrawer from './CartDrawer'
import { AdminProvider } from './AdminContext'
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore'
import { db } from './firebase'

function App() {
  const [cart, setCart] = useState([])
  const [cartOpen, setCartOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [joinStatus, setJoinStatus] = useState('idle')
  const [joinError, setJoinError] = useState('')

  async function handleJoin() {
    const trimmed = email.trim()

    if (!trimmed) {
      setJoinError('Please enter your email.')
      return
    }
    if (!trimmed.includes('@')) {
      setJoinError('Please enter a valid email.')
      return
    }

    setJoinStatus('loading')
    setJoinError('')

    try {
      const q = query(
        collection(db, 'subscribers'),
        where('email', '==', trimmed)
      )
      const existing = await getDocs(q)

      if (!existing.empty) {
        setJoinError('This email is already subscribed!')
        setJoinStatus('idle')
        return
      }

      await addDoc(collection(db, 'subscribers'), {
        email: trimmed,
        joinedAt: new Date().toISOString(),
      })

      setJoinStatus('done')
      setEmail('')
    } catch (err) {
      setJoinError('Something went wrong. Try again.')
      setJoinStatus('idle')
    }
  }

  function handleAddToCart(product) {
    setCart(prevCart => {
      const existing = prevCart.find(item => item.id === product.id)
      if (existing) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, qty: item.qty + 1 }
            : item
        )
      }
      return [...prevCart, { ...product, qty: 1 }]
    })
    
  }

  function handleChangeQty(id, delta) {
    setCart(prevCart =>
      prevCart
        .map(item => item.id === id ? { ...item, qty: item.qty + delta } : item)
        .filter(item => item.qty > 0)
    )
  }

  function handleRemove(id) {
    setCart(prevCart => prevCart.filter(item => item.id !== id))
  }

  const cartCount = cart.reduce((total, item) => total + item.qty, 0)

  return (
    <AdminProvider>
      <div>
        <Navbar cartCount={cartCount} onCartClick={() => setCartOpen(true)} />
        <Hero />
        <ProductGrid onAddToCart={handleAddToCart} />

        <section style={styles.banner}>
          <p style={styles.bannerEyebrow}>Exclusive Access</p>
          <h2 style={styles.bannerTitle}>Join the inner circle</h2>
          <p style={styles.bannerSub}>
            Early access to new arrivals, private sales, and styling notes.
          </p>
          <div style={styles.inputRow}>
            <input type="email" placeholder="your@email.com" style={styles.input} value={email} onChange={e => setEmail(e.target.value)} />
              <button style={styles.joinBtn} onClick={handleJoin}>
                {joinStatus === 'loading' ? 'Joining...' : joinStatus === 'done' ? '✓ Joined!' : 'Join'}
              </button>
          </div>
          {joinError && <p style={styles.joinError}>{joinError}</p>}
        </section>

        <footer style={styles.footer}>
          <p style={styles.footerLogo}>LUMIÈRE</p>
          <p>© 2026 · About · Sustainability · Returns · Privacy</p>
        </footer>

        <CartDrawer
          isOpen={cartOpen}
          onClose={() => setCartOpen(false)}
          cart={cart}
          onChangeQty={handleChangeQty}
          onRemove={handleRemove}
        />
      </div>
    </AdminProvider>
  )
}

const styles = {
  banner: {
    backgroundColor: '#1a1a1a',
    color: '#ffffff',
    padding: '3rem 2rem',
    textAlign: 'center',
  },
  bannerEyebrow: {
    fontSize: '11px',
    letterSpacing: '3px',
    textTransform: 'uppercase',
    opacity: 0.5,
    marginBottom: '0.75rem',
  },
  bannerTitle: {
    fontSize: '28px',
    fontWeight: '400',
    letterSpacing: '-0.5px',
    marginBottom: '0.5rem',
  },
  bannerSub: {
    fontSize: '14px',
    opacity: 0.5,
    marginBottom: '1.5rem',
  },
  inputRow: {
    display: 'flex',
    gap: '8px',
    maxWidth: '380px',
    margin: '0 auto',
  },
  input: {
    flex: 1,
    padding: '11px 16px',
    backgroundColor: 'transparent',
    border: '1px solid rgba(255,255,255,0.3)',
    color: '#ffffff',
    fontSize: '13px',
    fontFamily: 'inherit',
    outline: 'none',
  },
  joinBtn: {
    padding: '11px 24px',
    backgroundColor: '#ffffff',
    color: '#1a1a1a',
    border: 'none',
    fontSize: '12px',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    fontWeight: '500',
    fontFamily: 'inherit',
    cursor: 'pointer',
  },
  joinError: {
  fontSize: '12px',
  color: '#ff8080',
  marginTop: '8px',
  },
  footer: {
    padding: '2rem',
    backgroundColor: '#f5f5f3',
    borderTop: '1px solid #e5e5e5',
    textAlign: 'center',
    fontSize: '12px',
    color: '#888',
    letterSpacing: '1px',
  },
  footerLogo: {
    letterSpacing: '3px',
    fontSize: '13px',
    marginBottom: '8px',
    color: '#1a1a1a',
  },
}

export default App