import api from './api'
import { USE_MOCKS } from '../config/apiConfig'
import { mockAnalyticsSummary, getMockTrends } from '../mocks/mockData'

export async function getAnalyticsSummary(params = {}) {
  if (USE_MOCKS) return mockAnalyticsSummary
  const res = await api.get('/api/v1/analytics/summary', { params })
  return res.data
}

export async function getAnalyticsTrends(params = {}) {
  if (USE_MOCKS) return getMockTrends()
  const res = await api.get('/api/v1/analytics/trends', { params })
  return res.data
}
