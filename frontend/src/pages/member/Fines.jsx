import { useState, useEffect } from 'react'
import { getFines, payFine } from '../../api/fines'
import Topbar from '../../components/layout/Topbar'

const Fines = () => {
  const [fines, setFines] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState({ text: '', type: '' })

  const fetchFines = async () => {
    try {
      const res = await getFines()
      setFines(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchFines() }, [])

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type })
    setTimeout(() => setMessage({ text: '', type: '' }), 3000)
  }

  const handlePay = async (id) => {
    try {
      await payFine(id)
      showMessage('Fine paid successfully!', 'success')
      fetchFines()
    } catch (err) {
      showMessage(err.response?.data?.error || 'Failed to pay', 'error')
    }
  }

  const total = fines.reduce((sum, f) => sum + f.fine, 0)

  return (
    <div>
      <Topbar title="My Fines" />
      <div className="p-6">

        {message.text && (
          <div className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-medium ${
            message.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
          }`}>
            {message.type === 'success' ? '✅' : '❌'} {message.text}
          </div>
        )}

        {/* Total fine card */}
        {total > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-5 mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600 font-medium">Total Outstanding Fines</p>
              <p className="text-3xl font-bold text-red-600 mt-1">₹{total}</p>
              <p className="text-xs text-red-400 mt-1">Fine rate: ₹5 per day per book</p>
            </div>
            <div className="text-5xl">⚠️</div>
          </div>
        )}

        {total === 0 && !loading && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 mb-6 flex items-center gap-4">
            <div className="text-4xl">✅</div>
            <div>
              <p className="text-sm font-medium text-emerald-700">No outstanding fines!</p>
              <p className="text-xs text-emerald-500 mt-0.5">You are all clear</p>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-16 text-slate-400 text-sm">Loading...</div>
        ) : fines.length > 0 ? (
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100">
              <h3 className="text-sm font-semibold text-slate-700">Outstanding Fines</h3>
            </div>
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50">
                  <th className="text-left text-xs font-medium text-slate-500 px-5 py-3">Borrow ID</th>
                  <th className="text-left text-xs font-medium text-slate-500 px-5 py-3">Due Date</th>
                  <th className="text-left text-xs font-medium text-slate-500 px-5 py-3">Fine Amount</th>
                  <th className="text-left text-xs font-medium text-slate-500 px-5 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {fines.map((f, i) => (
                  <tr key={i} className="border-t border-slate-50 hover:bg-slate-50">
                    <td className="px-5 py-3 text-xs text-slate-600 font-mono">
                      {f.borrow_id?.slice(0, 8)}...
                    </td>
                    <td className="px-5 py-3 text-xs text-slate-600">{f.due_date}</td>
                    <td className="px-5 py-3">
                      <span className="text-sm font-bold text-red-500">₹{f.fine}</span>
                    </td>
                    <td className="px-5 py-3">
                      <button
                        onClick={() => handlePay(f.borrow_id)}
                        className="text-xs px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                      >
                        Pay Fine
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default Fines