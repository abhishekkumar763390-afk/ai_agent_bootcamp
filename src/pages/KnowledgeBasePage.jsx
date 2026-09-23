import { useEffect, useState, useRef, useCallback } from 'react'
import { Play, RefreshCw, Search, Database, Info } from 'lucide-react'
import { startBulkIngestion, getIngestionJob, getIngestionStats, reindexDocument } from '../services/ingestionService'
import IndexStats from '../components/ingestion/IndexStats'
import IngestionProgress from '../components/ingestion/IngestionProgress'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorMessage from '../components/common/ErrorMessage'

export default function KnowledgeBasePage() {
  const [stats, setStats] = useState(null)
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reindexId, setReindexId] = useState('')
  const [reindexMsg, setReindexMsg] = useState(null)
  const pollRef = useRef(null)

  const fetchStats = useCallback(async () => {
    try {
      const s = await getIngestionStats()
      setStats(s)
    } catch (err) {
      setError(err.message)
    }
  }, [])

  useEffect(() => {
    async function init() {
      await fetchStats()
      setLoading(false)
    }
    init()
  }, [fetchStats])

  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current)
      pollRef.current = null
    }
  }, [])

  const pollJob = useCallback((jobId) => {
    stopPolling()
    pollRef.current = setInterval(async () => {
      try {
        const j = await getIngestionJob(jobId)
        setJob(j)
        if (j.status !== 'QUEUED' && j.status !== 'RUNNING') {
          stopPolling()
          fetchStats()
        }
      } catch (err) {
        setError(err.message)
        stopPolling()
      }
    }, 5000)
  }, [stopPolling, fetchStats])

  useEffect(() => () => stopPolling(), [stopPolling])

  const handleStart = async () => {
    setError(null)
    try {
      const res = await startBulkIngestion({ recursive: true })
      setJob({ ...res, total: 18000, processed: 0, succeeded: 0, failed: 0, skipped_duplicates: 0 })
      pollJob(res.job_id)
    } catch (err) {
      setError(err.message)
    }
  }

  const handleRefresh = async () => {
    await fetchStats()
  }

  const handleReindex = async () => {
    if (!reindexId.trim()) return
    setReindexMsg(null)
    setError(null)
    try {
      const res = await reindexDocument(reindexId.trim())
      setReindexMsg(res.message || 'Reindexing started')
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) return <LoadingSpinner label="Loading knowledge base..." />

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Knowledge Base</h1>
        <p className="mt-1 text-sm text-gray-500">Bulk ingestion and vector index management</p>
      </div>

      <div className="card p-4">
        <div className="flex items-start gap-2 rounded-lg bg-brand-50 p-3 text-sm text-brand-700">
          <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <p>
            The backend reads PDFs only from its configured <code className="text-xs bg-brand-100 px-1 rounded">data/source_invoices</code> folder.
            The browser does not upload all 18,000 files. The safe folder path is configured in the backend .env file.
          </p>
        </div>
      </div>

      {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}

      <div className="card">
        <div className="card-header flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900">Index Statistics</h2>
          <button onClick={handleRefresh} className="btn-secondary">
            <RefreshCw className="h-4 w-4" /> Refresh
          </button>
        </div>
        <div className="card-body">
          {stats ? <IndexStats stats={stats} /> : <p className="text-sm text-gray-500">No statistics available.</p>}
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="text-sm font-semibold text-gray-900">Bulk Ingestion</h2>
        </div>
        <div className="card-body space-y-4">
          <p className="text-sm text-gray-500">
            Start or resume bulk ingestion to process all PDFs in the source folder. The pipeline will discover PDFs,
            compute SHA-256 hashes, skip duplicates, extract text, OCR scanned pages, validate fields, store data,
            chunk text, and embed into the vector index.
          </p>
          <button onClick={handleStart} disabled={job?.status === 'QUEUED' || job?.status === 'RUNNING'} className="btn-primary">
            <Play className="h-4 w-4" />
            {job?.status === 'QUEUED' || job?.status === 'RUNNING' ? 'Ingestion Running...' : 'Start / Resume Bulk Ingestion'}
          </button>
          {job && <IngestionProgress job={job} />}
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="text-sm font-semibold text-gray-900">Reindex Document</h2>
        </div>
        <div className="card-body space-y-3">
          <p className="text-sm text-gray-500">Re-chunk and re-embed a specific document into the vector index.</p>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Document ID (e.g. 1)"
              value={reindexId}
              onChange={(e) => setReindexId(e.target.value)}
              className="input max-w-xs"
            />
            <button onClick={handleReindex} disabled={!reindexId.trim()} className="btn-primary">
              <Search className="h-4 w-4" /> Reindex
            </button>
          </div>
          {reindexMsg && (
            <p className="text-sm text-success-600 flex items-center gap-1">
              <Database className="h-4 w-4" /> {reindexMsg}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
