import { useState } from 'react'
import { useAdmin } from './AdminContext'

function Navbar({ cartCount, onCartClick }) {
  const { isAdmin, login, logout } = useAdmin()
  const [showLogin, setShowLogin] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function handleLogin() {
    const success = login(password)
    if (success) {
      setShowLogin(false)
      setPassword('')
      setError('')
    } else {
      setError('Wrong password')
    }
  }

  return (
    <>
      <nav style={styles.nav}>
        <span style={styles.logo}>LUMIÈRE</span>

        <div style={styles.links}>
          <a href="#">New In</a>
          <a href="#">Women</a>
          <a href="#">Men</a>
          <a href="#">Accessories</a>
          <a href="#">Sale</a>
        </div>

        <div style={styles.icons}>
          {isAdmin ? (
            <button style={styles.adminBtn} onClick={logout}>
              Exit Admin
            </button>
          ) : (
            <button style={styles.adminBtn} onClick={() => setShowLogin(true)}>
              Admin
            </button>
          )}
          <span style={styles.cartIcon} onClick={onCartClick}>
            🛍
            {cartCount > 0 && (
              <span style={styles.badge}>{cartCount}</span>
            )}
          </span>
        </div>
      </nav>

      {showLogin && (
        <div style={styles.overlay} onClick={() => setShowLogin(false)}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>Admin Login</h3>
            <input
              style={styles.input}
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
            />
            {error && <p style={styles.error}>{error}</p>}
            <button style={styles.loginBtn} onClick={handleLogin}>
              Login
            </button>
          </div>
        </div>
      )}
    </>
  )
}

const styles = {
  nav: {
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #e5e5e5',
    padding: '0 2rem',
    height: '60px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  logo: {
    fontSize: '18px',
    fontWeight: '600',
    letterSpacing: '4px',
  },
  links: {
    display: 'flex',
    gap: '28px',
    fontSize: '13px',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    color: '#555',
  },
  icons: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    fontSize: '18px',
  },
  cartIcon: {
    position: 'relative',
    cursor: 'pointer',
  },
  badge: {
    position: 'absolute',
    top: '-8px',
    right: '-10px',
    backgroundColor: '#1a1a1a',
    color: '#fff',
    borderRadius: '50%',
    width: '16px',
    height: '16px',
    fontSize: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  adminBtn: {
    background: 'none',
    border: '1px solid #e5e5e5',
    padding: '6px 14px',
    fontSize: '11px',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    cursor: 'pointer',
    fontFamily: 'inherit',
    color: '#888',
  },
  overlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    zIndex: 300,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal: {
    backgroundColor: '#ffffff',
    padding: '2rem',
    width: '300px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  modalTitle: {
    fontSize: '13px',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    fontWeight: '500',
  },
  input: {
    padding: '10px 12px',
    border: '1px solid #e5e5e5',
    fontSize: '13px',
    fontFamily: 'inherit',
    outline: 'none',
  },
  error: {
    fontSize: '12px',
    color: '#c0392b',
  },
  loginBtn: {
    padding: '10px',
    backgroundColor: '#1a1a1a',
    color: '#ffffff',
    border: 'none',
    fontSize: '12px',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
}

export default Navbar