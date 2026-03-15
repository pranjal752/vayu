import axios from 'axios'

const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

const api = axios.create({ baseURL: BASE, timeout: 10000 })

export const getWards       = ()     => api.get('/api/v1/wards/')
export const getWardById    = (id)   => api.get(`/api/v1/wards/${id}`)
export const getWardForecast= (id)   => api.get(`/api/v1/wards/${id}/forecast`)
export const getWardSources = (id)   => api.get(`/api/v1/wards/${id}/sources`)
export const postReport     = (data) => api.post('/api/v1/reports/', data)

export default api
