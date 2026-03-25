import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL

const http = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
})

http.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

http.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('gynaecare_user')
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default http

export const authApi = {
  login: data => http.post('/auth/login', data),
  logout: () => http.post('/auth/logout'),
  me: () => http.get('/auth/me'),
}

export const patientApi = {
  getAll: () => http.get('/patients'),
  search: q => http.get(`/patients/search?q=${q}`),
  getById: id => http.get(`/patients/${id}`),
  create: data => http.post('/patients', data),
  update: (id, data) => http.patch(`/patients/${id}`, data),
  delete: id => http.delete(`/patients/${id}`),
  getTimeline: id => http.get(`/patients/${id}/timeline`),
  getEpisodes: id => http.get(`/patients/${id}/episodes`),
  addEpisode: (id, data) => http.post(`/patients/${id}/episodes`, data),
  addPartner: (id, data) => http.post(`/patients/${id}/partner`, data),
}

export const pregnancyApi = {
  getAll: () => http.get('/pregnancies'),
  getById: (id) => http.get(`/pregnancies/${id}`),
  create: (data) => http.post('/pregnancies', data),
  update: (id, data) => http.patch(`/pregnancies/${id}`, data),
  delete: (id) => http.delete(`/pregnancies/${id}`),

  getVisits: (id) => http.get(`/pregnancies/${id}/visits`),
  getVisitById: (id) => http.get(`/pregnancies/visits/${id}`),
  createVisit: (data) => http.post('/pregnancies/visits', data),
}

export const billingApi = {
  getAll: (params) => http.get('/billing/invoices', { params }),
  getById: (id) => http.get(`/billing/invoices/${id}`),
  create: (data) => http.post('/billing/invoices', data),
  recordPayment: (data) => http.post('/payments', data),
  getOutstanding: (patientId) => http.get(`/billing/outstanding/${patientId}`),
}

export const appointmentApi = {
  getAll: () => http.get('/appointments'),
  getByPatientId: (patientId) => http.get(`/appointments/patient/${patientId}`),
  getById: (id) => http.get(`/appointments/${id}`),
  create: (data) => http.post('/appointments', data),
  update: (id, data) => http.patch(`/appointments/${id}`, data),
  delete: (id) => http.delete(`/appointments/${id}`),
}

export const episodeApi = {
  getAll: (type) => http.get('/episodes' + (type ? `?type=${type}` : '')),
  getById: (id) => http.get(`/episodes/${id}`),
}

export const ultrasoundApi = {
  getAll: (params) => http.get('/ultrasound', { params }),
  getById: (id) => http.get(`/ultrasound/${id}`),
  create: (data) => http.post('/ultrasound', data),
  update: (id, data) => http.patch(`/ultrasound/${id}`, data),
}

export const consultationApi = {
  create: (data) => http.post('/consultations', data),
  getById: (id) => http.get(`/consultations/${id}`),
  update: (id, data) => http.patch(`/consultations/${id}`, data),
}

export const fertilityApi = {
  createCycle: (data) => http.post('/fertility/cycles', data),
  getCycleById: (id) => http.get(`/fertility/cycles/${id}`),
  updateCycle: (id, data) => http.patch(`/fertility/cycles/${id}`, data),
  addFollicularStudy: (data) => http.post('/fertility/follicular-studies', data),
}

export const procedureApi = {
    create: (data) => http.post('/procedures', data),
    addSession: (data) => http.post('/procedures/sessions', data),
}
