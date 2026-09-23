import { useState, useCallback } from 'react'
import { UploadCloud, FileText, X, CheckCircle, AlertCircle } from 'lucide-react'
import { uploadDocuments } from '../services/documentService'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorMessage from '../components/common/ErrorMessage'

export default function UploadPage() {
  const [files, setFiles] = useState([])
  const [dragOver, setDragOver] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [results, setResults] = useState(null)
  const [error, setError] = useState(null)

  const handleFiles = useCallback((fileList) => {
    const pdfs = Array.from(fileList).filter((f) => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf'))
    const rejected = Array.from(fileList).filter((f) => f.type !== 'application/pdf' && !f.name.toLowerCase().endsWith('.pdf'))
    if (rejected.length > 0) {
      setError(`${rejected.length} file(s) rejected. Only PDF files are accepted.`)
    } else {
      setError(null)
    }
    setFiles((prev) => [...prev, ...pdfs])
    setResults(null)
  }, [])

  const removeFile = (idx) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx))
  }

  const handleUpload = async () => {
    if (files.length === 0) return
    setUploading(true)
    setError(null)
    setProgress(0)
    setResults(null)

    const interval = setInterval(() => {
      setProgress((p) => (p < 90 ? p + 10 : p))
    }, 200)

    try {
      const res = await uploadDocuments(files)
      setProgress(100)
      setResults(res)
    } catch (err) {
      setError(err.message)
    } finally {
      clearInterval(interval)
      setUploading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Upload Documents</h1>
        <p className="mt-1 text-sm text-gray-500">Upload synthetic hospital invoice PDFs for processing</p>
      </div>

      <div className="card p-4">
        <div className="flex items-start gap-2 rounded-lg bg-warning-50 p-3 text-sm text-warning-700">
          <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <p>Use synthetic documents only. Each upload is automatically extracted, OCR-processed when needed, validated, stored, chunked, and indexed.</p>
        </div>
      </div>

      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files) }}
        className={`rounded-xl border-2 border-dashed p-10 text-center transition-colors ${dragOver ? 'border-brand-500 bg-brand-50' : 'border-gray-300 bg-white'}`}
      >
        <UploadCloud className="mx-auto h-10 w-10 text-gray-400" />
        <p className="mt-2 text-sm font-medium text-gray-900">Drag and drop PDF files here</p>
        <p className="text-xs text-gray-500">or</p>
        <label className="btn-secondary cursor-pointer">
          Browse Files
          <input
            type="file"
            multiple
            accept=".pdf,application/pdf"
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </label>
      </div>

      {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}

      {files.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h2 className="text-sm font-semibold text-gray-900">Selected Files ({files.length})</h2>
          </div>
          <div className="card-body space-y-2">
            {files.map((f, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-900">{f.name}</span>
                  <span className="text-xs text-gray-500">{(f.size / 1024).toFixed(1)} KB</span>
                </div>
                {!uploading && (
                  <button onClick={() => removeFile(i)} className="text-gray-400 hover:text-danger-600">
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
            <div className="flex items-center gap-3 pt-2">
              <button onClick={handleUpload} disabled={uploading || files.length === 0} className="btn-primary">
                {uploading ? 'Uploading...' : `Upload ${files.length} File(s)`}
              </button>
              {!uploading && (
                <button onClick={() => setFiles([])} className="btn-secondary">Clear</button>
              )}
            </div>
          </div>
        </div>
      )}

      {uploading && (
        <div className="card p-5">
          <LoadingSpinner label="Processing files..." />
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-gray-200">
            <div className="h-full rounded-full bg-brand-600 transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      {results && (
        <div className="card">
          <div className="card-header">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-success-700">
              <CheckCircle className="h-5 w-5" /> Upload Complete
            </h2>
          </div>
          <div className="card-body space-y-2">
            {results.results?.map((r, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-900">{r.file_name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500">{r.message}</span>
                  <span className={`text-xs font-medium ${r.status === 'APPROVED' ? 'text-success-600' : 'text-warning-600'}`}>
                    {r.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
