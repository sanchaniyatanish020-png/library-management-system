import api from './axios'

export const getFines = () => api.get('/fines')
export const payFine = (id) => api.put(`/fines/pay/${id}`)