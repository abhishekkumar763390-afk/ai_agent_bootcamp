import { Link } from 'react-router-dom'
import StatusBadge from '../common/StatusBadge'

function formatCurrency(val) {
  if (val == null) return '—'
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(val)
}

function formatDate(val) {
  if (!val) return '—'
  return new Date(val).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: '2-digit' })
}

export default function DocumentTable({ documents, loading }) {
  if (loading) return <p className="py-4 text-sm text-gray-500">Loading documents...</p>
  if (!documents || documents.length === 0) return <p className="py-4 text-sm text-gray-500">No documents found.</p>

  return (
    <div className="table-wrapper">
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>File Name</th>
            <th>Source</th>
            <th>Invoice No</th>
            <th>Hospital</th>
            <th>Patient</th>
            <th>Date</th>
            <th>Total</th>
            <th>Status</th>
            <th>Vector</th>
            <th>Excep.</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {documents.map((doc) => (
            <tr key={doc.id}>
              <td className="font-mono text-xs">{doc.id}</td>
              <td className="font-medium text-gray-900 whitespace-nowrap">{doc.file_name}</td>
              <td className="whitespace-nowrap">
                <span className="text-xs text-gray-500">{doc.source_type === 'BULK_FOLDER' ? 'Folder' : 'Upload'}</span>
              </td>
              <td className="font-mono text-xs whitespace-nowrap">{doc.invoice_no || '—'}</td>
              <td className="whitespace-nowrap max-w-[160px] truncate" title={doc.hospital_name}>{doc.hospital_name || '—'}</td>
              <td className="whitespace-nowrap">{doc.patient_name || <span className="text-danger-600">Missing</span>}</td>
              <td className="whitespace-nowrap">{formatDate(doc.invoice_date)}</td>
              <td className="whitespace-nowrap font-mono text-xs">{formatCurrency(doc.printed_total)}</td>
              <td><StatusBadge status={doc.status} /></td>
              <td><StatusBadge status={doc.vector_status} /></td>
              <td className="text-center">{doc.exception_count > 0 ? <span className="text-danger-600 font-medium">{doc.exception_count}</span> : '0'}</td>
              <td>
                <Link to={`/documents/${doc.id}`} className="text-brand-600 hover:text-brand-700 text-sm font-medium">
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
