const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true'

export { API_BASE_URL, USE_MOCKS }
