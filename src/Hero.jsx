function Hero() {
  return (
    <section style={styles.section}>
      <div style={styles.textSide}>
        <p style={styles.eyebrow}>Summer Collection 2026</p>
        <h1 style={styles.title}>
          Dress for the <br />
          <em style={styles.italic}>life you want</em>
        </h1>
        <p style={styles.subtitle}>
          Refined silhouettes for every occasion. Ethically sourced,
          thoughtfully made, and designed to last.
        </p>
        <div style={styles.buttons}>
          <button style={styles.btnDark}>Shop Women →</button>
          <button style={styles.btnLight}>Shop Men</button>
        </div>
      </div>

      <div style={styles.imageSide}>
        <div style={styles.imagePlaceholder}>
          <p style={styles.placeholderText}>👗</p>
          <p style={styles.placeholderLabel}>Hero Image</p>
        </div>
      </div>
    </section>
  )
}

const styles = {
  section: {
    backgroundColor: '#ffffff',
    padding: '4rem 2rem',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '3rem',
    alignItems: 'center',
    borderBottom: '1px solid #e5e5e5',
  },
  textSide: {},
  eyebrow: {
    fontSize: '11px',
    letterSpacing: '3px',
    textTransform: 'uppercase',
    color: '#888',
    marginBottom: '1rem',
  },
  title: {
    fontSize: '42px',
    fontWeight: '400',
    lineHeight: '1.2',
    letterSpacing: '-1px',
    marginBottom: '1.5rem',
  },
  italic: {
    fontStyle: 'italic',
    fontWeight: '300',
  },
  subtitle: {
    fontSize: '15px',
    color: '#666',
    lineHeight: '1.7',
    maxWidth: '380px',
    marginBottom: '2rem',
  },
  buttons: {
    display: 'flex',
    gap: '12px',
  },
  btnDark: {
    backgroundColor: '#1a1a1a',
    color: '#ffffff',
    border: 'none',
    padding: '12px 28px',
    fontSize: '13px',
    letterSpacing: '1px',
    textTransform: 'uppercase',
  },
  btnLight: {
    backgroundColor: 'transparent',
    color: '#1a1a1a',
    border: '1px solid #1a1a1a',
    padding: '12px 28px',
    fontSize: '13px',
    letterSpacing: '1px',
    textTransform: 'uppercase',
  },
  imageSide: {},
  imagePlaceholder: {
    backgroundColor: '#f0ede8',
    height: '380px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid #e5e5e5',
  },
  placeholderText: {
    fontSize: '56px',
    marginBottom: '8px',
  },
  placeholderLabel: {
    fontSize: '12px',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    color: '#aaa',
  },
}

export default Hero