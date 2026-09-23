import { Link } from 'react-router-dom'
import { FileText, Quote } from 'lucide-react'

export default function CitationCard({ citation }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
      <div className="flex items-start gap-2">
        <Quote className="h-4 w-4 flex-shrink-0 text-gray-400 mt-0.5" />
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs font-medium text-gray-900">{citation.invoice_no}</span>
            <span className="text-xs text-gray-400">|</span>
            <span className="text-xs text-gray-600">{citation.file_name}</span>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Document ID: {citation.document_id} | Page {citation.page_number} | Chunk: {citation.chunk_id}
          </p>
          <p className="mt-1.5 text-sm italic text-gray-700 border-l-2 border-gray-300 pl-2">
            {citation.snippet}
          </p>
          <Link
            to={`/documents/${citation.document_id}`}
            className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-brand-600 hover:text-brand-700"
          >
            <FileText className="h-3 w-3" />
            View Document
          </Link>
        </div>
      </div>
    </div>
  )
}
