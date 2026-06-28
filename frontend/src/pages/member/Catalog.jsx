import { useState, useEffect } from 'react'
import { getBooks } from '../../api/books'
import { issueBook } from '../../api/borrows'
import { reserveBook } from '../../api/reservations'
import Topbar from '../../components/layout/Topbar'

const Catalog = () => {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [message, setMessage] = useState({ text: '', type: '' })
  const [loadingBtn, setLoadingBtn] = useState('')

  const fetchBooks = async (q = '') => {
    try {
      const res = await getBooks(q)
      setBooks(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchBooks() }, [])

  useEffect(() => {
    const delay = setTimeout(() => fetchBooks(search), 400)
    return () => clearTimeout(delay)
  }, [search])

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type })
    setTimeout(() => setMessage({ text: '', type: '' }), 3000)
  }

  const handleBorrow = async (bookId) => {
    setLoadingBtn('borrow-' + bookId)
    try {
      await issueBook({ book_id: bookId })
      showMessage('Book borrowed successfully! Due in 14 days.', 'success')
      fetchBooks(search)
    } catch (err) {
      showMessage(err.response?.data?.error || 'Failed to borrow', 'error')
    } finally {
      setLoadingBtn('')
    }
  }

  const handleReserve = async (bookId) => {
    setLoadingBtn('reserve-' + bookId)
    try {
      await reserveBook({ book_id: bookId })
      showMessage('Book reserved successfully!', 'success')
    } catch (err) {
      showMessage(err.response?.data?.error || 'Failed to reserve', 'error')
    } finally {
      setLoadingBtn('')
    }
  }

  const coverColors = [
    'from-indigo-400 to-indigo-600',
    'from-emerald-400 to-emerald-600',
    'from-amber-400 to-amber-600',
    'from-rose-400 to-rose-600',
    'from-violet-400 to-violet-600',
    'from-cyan-400 to-cyan-600',
  ]

  return (
    <div>
      <Topbar title="Book Catalog">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
          <input
            type="text"
            placeholder="Search books, authors, genres..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-indigo-400 w-64"
          />
        </div>
      </Topbar>

      <div className="p-6">

        {/* Toast */}
        {message.text && (
          <div className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-medium transition-all ${
            message.type === 'success'
              ? 'bg-emerald-500 text-white'
              : 'bg-red-500 text-white'
          }`}>
            {message.type === 'success' ? '✅' : '❌'} {message.text}
          </div>
        )}

        {/* Stats bar */}
        <div className="flex items-center gap-6 mb-6">
          <p className="text-sm text-slate-500">
            <span className="font-semibold text-slate-700">{books.length}</span> books found
          </p>
          <p className="text-sm text-slate-500">
            <span className="font-semibold text-emerald-600">
              {books.filter(b => b.available_copies > 0).length}
            </span> available
          </p>
          <p className="text-sm text-slate-500">
            <span className="font-semibold text-amber-600">
              {books.filter(b => b.available_copies === 0).length}
            </span> unavailable
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden border border-slate-100 animate-pulse">
                <div className="h-32 bg-slate-200" />
                <div className="p-4 space-y-2">
                  <div className="h-3 bg-slate-200 rounded w-3/4" />
                  <div className="h-3 bg-slate-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {books.map((book, i) => (
              <div
                key={book.id}
                className="bg-white rounded-xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
              >
                <div className={`h-32 bg-gradient-to-br ${coverColors[i % coverColors.length]} flex items-center justify-center`}>
                  <span className="text-4xl">📖</span>
                </div>

                <div className="p-4">
                  <h3 className="text-sm font-semibold text-slate-800 leading-tight mb-1 line-clamp-2">
                    {book.title}
                  </h3>
                  <p className="text-xs text-slate-500 mb-1">{book.author}</p>
                  <p className="text-xs text-slate-400 mb-3">{book.genre || 'General'}</p>

                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      book.available_copies > 0
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {book.available_copies > 0 ? 'Available' : 'Unavailable'}
                    </span>
                    <span className="text-xs text-slate-400">{book.available_copies} left</span>
                  </div>

                  {book.available_copies > 0 ? (
                    <button
                      onClick={() => handleBorrow(book.id)}
                      disabled={loadingBtn === 'borrow-' + book.id}
                      className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 active:scale-95 disabled:opacity-60 text-white text-xs font-medium rounded-lg transition-all duration-150"
                    >
                      {loadingBtn === 'borrow-' + book.id ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                          </svg>
                          Borrowing...
                        </span>
                      ) : 'Borrow Book'}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleReserve(book.id)}
                      disabled={loadingBtn === 'reserve-' + book.id}
                      className="w-full py-2 bg-white hover:bg-amber-50 active:bg-amber-100 active:scale-95 disabled:opacity-60 text-amber-600 border border-amber-300 text-xs font-medium rounded-lg transition-all duration-150"
                    >
                      {loadingBtn === 'reserve-' + book.id ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                          </svg>
                          Reserving...
                        </span>
                      ) : 'Reserve Book'}
                    </button>
                  )}
                </div>
              </div>
            ))}

            {books.length === 0 && (
              <div className="col-span-4 text-center py-16 text-slate-400">
                <div className="text-5xl mb-3">📭</div>
                <p className="text-sm">No books found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Catalog