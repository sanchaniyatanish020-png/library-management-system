import { useState, useEffect } from 'react'
import { getBorrows, returnBook } from '../../api/borrows'
import Topbar from '../../components/layout/Topbar'

const MyBorrows = () => {
    const [borrows, setBorrows] = useState([])
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState({ text: '', type: '' })

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

    useEffect(() => { fetchBorrows() }, [])

    const showMessage = (text, type = 'success') => {
        setMessage({ text, type })
        setTimeout(() => setMessage({ text: '', type: '' }), 3000)
    }

    const handleReturn = async (id) => {
        try {
            const res = await returnBook(id)
            showMessage(`Book returned! Fine: ${res.data.fine}`, 'success')
            fetchBorrows()
        } catch (err) {
            showMessage(err.response?.data?.error || 'Failed to return', 'error')
        }
    }

    const isOverdue = (dueDate) => new Date() > new Date(dueDate)

    const active = borrows.filter(b => !b.returned_at)
    const returned = borrows.filter(b => b.returned_at)

    const getFineColor = (fine) => {
        return Number(fine) > 0 ? '#ef4444' : '#94a3b8'
    }

    const getFineText = (fine) => {
        return Number(fine) > 0 ? `Rs.${fine}` : '--'
    }

    return (
        <div>
            <Topbar title="My Borrows" />
            <div className="p-6">

                {message.text && (
                    <div className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-medium ${message.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
                        }`}>
                        {message.text}
                    </div>
                )}

                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
                        <p className="text-xs text-slate-500 mb-1">Active Borrows</p>
                        <p className="text-2xl font-bold text-slate-800">{active.length}</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
                        <p className="text-xs text-slate-500 mb-1">Overdue</p>
                        <p className="text-2xl font-bold text-red-500">
                            {active.filter(b => isOverdue(b.due_date)).length}
                        </p>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
                        <p className="text-xs text-slate-500 mb-1">Total Returned</p>
                        <p className="text-2xl font-bold text-emerald-600">{returned.length}</p>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-16 text-slate-400 text-sm">Loading...</div>
                ) : (
                    <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="px-5 py-4 border-b border-slate-100">
                            <h3 className="text-sm font-semibold text-slate-700">Borrow History</h3>
                        </div>
                        <table className="w-full">
                            <thead>
                                <tr className="bg-slate-50">
                                    <th className="text-left text-xs font-medium text-slate-500 px-5 py-3">Book ID</th>
                                    <th className="text-left text-xs font-medium text-slate-500 px-5 py-3">Issued</th>
                                    <th className="text-left text-xs font-medium text-slate-500 px-5 py-3">Due Date</th>
                                    <th className="text-left text-xs font-medium text-slate-500 px-5 py-3">Status</th>
                                    <th className="text-left text-xs font-medium text-slate-500 px-5 py-3">Fine</th>
                                    <th className="text-left text-xs font-medium text-slate-500 px-5 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {borrows.map((b) => {
                                    const overdue = !b.returned_at && isOverdue(b.due_date)
                                    const status = b.returned_at ? 'returned' : overdue ? 'overdue' : 'active'
                                    const statusStyle = {
                                        returned: 'bg-emerald-100 text-emerald-700',
                                        overdue: 'bg-red-100 text-red-700',
                                        active: 'bg-blue-100 text-blue-700'
                                    }[status]

                                    return (
                                        <tr key={b.id} className="border-t border-slate-50 hover:bg-slate-50">
                                            <td className="px-5 py-3 text-xs text-slate-600 font-mono">
                                                {b.book_id?.toString().slice(0, 8)}...
                                            </td>
                                            <td className="px-5 py-3 text-xs text-slate-600">
                                                {b.issued_at?.slice(0, 10)}
                                            </td>
                                            <td className="px-5 py-3 text-xs text-slate-600">{b.due_date}</td>
                                            <td className="px-5 py-3">
                                                <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusStyle}`}>
                                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3 text-xs font-semibold" style={{ color: getFineColor(b.fine) }}>
                                                {getFineText(b.fine)}
                                            </td>
                                            <td className="px-5 py-3">
                                                <div className="flex gap-2">
                                                    {!b.returned_at && (
                                                        <button
                                                            onClick={() => handleReturn(b.id)}
                                                            className="text-xs px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                                                        >
                                                            Return
                                                        </button>
                                                    )}

                                                    <a href={`http://localhost:8000/api/pdf/borrow/${b.id}`}
                                                        download={`receipt-${b.id}.pdf`}
                                                        className="text-xs px-3 py-1.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                                                    >
                                                        📄 Receipt
                                                    </a>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                                {borrows.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="px-5 py-12 text-center text-sm text-slate-400">
                                            <div className="text-4xl mb-2">📭</div>
                                            No borrows yet
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

export default MyBorrows