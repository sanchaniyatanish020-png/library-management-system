import api from './axios'

export const getReservations = () => api.get('/reservations')
export const reserveBook = (data) => api.post('/reservations', data)
export const cancelReservation = (bookId) => api.delete(`/reservations/${bookId}`)