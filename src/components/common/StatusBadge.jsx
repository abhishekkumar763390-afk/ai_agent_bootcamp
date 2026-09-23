const statusConfig = {
  APPROVED: { label: 'Approved', className: 'bg-success-100 text-success-700' },
  REVIEW_REQUIRED: { label: 'Review Required', className: 'bg-warning-100 text-warning-700' },
  EXTRACTION_FAILED: { label: 'Extraction Failed', className: 'bg-danger-100 text-danger-700' },
  DUPLICATE: { label: 'Duplicate', className: 'bg-gray-200 text-gray-700' },
  INDEXED: { label: 'Indexed', className: 'bg-success-100 text-success-700' },
  NOT_INDEXED: { label: 'Not Indexed', className: 'bg-gray-200 text-gray-700' },
  INDEXING: { label: 'Indexing', className: 'bg-warning-100 text-warning-700' },
  FAILED: { label: 'Failed', className: 'bg-danger-100 text-danger-700' },
  OPEN: { label: 'Open', className: 'bg-warning-100 text-warning-700' },
  RESOLVED: { label: 'Resolved', className: 'bg-success-100 text-success-700' },
  REJECTED: { label: 'Rejected', className: 'bg-danger-100 text-danger-700' },
  QUEUED: { label: 'Queued', className: 'bg-warning-100 text-warning-700' },
  RUNNING: { label: 'Running', className: 'bg-brand-100 text-brand-700' },
  COMPLETED: { label: 'Completed', className: 'bg-success-100 text-success-700' },
  PASS: { label: 'Pass', className: 'bg-success-100 text-success-700' },
  FAIL: { label: 'Fail', className: 'bg-danger-100 text-danger-700' },
}

export default function StatusBadge({ status }) {
  const config = statusConfig[status] || { label: status, className: 'bg-gray-100 text-gray-600' }
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  )
}
