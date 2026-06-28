import { useState, useEffect } from 'react'
import { getReservations, cancelReservation } from '../../api/reservations'
import Topbar from '../../components/layout/Topbar'

const Reservations = () => {
  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState({ text: '', type: '' })

  const fetchReservations = async () => {
    try {
      const res = await getReservations()
      setReservations(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchReservations() }, [])

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type })
    setTimeout(() => setMessage({ text: '', type: '' }), 3000)
  }

  const handleCancel = async (bookId) => {
    try {
      await cancelReservation(bookId)
      showMessage('Reservation cancelled!', 'success')
      fetchReservations()
    } catch (err) {
      showMessage(err.response?.data?.error || 'Failed to cancel', 'error')
    }
  }

  return (
    <div>
      <Topbar title="My Reservations" />
      <div className="p-6">

        {message.text && (
          <div className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-medium ${
            message.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
          }`}>
            {message.type === 'success' ? '✅' : '❌'} {message.text}
          </div>
        )}

        {loading ? (
          <div className="text-center py-16 text-slate-400 text-sm">Loading...</div>
        ) : reservations.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-3">⏰</div>
            <p className="text-slate-400 text-sm">No reservations yet</p>
            <p className="text-slate-300 text-xs mt-1">Reserve a book from the catalog when it's unavailable</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100">
              <h3 className="text-sm font-semibold text-slate-700">
                Active Reservations ({reservations.length})
              </h3>
            </div>
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50">
                  <th className="text-left text-xs font-medium text-slate-500 px-5 py-3">Book ID</th>
                  <th className="text-left text-xs font-medium text-slate-500 px-5 py-3">Reserved On</th>
                  <th className="text-left text-xs font-medium text-slate-500 px-5 py-3">Queue Position</th>
                  <th className="text-left text-xs font-medium text-slate-500 px-5 py-3">Status</th>
                  <th className="text-left text-xs font-medium text-slate-500 px-5 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((r, i) => (
                  <tr key={i} className="border-t border-slate-50 hover:bg-slate-50">
                    <td className="px-5 py-3 text-xs text-slate-600 font-mono">
                      {r.book_id?.toString().slice(0, 8)}...
                    </td>
                    <td className="px-5 py-3 text-xs text-slate-600">
                      {r.queue?.[0]?.reserved_at?.slice(0, 10)}
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-xs font-semibold text-indigo-600">
                        #{r.queue?.length} in queue
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-xs px-2 py-1 rounded-full font-medium bg-amber-100 text-amber-700">
                        Waiting
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <button
                        onClick={() => handleCancel(r.book_id?.toString())}
                        className="text-xs px-3 py-1.5 bg-white hover:bg-red-50 text-red-500 border border-red-200 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default Reservations