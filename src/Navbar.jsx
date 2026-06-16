function Navbar({ cartCount, onCartClick }) {
  return (
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
        <span>🔍</span>
        <span>🤍</span>
        <span style={styles.cartIcon} onClick={onCartClick}>
          🛍
          {cartCount > 0 && (
            <span style={styles.badge}>{cartCount}</span>
          )}
        </span>
      </div>
    </nav>
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
    gap: '20px',
    fontSize: '18px',
    cursor: 'pointer',
  },
  cartIcon: {
    position: 'relative',
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
}

export default Navbar