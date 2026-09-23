import api from './api'
import { USE_MOCKS } from '../config/apiConfig'
import { mockChatResponse, mockNoEvidenceResponse } from '../mocks/mockData'

export async function sendChatQuery(question) {
  if (USE_MOCKS) {
    await new Promise((r) => setTimeout(r, 900))
    const lower = question.toLowerCase()
    if (lower.includes('zzzz') || lower.includes('nonexistent') || lower.includes('notfound')) {
      return mockNoEvidenceResponse
    }
    return mockChatResponse
  }
  const res = await api.post('/api/v1/chat/query', { query: question })
  return res.data
}
