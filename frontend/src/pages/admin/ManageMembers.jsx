import { useState, useEffect } from 'react'
import { getUsers, deleteUser } from '../../api/users'
import Topbar from '../../components/layout/Topbar'

const ManageMembers = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState({ text: '', type: '' })

  const fetchUsers = async () => {
    try {
      const res = await getUsers()
      setUsers(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchUsers() }, [])

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type })
    setTimeout(() => setMessage({ text: '', type: '' }), 3000)
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this member?')) return
    try {
      await deleteUser(id)
      showMessage('Member deleted!', 'success')
      fetchUsers()
    } catch (err) {
      showMessage(err.response?.data?.error || 'Failed to delete', 'error')
    }
  }

  return (
    <div>
      <Topbar title="Manage Members" />
      <div className="p-6">

        {message.text && (
          <div className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-medium ${
            message.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
          }`}>
            {message.type === 'success' ? '✅' : '❌'} {message.text}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
            <p className="text-xs text-slate-500 mb-1">Total Members</p>
            <p className="text-2xl font-bold text-slate-800">{users.length}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
            <p className="text-xs text-slate-500 mb-1">Admins</p>
            <p className="text-2xl font-bold text-indigo-600">
              {users.filter(u => u.role === 'admin').length}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-16 text-slate-400 text-sm">Loading...</div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100">
              <h3 className="text-sm font-semibold text-slate-700">
                All Members ({users.length})
              </h3>
            </div>
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50">
                  <th className="text-left text-xs font-medium text-slate-500 px-5 py-3">Member</th>
                  <th className="text-left text-xs font-medium text-slate-500 px-5 py-3">Email</th>
                  <th className="text-left text-xs font-medium text-slate-500 px-5 py-3">Role</th>
                  <th className="text-left text-xs font-medium text-slate-500 px-5 py-3">Joined</th>
                  <th className="text-left text-xs font-medium text-slate-500 px-5 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-t border-slate-50 hover:bg-slate-50">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-sm font-bold">
                          {u.name?.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm font-medium text-slate-700">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-xs text-slate-500">{u.email}</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        u.role === 'admin'
                          ? 'bg-indigo-100 text-indigo-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-xs text-slate-500">
                      {u.created_at?.slice(0, 10)}
                    </td>
                    <td className="px-5 py-3">
                      {u.role !== 'admin' && (
                        <button
                          onClick={() => handleDelete(u.id)}
                          className="text-xs px-3 py-1.5 bg-white hover:bg-red-50 text-red-500 border border-red-200 rounded-lg transition-colors"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-5 py-12 text-center text-sm text-slate-400">
                      No members found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default ManageMembers