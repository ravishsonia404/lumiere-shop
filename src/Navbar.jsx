import { useState } from 'react'
import { useAdmin } from './AdminContext'
import { useIsMobile } from './useIsMobile'

function Navbar({ cartCount, onCartClick }) {
  const { isAdmin, login, logout } = useAdmin()
  const [showLogin, setShowLogin] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const isMobile = useIsMobile()

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

        {isMobile ? (
          <div style={styles.mobileRight}>
            {isAdmin && (
              <button style={styles.adminBtn} onClick={logout}>Exit Admin</button>
            )}
            <span style={{ position: 'relative', cursor: 'pointer', fontSize: '20px' }} onClick={onCartClick}>
              🛍
              {cartCount > 0 && <span style={styles.badge}>{cartCount}</span>}
            </span>
            <button style={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>
        ) : (
          <>
            <div style={styles.links}>
              <a href="#">New In</a>
              <a href="#">Women</a>
              <a href="#">Men</a>
              <a href="#">Accessories</a>
              <a href="#">Sale</a>
            </div>
            <div style={styles.icons}>
              {isAdmin ? (
                <button style={styles.adminBtn} onClick={logout}>Exit Admin</button>
              ) : (
                <button style={styles.adminBtn} onClick={() => setShowLogin(true)}>Admin</button>
              )}
              <span style={styles.cartIcon} onClick={onCartClick}>
                🛍
                {cartCount > 0 && <span style={styles.badge}>{cartCount}</span>}
              </span>
            </div>
          </>
        )}
      </nav>

      {isMobile && menuOpen && (
        <div style={styles.mobileMenu}>
          <a href="#" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>New In</a>
          <a href="#" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Women</a>
          <a href="#" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Men</a>
          <a href="#" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Accessories</a>
          <a href="#" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Sale</a>
          {!isAdmin && (
            <button style={styles.mobilAdminBtn} onClick={() => { setShowLogin(true); setMenuOpen(false) }}>
              Admin Login
            </button>
          )}
        </div>
      )}

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
            <button style={styles.loginBtn} onClick={handleLogin}>Login</button>
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
    padding: '0 1.5rem',
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
  hamburger: {
    background: 'none',
    border: 'none',
    fontSize: '22px',
    cursor: 'pointer',
    color: '#1a1a1a',
    fontFamily: 'inherit',
  },
  mobileRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  mobileMenu: {
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #e5e5e5',
    display: 'flex',
    flexDirection: 'column',
    padding: '1rem 1.5rem',
    gap: '0',
    position: 'sticky',
    top: '60px',
    zIndex: 99,
  },
  mobileLink: {
    padding: '14px 0',
    fontSize: '13px',
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
    color: '#333',
    borderBottom: '1px solid #f0f0f0',
    display: 'block',
  },
  mobilAdminBtn: {
    marginTop: '12px',
    padding: '10px',
    background: 'none',
    border: '1px solid #e5e5e5',
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