import api from './api'
import { USE_MOCKS } from '../config/apiConfig'
import { mockIngestionStats, getMockIngestionJob } from '../mocks/mockData'

export async function startBulkIngestion(payload = { recursive: true }) {
  if (USE_MOCKS) {
    await new Promise((r) => setTimeout(r, 500))
    return {
      job_id: 'job-' + Date.now(),
      status: 'QUEUED',
      message: 'Bulk ingestion started',
    }
  }
  const res = await api.post('/api/v1/ingestion/bulk', payload)
  return res.data
}

export async function getIngestionJob(jobId) {
  if (USE_MOCKS) return getMockIngestionJob(jobId)
  const res = await api.get(`/api/v1/ingestion/jobs/${jobId}`)
  return res.data
}

export async function getIngestionStats() {
  if (USE_MOCKS) return mockIngestionStats
  const res = await api.get('/api/v1/ingestion/stats')
  return res.data
}

export async function reindexDocument(documentId) {
  if (USE_MOCKS) {
    await new Promise((r) => setTimeout(r, 500))
    return { document_id: documentId, status: 'INDEXING', message: 'Document queued for reindexing' }
  }
  const res = await api.post(`/api/v1/ingestion/reindex/${documentId}`)
  return res.data
}
