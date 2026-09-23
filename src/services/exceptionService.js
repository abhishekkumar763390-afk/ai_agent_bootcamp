import api from './api'
import { USE_MOCKS } from '../config/apiConfig'
import { getMockExceptions } from '../mocks/mockData'

export async function getExceptions(params = {}) {
  if (USE_MOCKS) {
    let filtered = getMockExceptions(40)
    if (params.status) filtered = filtered.filter((e) => e.status === params.status)
    if (params.type) filtered = filtered.filter((e) => e.type === params.type)
    const page = parseInt(params.page) || 1
    const pageSize = parseInt(params.page_size) || 20
    const start = (page - 1) * pageSize
    return {
      items: filtered.slice(start, start + pageSize),
      total: filtered.length,
      page,
      page_size: pageSize,
      total_pages: Math.ceil(filtered.length / pageSize),
    }
  }
  const res = await api.get('/api/v1/exceptions', { params })
  return res.data
}

export async function reviewException(exceptionId, payload) {
  if (USE_MOCKS) {
    await new Promise((r) => setTimeout(r, 400))
    return { exception_id: exceptionId, status: payload.action === 'APPROVE' ? 'RESOLVED' : 'REJECTED', message: 'Exception reviewed' }
  }
  const res = await api.patch(`/api/v1/exceptions/${exceptionId}/review`, payload)
  return res.data
}
