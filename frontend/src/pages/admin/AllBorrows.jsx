import { useState, useEffect } from 'react'
import { getBorrows } from '../../api/borrows'
import Topbar from '../../components/layout/Topbar'

const AllBorrows = () => {
  const [borrows, setBorrows] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    const fetchBorrows = async () => {
      try {
        const res = await getBorrows()
        setBorrows(res.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchBorrows()
  }, [])

  const filtered = borrows.filter(b => {
    if (filter === 'active') return !b.returned_at && new Date() <= new Date(b.due_date)
    if (filter === 'overdue') return !b.returned_at && new Date() > new Date(b.due_date)
    if (filter === 'returned') return b.returned_at
    return true
  })

  return (
    <div>
      <Topbar title="All Borrows">
        <div className="flex gap-2">
          {['all', 'active', 'overdue', 'returned'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg capitalize transition-colors ${
                filter === f
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </Topbar>

      <div className="p-6">

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
            <p className="text-xs text-slate-500 mb-1">Total</p>
            <p className="text-2xl font-bold text-slate-800">{borrows.length}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
            <p className="text-xs text-slate-500 mb-1">Active</p>
            <p className="text-2xl font-bold text-blue-600">
              {borrows.filter(b => !b.returned_at && new Date() <= new Date(b.due_date)).length}
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
            <p className="text-xs text-slate-500 mb-1">Overdue</p>
            <p className="text-2xl font-bold text-red-500">
              {borrows.filter(b => !b.returned_at && new Date() > new Date(b.due_date)).length}
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
            <p className="text-xs text-slate-500 mb-1">Returned</p>
            <p className="text-2xl font-bold text-emerald-600">
              {borrows.filter(b => b.returned_at).length}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-16 text-slate-400 text-sm">Loading...</div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100">
              <h3 className="text-sm font-semibold text-slate-700">
                {filter.charAt(0).toUpperCase() + filter.slice(1)} Borrows ({filtered.length})
              </h3>
            </div>
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50">
                  <th className="text-left text-xs font-medium text-slate-500 px-5 py-3">Borrow ID</th>
                  <th className="text-left text-xs font-medium text-slate-500 px-5 py-3">User ID</th>
                  <th className="text-left text-xs font-medium text-slate-500 px-5 py-3">Book ID</th>
                  <th className="text-left text-xs font-medium text-slate-500 px-5 py-3">Issued</th>
                  <th className="text-left text-xs font-medium text-slate-500 px-5 py-3">Due Date</th>
                  <th className="text-left text-xs font-medium text-slate-500 px-5 py-3">Status</th>
                  <th className="text-left text-xs font-medium text-slate-500 px-5 py-3">Fine</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((b) => {
                  const overdue = !b.returned_at && new Date() > new Date(b.due_date)
                  const status = b.returned_at ? 'returned' : overdue ? 'overdue' : 'active'
                  const statusStyle = {
                    returned: 'bg-emerald-100 text-emerald-700',
                    overdue: 'bg-red-100 text-red-700',
                    active: 'bg-blue-100 text-blue-700'
                  }[status]

                  return (
                    <tr key={b.id} className="border-t border-slate-50 hover:bg-slate-50">
                      <td className="px-5 py-3 text-xs font-mono text-slate-600">{b.id?.slice(0, 8)}...</td>
                      <td className="px-5 py-3 text-xs font-mono text-slate-600">{b.user_id?.toString().slice(0, 8)}...</td>
                      <td className="px-5 py-3 text-xs font-mono text-slate-600">{b.book_id?.toString().slice(0, 8)}...</td>
                      <td className="px-5 py-3 text-xs text-slate-600">{b.issued_at?.slice(0, 10)}</td>
                      <td className="px-5 py-3 text-xs text-slate-600">{b.due_date}</td>
                      <td className="px-5 py-3">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusStyle}`}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-xs font-semibold"
                        style={{ color: b.fine > 0 ? '#ef4444' : '#94a3b8' }}>
                        {b.fine > 0 ? `₹${b.fine}` : '—'}
                      </td>
                    </tr>
                  )
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan="7" className="px-5 py-12 text-center text-sm text-slate-400">
                      No borrows found
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

export default AllBorrows