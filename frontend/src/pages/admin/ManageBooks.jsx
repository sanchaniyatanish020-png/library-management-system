import { useState, useEffect } from 'react'
import { getBooks, addBook, deleteBook } from '../../api/books'
import Topbar from '../../components/layout/Topbar'
import Modal from '../../components/ui/Modal'

const ManageBooks = () => {
  const [books, setBooks] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [message, setMessage] = useState({ text: '', type: '' })
  const [form, setForm] = useState({
    title: '', author: '', isbn: '', genre: '', total_copies: 1
  })

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

  const handleAdd = async (e) => {
    e.preventDefault()
    try {
      await addBook(form)
      showMessage('Book added successfully!', 'success')
      setShowModal(false)
      setForm({ title: '', author: '', isbn: '', genre: '', total_copies: 1 })
      fetchBooks()
    } catch (err) {
      showMessage(err.response?.data?.error || 'Failed to add book', 'error')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this book?')) return
    try {
      await deleteBook(id)
      showMessage('Book deleted!', 'success')
      fetchBooks()
    } catch (err) {
      showMessage(err.response?.data?.error || 'Failed to delete', 'error')
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
      <Topbar title="Manage Books">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
          <input
            type="text"
            placeholder="Search books..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-indigo-400 w-52"
          />
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          + Add Book
        </button>
      </Topbar>

      <div className="p-6">

        {message.text && (
          <div className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-medium ${
            message.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
          }`}>
            {message.type === 'success' ? '✅' : '❌'} {message.text}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
            <p className="text-xs text-slate-500 mb-1">Total Books</p>
            <p className="text-2xl font-bold text-slate-800">{books.length}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
            <p className="text-xs text-slate-500 mb-1">Available</p>
            <p className="text-2xl font-bold text-emerald-600">
              {books.filter(b => b.available_copies > 0).length}
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
            <p className="text-xs text-slate-500 mb-1">Unavailable</p>
            <p className="text-2xl font-bold text-red-500">
              {books.filter(b => b.available_copies === 0).length}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden border border-slate-100 animate-pulse">
                <div className="h-28 bg-slate-200" />
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
                className="bg-white rounded-xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-all"
              >
                <div className={`h-28 bg-gradient-to-br ${coverColors[i % coverColors.length]} flex items-center justify-center`}>
                  <span className="text-3xl">📖</span>
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
                      {book.available_copies}/{book.total_copies} left
                    </span>
                  </div>
                  <button
                    onClick={() => handleDelete(book.id)}
                    className="w-full py-1.5 bg-white hover:bg-red-50 text-red-500 border border-red-200 text-xs font-medium rounded-lg transition-colors"
                  >
                    Delete
                  </button>
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

      {showModal && (
        <Modal title="Add New Book" onClose={() => setShowModal(false)}>
          <form onSubmit={handleAdd} className="space-y-4">
            {[
              { key: 'title', label: 'Title', required: true },
              { key: 'author', label: 'Author', required: true },
              { key: 'isbn', label: 'ISBN', required: false },
              { key: 'genre', label: 'Genre', required: false },
            ].map(({ key, label, required }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  {label} {required && <span className="text-red-400">*</span>}
                </label>
                <input
                  placeholder={label}
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  required={required}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            ))}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Number of Copies <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                min="1"
                value={form.total_copies}
                onChange={(e) => setForm({ ...form, total_copies: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg text-sm transition-colors mt-2"
            >
              Add Book
            </button>
          </form>
        </Modal>
      )}
    </div>
  )
}

export default ManageBooks