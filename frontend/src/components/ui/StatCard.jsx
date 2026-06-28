import './StatCard.css'

const StatCard = ({ label, value, sub, color }) => {
  return (
    <div className="stat-card">
      <p className="stat-label">{label}</p>
      <p className="stat-value" style={{ color: color || '#1a1a2e' }}>{value}</p>
      {sub && <p className="stat-sub">{sub}</p>}
    </div>
  )
}

export default StatCard