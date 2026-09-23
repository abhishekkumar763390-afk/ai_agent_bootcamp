import { useEffect, useState, useCallback } from 'react'
import { Search, ChevronLeft, ChevronRight, Filter } from 'lucide-react'
import { getDocuments } from '../services/documentService'
import DocumentTable from '../components/documents/DocumentTable'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorMessage from '../components/common/ErrorMessage'

const STATUS_OPTIONS = ['', 'APPROVED', 'REVIEW_REQUIRED', 'EXTRACTION_FAILED', 'DUPLICATE']
const SOURCE_OPTIONS = ['', 'BULK_FOLDER', 'UI_UPLOAD']
const VECTOR_OPTIONS = ['', 'INDEXED', 'NOT_INDEXED', 'INDEXING', 'FAILED']
const EXCEPTION_OPTIONS = ['', 'TOTAL_MISMATCH', 'DUPLICATE_FILE', 'DUPLICATE_INVOICE', 'MISSING_PATIENT_NAME', 'MISSING_DIAGNOSIS', 'MISSING_INSURER', 'MISSING_INVOICE_DATE', 'EXTRACTION_FAILED']

export default function DocumentsPage() {
  const [data, setData] = useState({ items: [], total: 0, page: 1, total_pages: 1 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState({ search: '', status: '', hospital: '', source_type: '', vector_status: '', exception_type: '' })

  const fetchDocs = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await getDocuments({ page, page_size: 20, ...filters })
      setData(res)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [page, filters])

  useEffect(() => { fetchDocs() }, [fetchDocs])

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setPage(1)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setPage(1)
    fetchDocs()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
        <p className="mt-1 text-sm text-gray-500">Browse and search processed invoice documents</p>
      </div>

      {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}

      <div className="card">
        <div className="card-header">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <h2 className="text-sm font-semibold text-gray-900">Filters</h2>
          </div>
        </div>
        <div className="card-body space-y-3">
          <form onSubmit={handleSearch} className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search file name, invoice no, hospital, patient..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="input flex-1"
            />
            <button type="submit" className="btn-primary">
              <Search className="h-4 w-4" /> Search
            </button>
          </form>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <div>
              <label className="label">Status</label>
              <select value={filters.status} onChange={(e) => handleFilterChange('status', e.target.value)} className="input">
                {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s || 'All'}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Source</label>
              <select value={filters.source_type} onChange={(e) => handleFilterChange('source_type', e.target.value)} className="input">
                {SOURCE_OPTIONS.map((s) => <option key={s} value={s}>{s || 'All'}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Vector Status</label>
              <select value={filters.vector_status} onChange={(e) => handleFilterChange('vector_status', e.target.value)} className="input">
                {VECTOR_OPTIONS.map((s) => <option key={s} value={s}>{s || 'All'}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Hospital</label>
              <input
                type="text"
                placeholder="Hospital name"
                value={filters.hospital}
                onChange={(e) => handleFilterChange('hospital', e.target.value)}
                className="input"
              />
            </div>
            <div>
              <label className="label">Exception Type</label>
              <select value={filters.exception_type} onChange={(e) => handleFilterChange('exception_type', e.target.value)} className="input">
                {EXCEPTION_OPTIONS.map((s) => <option key={s} value={s}>{s || 'All'}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          {loading ? <LoadingSpinner /> : <DocumentTable documents={data.items} />}
        </div>
        {!loading && data.total > 0 && (
          <div className="flex items-center justify-between border-t border-gray-200 px-5 py-3">
            <p className="text-sm text-gray-500">
              Page {data.page} of {data.total_pages} ({data.total} documents)
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="btn-secondary"
              >
                <ChevronLeft className="h-4 w-4" /> Prev
              </button>
              <button
                onClick={() => setPage((p) => Math.min(data.total_pages, p + 1))}
                disabled={page >= data.total_pages}
                className="btn-secondary"
              >
                Next <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
