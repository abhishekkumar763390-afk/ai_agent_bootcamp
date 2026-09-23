import api from './api'
import { USE_MOCKS } from '../config/apiConfig'
import { mockDocuments, getMockDocumentDetail, mockHealth } from '../mocks/mockData'

export async function getDocuments(params = {}) {
  if (USE_MOCKS) {
    let filtered = [...mockDocuments]
    if (params.search) {
      const q = params.search.toLowerCase()
      filtered = filtered.filter(
        (d) =>
          d.file_name.toLowerCase().includes(q) ||
          d.invoice_no.toLowerCase().includes(q) ||
          d.hospital_name.toLowerCase().includes(q) ||
          (d.patient_name && d.patient_name.toLowerCase().includes(q))
      )
    }
    if (params.status) filtered = filtered.filter((d) => d.status === params.status)
    if (params.hospital) filtered = filtered.filter((d) => d.hospital_name === params.hospital)
    if (params.source_type) filtered = filtered.filter((d) => d.source_type === params.source_type)
    if (params.vector_status) filtered = filtered.filter((d) => d.vector_status === params.vector_status)
    if (params.exception_type) filtered = filtered.filter((d) => d.exception_count > 0)
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
  const res = await api.get('/api/v1/documents', { params })
  return res.data
}

export async function getDocument(documentId) {
  if (USE_MOCKS) return getMockDocumentDetail(documentId)
  const res = await api.get(`/api/v1/documents/${documentId}`)
  return res.data
}

export async function uploadDocuments(files) {
  if (USE_MOCKS) {
    await new Promise((r) => setTimeout(r, 800))
    return {
      uploaded: files.length,
      results: files.map((f, i) => ({
        file_name: f.name,
        document_id: 10000 + i,
        status: i % 5 === 0 ? 'REVIEW_REQUIRED' : 'APPROVED',
        message: 'Processed successfully',
      })),
    }
  }
  const formData = new FormData()
  files.forEach((f) => formData.append('files', f))
  const res = await api.post('/api/v1/documents/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return res.data
}

export async function reprocessDocument(documentId) {
  if (USE_MOCKS) {
    await new Promise((r) => setTimeout(r, 500))
    return { document_id: documentId, status: 'REPROCESSING', message: 'Document queued for reprocessing' }
  }
  const res = await api.post(`/api/v1/documents/${documentId}/reprocess`)
  return res.data
}

export async function getHealth() {
  if (USE_MOCKS) return mockHealth
  const res = await api.get('/api/v1/health')
  return res.data
}

export async function downloadInvoicesExcel() {
  if (USE_MOCKS) {
    return { message: 'Mock mode: Excel export not available' }
  }
  const res = await api.get('/api/v1/exports/invoices.xlsx', { responseType: 'blob' })
  return res.data
}
