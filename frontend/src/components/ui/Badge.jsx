const Badge = ({ status }) => {
  const styles = {
    available: { background: '#e6ffed', color: '#276749' },
    unavailable: { background: '#ffe6e6', color: '#c53030' },
    reserved: { background: '#fff8e6', color: '#b7791f' },
    active: { background: '#e6f0ff', color: '#2b6cb0' },
    overdue: { background: '#ffe6e6', color: '#c53030' },
    returned: { background: '#e6ffed', color: '#276749' },
    paid: { background: '#e6ffed', color: '#276749' },
    unpaid: { background: '#ffe6e6', color: '#c53030' },
  }

  const style = styles[status] || { background: '#eee', color: '#333' }

  return (
    <span style={{
      ...style,
      padding: '2px 10px',
      borderRadius: '4px',
      fontSize: '11px',
      fontWeight: '500'
    }}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

export default Badge