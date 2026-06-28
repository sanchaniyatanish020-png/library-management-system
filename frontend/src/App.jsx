import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/layout/ProtectedRoute'
import AdminRoute from './components/layout/AdminRoute'
import Sidebar from './components/layout/Sidebar'

import Login from './pages/Login'
import Register from './pages/Register'
import Catalog from './pages/member/Catalog'
import MyBorrows from './pages/member/MyBorrows'
import Reservations from './pages/member/Reservations'
import Fines from './pages/member/Fines'
import Dashboard from './pages/admin/Dashboard'
import ManageBooks from './pages/admin/ManageBooks'
import ManageMembers from './pages/admin/ManageMembers'
import AllBorrows from './pages/admin/AllBorrows'

import './App.css'

const Layout = ({ children }) => (
  <div className="app-layout">
    <Sidebar />
    <div className="app-main">{children}</div>
  </div>
)

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/catalog" element={
            <ProtectedRoute>
              <Layout><Catalog /></Layout>
            </ProtectedRoute>
          } />

          <Route path="/my-borrows" element={
            <ProtectedRoute>
              <Layout><MyBorrows /></Layout>
            </ProtectedRoute>
          } />

          <Route path="/reservations" element={
            <ProtectedRoute>
              <Layout><Reservations /></Layout>
            </ProtectedRoute>
          } />

          <Route path="/fines" element={
            <ProtectedRoute>
              <Layout><Fines /></Layout>
            </ProtectedRoute>
          } />

          <Route path="/admin/dashboard" element={
            <ProtectedRoute>
              <AdminRoute>
                <Layout><Dashboard /></Layout>
              </AdminRoute>
            </ProtectedRoute>
          } />

          <Route path="/admin/books" element={
            <ProtectedRoute>
              <AdminRoute>
                <Layout><ManageBooks /></Layout>
              </AdminRoute>
            </ProtectedRoute>
          } />

          <Route path="/admin/members" element={
            <ProtectedRoute>
              <AdminRoute>
                <Layout><ManageMembers /></Layout>
              </AdminRoute>
            </ProtectedRoute>
          } />

          <Route path="/admin/borrows" element={
            <ProtectedRoute>
              <AdminRoute>
                <Layout><AllBorrows /></Layout>
              </AdminRoute>
            </ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App