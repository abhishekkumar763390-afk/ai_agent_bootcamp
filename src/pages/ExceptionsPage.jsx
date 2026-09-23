import { useEffect, useState, useCallback } from 'react'
import { Filter, ChevronLeft, ChevronRight, CheckCircle, XCircle } from 'lucide-react'
import { getExceptions, reviewException } from '../services/exceptionService'
import ExceptionTable from '../components/exceptions/ExceptionTable'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorMessage from '../components/common/ErrorMessage'

const TYPE_OPTIONS = ['', 'TOTAL_MISMATCH', 'DUPLICATE_FILE', 'DUPLICATE_INVOICE', 'MISSING_PATIENT_NAME', 'MISSING_DIAGNOSIS', 'MISSING_INSURER', 'MISSING_INVOICE_DATE', 'EXTRACTION_FAILED']
const STATUS_OPTIONS = ['', 'OPEN', 'RESOLVED', 'REJECTED']

export default function ExceptionsPage() {
  const [data, setData] = useState({ items: [], total: 0, page: 1, total_pages: 1 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState({ status: 'OPEN', type: '' })
  const [reviewing, setReviewing] = useState(null)
  const [reviewForm, setReviewForm] = useState({ corrected_fields: '', note: '', action: 'APPROVE' })
  const [reviewMsg, setReviewMsg] = useState(null)

  const fetchExceptions = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await getExceptions({ page, page_size: 20, ...filters })
      setData(res)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [page, filters])

  useEffect(() => { fetchExceptions() }, [fetchExceptions])

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setPage(1)
  }

  const handleReview = async (exceptionId) => {
    setReviewMsg(null)
    try {
      const res = await reviewException(exceptionId, {
        corrected_fields: reviewForm.corrected_fields,
        reviewer_note: reviewForm.note,
        action: reviewForm.action,
      })
      setReviewMsg(res.message || 'Exception reviewed successfully')
      setReviewing(null)
      setReviewForm({ corrected_fields: '', note: '', action: 'APPROVE' })
      fetchExceptions()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Exceptions</h1>
        <p className="mt-1 text-sm text-gray-500">Review and resolve processing exceptions</p>
      </div>

      {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}
      {reviewMsg && (
        <div className="rounded-lg border border-success-200 bg-success-50 px-4 py-3 text-sm text-success-700">
          {reviewMsg}
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <h2 className="text-sm font-semibold text-gray-900">Filters</h2>
          </div>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="label">Status</label>
              <select value={filters.status} onChange={(e) => handleFilterChange('status', e.target.value)} className="input">
                {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s || 'All'}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Exception Type</label>
              <select value={filters.type} onChange={(e) => handleFilterChange('type', e.target.value)} className="input">
                {TYPE_OPTIONS.map((s) => <option key={s} value={s}>{s || 'All'}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 card">
          <div className="card-body">
            {loading ? <LoadingSpinner /> : <ExceptionTable exceptions={data.items} />}
          </div>
          {!loading && data.total > 0 && (
            <div className="flex items-center justify-between border-t border-gray-200 px-5 py-3">
              <p className="text-sm text-gray-500">Page {data.page} of {data.total_pages} ({data.total} exceptions)</p>
              <div className="flex items-center gap-2">
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1} className="btn-secondary">
                  <ChevronLeft className="h-4 w-4" /> Prev
                </button>
                <button onClick={() => setPage((p) => Math.min(data.total_pages, p + 1))} disabled={page >= data.total_pages} className="btn-secondary">
                  Next <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="text-sm font-semibold text-gray-900">Review Panel</h2>
          </div>
          <div className="card-body space-y-3">
            {!reviewing ? (
              <p className="text-sm text-gray-500">Select an exception from the table to review it. Click the View link on any exception row.</p>
            ) : (
              <>
                <div className="rounded-lg bg-gray-50 p-3">
                  <p className="text-sm font-medium text-gray-900">Exception #{reviewing.id}</p>
                  <p className="text-xs text-gray-500">{reviewing.type} — {reviewing.file_name}</p>
                </div>
                <div>
                  <label className="label">Corrected Fields</label>
                  <textarea
                    placeholder="Enter corrected field values (e.g. patient_name: John Doe, total: 50000)"
                    value={reviewForm.corrected_fields}
                    onChange={(e) => setReviewForm((prev) => ({ ...prev, corrected_fields: e.target.value }))}
                    className="input min-h-[80px]"
                  />
                </div>
                <div>
                  <label className="label">Reviewer Note</label>
                  <textarea
                    placeholder="Add a note about this review"
                    value={reviewForm.note}
                    onChange={(e) => setReviewForm((prev) => ({ ...prev, note: e.target.value }))}
                    className="input min-h-[60px]"
                  />
                </div>
                <div>
                  <label className="label">Action</label>
                  <select
                    value={reviewForm.action}
                    onChange={(e) => setReviewForm((prev) => ({ ...prev, action: e.target.value }))}
                    className="input"
                  >
                    <option value="APPROVE">Approve</option>
                    <option value="REJECT">Reject</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleReview(reviewing.id)} className={reviewForm.action === 'APPROVE' ? 'btn-success' : 'btn-danger'}>
                    {reviewForm.action === 'APPROVE' ? <><CheckCircle className="h-4 w-4" /> Approve</> : <><XCircle className="h-4 w-4" /> Reject</>}
                  </button>
                  <button onClick={() => setReviewing(null)} className="btn-secondary">Cancel</button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
