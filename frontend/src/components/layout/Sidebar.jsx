import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './Sidebar.css'

const Sidebar = () => {
  const { user, logoutUser } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logoutUser()
    navigate('/login')
  }

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <h2>📚 LibraryOS</h2>
        <p>Management System</p>
      </div>

      <nav className="sidebar-nav">
        <p className="nav-label">Member</p>
        <NavLink to="/catalog">📖 Book Catalog</NavLink>
        <NavLink to="/my-borrows">🔖 My Borrows</NavLink>
        <NavLink to="/reservations">⏰ Reservations</NavLink>
        <NavLink to="/fines">🧾 Fines</NavLink>

        {user?.role === 'admin' && (
          <>
            <p className="nav-label">Admin</p>
            <NavLink to="/admin/dashboard">📊 Dashboard</NavLink>
            <NavLink to="/admin/books">📚 Manage Books</NavLink>
            <NavLink to="/admin/members">👥 Members</NavLink>
            <NavLink to="/admin/borrows">📋 All Borrows</NavLink>
          </>
        )}
      </nav>

      <div className="sidebar-bottom">
        <div className="user-info">
          <div className="avatar">{user?.name?.charAt(0).toUpperCase()}</div>
          <div>
            <p className="user-name">{user?.name}</p>
            <p className="user-role">{user?.role}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>
    </div>
  )
}

export default Sidebar