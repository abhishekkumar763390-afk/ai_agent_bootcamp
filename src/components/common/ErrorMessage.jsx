import { AlertCircle, X } from 'lucide-react'

export default function ErrorMessage({ message, onDismiss }) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-danger-200 bg-danger-50 px-4 py-3">
      <AlertCircle className="h-5 w-5 flex-shrink-0 text-danger-600 mt-0.5" />
      <p className="flex-1 text-sm text-danger-700">{message}</p>
      {onDismiss && (
        <button onClick={onDismiss} className="text-danger-400 hover:text-danger-600">
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
