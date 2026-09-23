import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, RefreshCw, AlertTriangle, Search } from 'lucide-react'
import { getDocument, reprocessDocument } from '../services/documentService'
import { reindexDocument } from '../services/ingestionService'
import InvoiceFields from '../components/documents/InvoiceFields'
import LineItemsTable from '../components/documents/LineItemsTable'
import StatusBadge from '../components/common/StatusBadge'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorMessage from '../components/common/ErrorMessage'

function formatCurrency(val) {
  if (val == null) return '—'
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(val)
}

export default function DocumentDetailPage() {
  const { documentId } = useParams()
  const [doc, setDoc] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [actionMsg, setActionMsg] = useState(null)

  useEffect(() => {
    async function load() {
      try {
        const d = await getDocument(documentId)
        setDoc(d)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [documentId])

  const handleReprocess = async () => {
    setActionMsg(null)
    try {
      const res = await reprocessDocument(documentId)
      setActionMsg(res.message || 'Document queued for reprocessing')
    } catch (err) {
      setError(err.message)
    }
  }

  const handleSendToReview = async () => {
    setActionMsg(null)
    try {
      const res = await reprocessDocument(documentId)
      setActionMsg('Document sent to review queue')
    } catch (err) {
      setError(err.message)
    }
  }

  const handleReindex = async () => {
    setActionMsg(null)
    try {
      const res = await reindexDocument(documentId)
      setActionMsg(res.message || 'Document queued for reindexing')
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) return <LoadingSpinner label="Loading document..." />
  if (error) return <ErrorMessage message={error} />
  if (!doc) return <p className="text-sm text-gray-500">Document not found.</p>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link to="/documents" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
            <ArrowLeft className="h-4 w-4" /> Back to Documents
          </Link>
          <h1 className="mt-1 text-2xl font-bold text-gray-900">{doc.file_name}</h1>
          <p className="text-sm text-gray-500">Document ID: {doc.id} | Invoice: {doc.invoice_no || '—'}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleReprocess} className="btn-secondary">
            <RefreshCw className="h-4 w-4" /> Reprocess
          </button>
          <button onClick={handleSendToReview} className="btn-secondary">
            <AlertTriangle className="h-4 w-4" /> Send to Review
          </button>
        </div>
      </div>

      {actionMsg && (
        <div className="rounded-lg border border-success-200 bg-success-50 px-4 py-3 text-sm text-success-700">
          {actionMsg}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card p-4">
          <p className="text-xs font-medium text-gray-500 uppercase">Status</p>
          <div className="mt-1"><StatusBadge status={doc.status} /></div>
        </div>
        <div className="card p-4">
          <p className="text-xs font-medium text-gray-500 uppercase">Vector Status</p>
          <div className="mt-1"><StatusBadge status={doc.vector_status} /></div>
        </div>
        <div className="card p-4">
          <p className="text-xs font-medium text-gray-500 uppercase">Extraction Method</p>
          <p className="mt-1 text-sm text-gray-900">{doc.extraction_method || '—'}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs font-medium text-gray-500 uppercase">OCR Pages</p>
          <p className="mt-1 text-sm text-gray-900">{doc.ocr_pages?.length > 0 ? doc.ocr_pages.join(', ') : 'None'}</p>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="text-sm font-semibold text-gray-900">File Information</h2>
        </div>
        <div className="card-body">
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div><dt className="text-xs font-medium text-gray-500 uppercase">File Name</dt><dd className="mt-0.5 text-sm text-gray-900">{doc.file_name}</dd></div>
            <div><dt className="text-xs font-medium text-gray-500 uppercase">Source Type</dt><dd className="mt-0.5 text-sm text-gray-900">{doc.source_type}</dd></div>
            <div><dt className="text-xs font-medium text-gray-500 uppercase">Created At</dt><dd className="mt-0.5 text-sm text-gray-900">{new Date(doc.created_at).toLocaleString('en-IN')}</dd></div>
            <div><dt className="text-xs font-medium text-gray-500 uppercase">Chunk Count</dt><dd className="mt-0.5 text-sm text-gray-900">{doc.chunk_count || '—'}</dd></div>
          </dl>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="text-sm font-semibold text-gray-900">Invoice Fields</h2>
        </div>
        <div className="card-body">
          <InvoiceFields document={doc} />
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="text-sm font-semibold text-gray-900">Line Items</h2>
        </div>
        <div className="card-body">
          <LineItemsTable items={doc.line_items} />
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="text-sm font-semibold text-gray-900">Totals</h2>
        </div>
        <div className="card-body">
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div><dt className="text-xs font-medium text-gray-500 uppercase">Printed Total</dt><dd className="mt-0.5 text-sm font-medium text-gray-900">{formatCurrency(doc.printed_total)}</dd></div>
            <div><dt className="text-xs font-medium text-gray-500 uppercase">Computed Total</dt><dd className="mt-0.5 text-sm font-medium text-gray-900">{formatCurrency(doc.computed_total)}</dd></div>
            <div>
              <dt className="text-xs font-medium text-gray-500 uppercase">Match</dt>
              <dd className="mt-0.5">
                {doc.totals_match ? (
                  <span className="text-sm font-medium text-success-600">Totals Match</span>
                ) : (
                  <span className="text-sm font-medium text-danger-600">Mismatch Detected</span>
                )}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="text-sm font-semibold text-gray-900">Validation Results</h2>
        </div>
        <div className="card-body">
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr><th>Field</th><th>Status</th><th>Message</th></tr>
              </thead>
              <tbody>
                {doc.validation_results?.map((v, i) => (
                  <tr key={i}>
                    <td className="font-mono text-xs">{v.field}</td>
                    <td><StatusBadge status={v.status} /></td>
                    <td className="text-xs text-gray-600">{v.message || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {doc.exceptions?.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h2 className="text-sm font-semibold text-gray-900">Exceptions</h2>
          </div>
          <div className="card-body">
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr><th>ID</th><th>Type</th><th>Status</th><th>Message</th></tr>
                </thead>
                <tbody>
                  {doc.exceptions.map((exc) => (
                    <tr key={exc.id}>
                      <td className="font-mono text-xs">{exc.id}</td>
                      <td className="font-mono text-xs">{exc.type}</td>
                      <td><StatusBadge status={exc.status} /></td>
                      <td className="text-xs text-gray-600">{exc.message}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <h2 className="text-sm font-semibold text-gray-900">Audit Trail</h2>
        </div>
        <div className="card-body">
          <ol className="space-y-3">
            {doc.audit_trail?.map((a, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-medium text-gray-500">
                  {i + 1}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{a.action}</p>
                  <p className="text-xs text-gray-500">{new Date(a.timestamp).toLocaleString('en-IN')} — {a.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="text-sm font-semibold text-gray-900">Reindex</h2>
        </div>
        <div className="card-body">
          <p className="text-sm text-gray-500 mb-3">Re-chunk and re-embed this document into the vector index.</p>
          <button onClick={handleReindex} className="btn-primary">
            <Search className="h-4 w-4" /> Reindex Document
          </button>
        </div>
      </div>
    </div>
  )
}
