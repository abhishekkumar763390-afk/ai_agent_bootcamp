export default function IngestionProgress({ job }) {
  if (!job) return null
  const percent = job.total > 0 ? Math.round((job.processed / job.total) * 100) : 0
  const isRunning = job.status === 'QUEUED' || job.status === 'RUNNING'

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-900">
            {isRunning ? 'Ingestion in progress...' : `Ingestion ${job.status.toLowerCase()}`}
          </p>
          {job.current_file && isRunning && (
            <p className="text-xs text-gray-500 mt-0.5">Current file: {job.current_file}</p>
          )}
        </div>
        <span className="text-sm font-bold text-brand-600">{percent}%</span>
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200">
        <div
          className="h-full rounded-full bg-brand-600 transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-lg bg-gray-50 p-3">
          <p className="text-xs text-gray-500">Processed</p>
          <p className="text-lg font-semibold text-gray-900">{job.processed?.toLocaleString() || 0}</p>
        </div>
        <div className="rounded-lg bg-success-50 p-3">
          <p className="text-xs text-success-700">Succeeded</p>
          <p className="text-lg font-semibold text-success-700">{job.succeeded?.toLocaleString() || 0}</p>
        </div>
        <div className="rounded-lg bg-danger-50 p-3">
          <p className="text-xs text-danger-700">Failed</p>
          <p className="text-lg font-semibold text-danger-700">{job.failed?.toLocaleString() || 0}</p>
        </div>
        <div className="rounded-lg bg-warning-50 p-3">
          <p className="text-xs text-warning-700">Duplicates</p>
          <p className="text-lg font-semibold text-warning-700">{job.skipped_duplicates?.toLocaleString() || 0}</p>
        </div>
      </div>
      {job.total > 0 && (
        <p className="text-xs text-gray-500">
          {job.processed?.toLocaleString() || 0} of {job.total?.toLocaleString()} PDFs processed
        </p>
      )}
    </div>
  )
}
