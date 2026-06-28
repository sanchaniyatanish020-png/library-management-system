import api from './axios'

export const getBorrows = () => api.get('/borrows')
export const issueBook = (data) => api.post('/borrows/issue', data)
export const returnBook = (id) => api.put(`/borrows/return/${id}`)