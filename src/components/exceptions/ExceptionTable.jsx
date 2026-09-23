import { Link } from 'react-router-dom'
import StatusBadge from '../common/StatusBadge'

export default function ExceptionTable({ exceptions, loading }) {
  if (loading) return <p className="py-4 text-sm text-gray-500">Loading exceptions...</p>
  if (!exceptions || exceptions.length === 0) return <p className="py-4 text-sm text-gray-500">No exceptions found.</p>

  return (
    <div className="table-wrapper">
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Document</th>
            <th>File Name</th>
            <th>Invoice No</th>
            <th>Hospital</th>
            <th>Type</th>
            <th>Status</th>
            <th>Created</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {exceptions.map((exc) => (
            <tr key={exc.id}>
              <td className="font-mono text-xs">{exc.id}</td>
              <td className="font-mono text-xs">
                <Link to={`/documents/${exc.document_id}`} className="text-brand-600 hover:text-brand-700">
                  {exc.document_id}
                </Link>
              </td>
              <td className="font-medium text-gray-900 whitespace-nowrap">{exc.file_name}</td>
              <td className="font-mono text-xs whitespace-nowrap">{exc.invoice_no || '—'}</td>
              <td className="whitespace-nowrap max-w-[160px] truncate" title={exc.hospital_name}>{exc.hospital_name || '—'}</td>
              <td><span className="font-mono text-xs text-gray-600">{exc.type}</span></td>
              <td><StatusBadge status={exc.status} /></td>
              <td className="whitespace-nowrap text-xs">{new Date(exc.created_at).toLocaleDateString('en-IN')}</td>
              <td>
                <Link to={`/documents/${exc.document_id}`} className="text-brand-600 hover:text-brand-700 text-sm font-medium">
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
