import api from './axios'

export const getUsers = () => api.get('/users')
export const deleteUser = (id) => api.delete(`/users/${id}`)
export const makeAdmin = (id) => api.put(`/users/${id}/make-admin`)
export const removeAdmin = (id) => api.put(`/users/${id}/remove-admin`)