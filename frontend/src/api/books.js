import api from './axios'

export const getBooks = (search = '') =>
  api.get(`/books${search ? `?search=${search}` : ''}`)
export const getBook = (id) => api.get(`/books/${id}`)
export const addBook = (data) => api.post('/books', data)
export const updateBook = (id, data) => api.put(`/books/${id}`, data)
export const deleteBook = (id) => api.delete(`/books/${id}`)