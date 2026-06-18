function Hero() {
  return (
    <section style={styles.section}>
      <p style={styles.eyebrow}>Summer Collection 2026</p>
      <h1 style={styles.title}>
        Dress for the <em style={styles.italic}>life you want</em>
      </h1>
      <p style={styles.subtitle}>
        Refined silhouettes for every occasion. Ethically sourced,
        thoughtfully made, and designed to last.
      </p>
    </section>
  )
}

const styles = {
  section: {
    backgroundColor: '#ffffff',
    padding: '5rem 2rem',
    textAlign: 'center',
    borderBottom: '1px solid #e5e5e5',
  },
  eyebrow: {
    fontSize: '11px',
    letterSpacing: '3px',
    textTransform: 'uppercase',
    color: '#888',
    marginBottom: '1rem',
  },
  title: {
    fontSize: '48px',
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
    maxWidth: '480px',
    margin: '0 auto 2rem auto',
  },

}

export default Hero