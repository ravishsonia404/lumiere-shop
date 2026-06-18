function SearchBar({ value, onChange }) {
  return (
    <div style={styles.wrapper}>
      <span style={styles.icon}>🔍</span>
      <input
        style={styles.input}
        type="text"
        placeholder="Search products..."
        value={value}
        onChange={e => onChange(e.target.value)}
      />
      {value && (
        <button style={styles.clear} onClick={() => onChange('')}>✕</button>
      )}
    </div>
  )
}

const styles = {
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#f5f5f3',
    border: '1px solid #e5e5e5',
    padding: '0 14px',
    gap: '10px',
    maxWidth: '400px',
    margin: '0 auto 2rem auto',
  },
  icon: {
    fontSize: '14px',
    color: '#aaa',
  },
  input: {
    flex: 1,
    border: 'none',
    backgroundColor: 'transparent',
    padding: '11px 0',
    fontSize: '13px',
    fontFamily: 'inherit',
    outline: 'none',
    color: '#1a1a1a',
  },
  clear: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#aaa',
    fontSize: '13px',
    padding: '4px',
  },
}

export default SearchBar