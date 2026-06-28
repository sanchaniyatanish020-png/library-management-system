import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const Sidebar = () => {
  const { user, logoutUser } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => {
    logoutUser()
    navigate('/login')
  }

  const navItem = (to, icon, label) => (
    <NavLink
      to={to}
      onClick={() => setMobileOpen(false)}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-2.5 rounded-lg mx-2 text-sm transition-all duration-150 ${isActive
          ? 'bg-indigo-600 text-white font-medium'
          : 'text-slate-400 hover:bg-slate-800 hover:text-white'
        }`
      }
    >
      <span className="text-lg">{icon}</span>
      {label}
    </NavLink>
  )

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="px-5 py-5 border-b border-slate-700 flex items-center justify-between">
        <div>
          <h1 className="text-white font-bold text-lg">BookVault</h1>
          <p className="text-slate-500 text-xs mt-0.5">Library Management System</p>
        </div>
        <button
          onClick={() => setMobileOpen(false)}
          className="md:hidden text-slate-400 hover:text-white text-xl"
        >
          ✕
        </button>
      </div>

      <nav className="flex-1 py-4 space-y-0.5 overflow-y-auto">
        <p className="text-slate-600 text-xs px-6 pb-2 pt-2 uppercase tracking-wider">Member</p>
        {navItem('/catalog', '📖', 'Book Catalog')}
        {navItem('/my-borrows', '🔖', 'My Borrows')}
        {navItem('/reservations', '⏰', 'Reservations')}
        {navItem('/fines', '🧾', 'Fines')}

        {user?.role === 'admin' && (
          <>
            <p className="text-slate-600 text-xs px-6 pb-2 pt-4 uppercase tracking-wider">Admin</p>
            {navItem('/admin/dashboard', '📊', 'Dashboard')}
            {navItem('/admin/books', '📚', 'Manage Books')}
            {navItem('/admin/members', '👥', 'Members')}
            {navItem('/admin/borrows', '📋', 'All Borrows')}
          </>
        )}
      </nav>

      <div className="p-4 border-t border-slate-700">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-bold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-white text-sm font-medium leading-none">{user?.name}</p>
            <p className="text-slate-500 text-xs mt-0.5 capitalize">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full py-2 text-sm text-slate-400 hover:text-white hover:bg-red-600 rounded-lg transition-all duration-150"
        >
          Logout
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex fixed left-0 top-0 h-screen w-56 bg-slate-900 flex-col z-50">
        <SidebarContent />
      </div>

      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-slate-900 px-4 py-3 flex items-center justify-between">
       <h1 className="text-white font-bold text-base">BookVault</h1>
        <button
          onClick={() => setMobileOpen(true)}
          className="text-white text-2xl"
        >
          ☰
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="w-64 bg-slate-900 h-full flex flex-col">
            <SidebarContent />
          </div>
          <div
            className="flex-1 bg-black bg-opacity-50"
            onClick={() => setMobileOpen(false)}
          />
        </div>
      )}

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-900 border-t border-slate-700 flex items-center justify-around px-2 py-2">
        <NavLink to="/catalog" className={({ isActive }) =>
          `flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg text-xs transition-all ${isActive ? 'text-indigo-400' : 'text-slate-500'
          }`
        }>
          <span className="text-xl">📖</span>
          <span>Catalog</span>
        </NavLink>
        <NavLink to="/my-borrows" className={({ isActive }) =>
          `flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg text-xs transition-all ${isActive ? 'text-indigo-400' : 'text-slate-500'
          }`
        }>
          <span className="text-xl">🔖</span>
          <span>Borrows</span>
        </NavLink>
        <NavLink to="/reservations" className={({ isActive }) =>
          `flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg text-xs transition-all ${isActive ? 'text-indigo-400' : 'text-slate-500'
          }`
        }>
          <span className="text-xl">⏰</span>
          <span>Reservations</span>
        </NavLink>
        <NavLink to="/fines" className={({ isActive }) =>
          `flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg text-xs transition-all ${isActive ? 'text-indigo-400' : 'text-slate-500'
          }`
        }>
          <span className="text-xl">🧾</span>
          <span>Fines</span>
        </NavLink>
        {user?.role === 'admin' && (
          <NavLink to="/admin/dashboard" className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg text-xs transition-all ${isActive ? 'text-indigo-400' : 'text-slate-500'
            }`
          }>
            <span className="text-xl">📊</span>
            <span>Admin</span>
          </NavLink>
        )}
      </div>
    </>
  )
}

export default Sidebar