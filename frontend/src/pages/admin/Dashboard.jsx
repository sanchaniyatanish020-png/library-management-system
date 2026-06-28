import { useState, useEffect } from 'react'
import { getBooks } from '../../api/books'
import { getBorrows } from '../../api/borrows'
import { getUsers } from '../../api/users'
import Topbar from '../../components/layout/Topbar'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, ResponsiveContainer, Legend
} from 'recharts'

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444']

const StatCard = ({ label, value, icon, color, sub }) => (
  <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
    <div className="flex items-center justify-between mb-3">
      <p className="text-sm text-slate-500">{label}</p>
      <span className="text-2xl">{icon}</span>
    </div>
    <p className={`text-3xl font-bold ${color || 'text-slate-800'}`}>{value}</p>
    {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
  </div>
)

const Dashboard = () => {
  const [stats, setStats] = useState({ books: 0, borrows: 0, members: 0, overdue: 0 })
  const [recentBorrows, setRecentBorrows] = useState([])
  const [barData, setBarData] = useState([])
  const [pieData, setPieData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [books, borrows, users] = await Promise.all([
          getBooks(), getBorrows(), getUsers()
        ])

        const active = borrows.data.filter(b => !b.returned_at)
        const overdue = active.filter(b => new Date() > new Date(b.due_date))
        const returned = borrows.data.filter(b => b.returned_at)

        setStats({
          books: books.data.length,
          borrows: active.length,
          members: users.data.length,
          overdue: overdue.length
        })

        setRecentBorrows(borrows.data.slice(0, 6))

        // Bar chart — books by genre
        const genreCount = {}
        books.data.forEach(b => {
          const g = b.genre || 'Unknown'
          genreCount[g] = (genreCount[g] || 0) + 1
        })
        setBarData(Object.entries(genreCount).map(([genre, count]) => ({ genre, count })))

        // Pie chart — borrow status
        setPieData([
          { name: 'Active', value: active.length - overdue.length },
          { name: 'Returned', value: returned.length },
          { name: 'Overdue', value: overdue.length },
        ])

      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  return (
    <div>
      <Topbar title="Admin Dashboard" />
      <div className="p-6">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-slate-400 text-sm">Loading dashboard...</div>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <StatCard label="Total Books" value={stats.books} icon="📚" sub="In collection" />
              <StatCard label="Active Borrows" value={stats.borrows} icon="🔖" sub="Currently out" />
              <StatCard label="Total Members" value={stats.members} icon="👥" sub="Registered users" />
              <StatCard label="Overdue" value={stats.overdue} icon="⚠️" color="text-red-500" sub="Need attention" />
            </div>

            {/* Charts */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">

              {/* Bar Chart */}
              <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
                <h3 className="text-sm font-semibold text-slate-700 mb-4">Books by Genre</h3>
                {barData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={barData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="genre" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-48 text-slate-400 text-sm">
                    Add books to see chart
                  </div>
                )}
              </div>

              {/* Pie Chart */}
              <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
                <h3 className="text-sm font-semibold text-slate-700 mb-4">Borrow Status</h3>
                {pieData.some(d => d.value > 0) ? (
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {pieData.map((_, index) => (
                          <Cell key={index} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-48 text-slate-400 text-sm">
                    No borrow data yet
                  </div>
                )}
              </div>
            </div>

            {/* Recent Borrows */}
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100">
                <h3 className="text-sm font-semibold text-slate-700">Recent Borrows</h3>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="text-left text-xs font-medium text-slate-500 px-5 py-3">Borrow ID</th>
                    <th className="text-left text-xs font-medium text-slate-500 px-5 py-3">Issued</th>
                    <th className="text-left text-xs font-medium text-slate-500 px-5 py-3">Due Date</th>
                    <th className="text-left text-xs font-medium text-slate-500 px-5 py-3">Status</th>
                    <th className="text-left text-xs font-medium text-slate-500 px-5 py-3">Fine</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBorrows.map((b) => {
                    const overdue = !b.returned_at && new Date() > new Date(b.due_date)
                    const status = b.returned_at ? 'returned' : overdue ? 'overdue' : 'active'
                    const statusStyle = {
                      returned: 'bg-green-100 text-green-700',
                      overdue: 'bg-red-100 text-red-700',
                      active: 'bg-blue-100 text-blue-700'
                    }[status]

                    return (
                      <tr key={b.id} className="border-t border-slate-50 hover:bg-slate-50">
                        <td className="px-5 py-3 text-xs text-slate-600">{b.id?.slice(0, 8)}...</td>
                        <td className="px-5 py-3 text-xs text-slate-600">{b.issued_at?.slice(0, 10)}</td>
                        <td className="px-5 py-3 text-xs text-slate-600">{b.due_date}</td>
                        <td className="px-5 py-3">
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusStyle}`}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-xs font-medium" style={{ color: b.fine > 0 ? '#ef4444' : '#94a3b8' }}>
                          {b.fine > 0 ? `₹${b.fine}` : '—'}
                        </td>
                      </tr>
                    )
                  })}
                  {recentBorrows.length === 0 && (
                    <tr>
                      <td colSpan="5" className="px-5 py-8 text-center text-sm text-slate-400">
                        No borrows yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Dashboard