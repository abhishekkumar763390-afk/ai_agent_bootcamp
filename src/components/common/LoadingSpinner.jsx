import { Loader2 } from 'lucide-react'

export default function LoadingSpinner({ size = 24, label }) {
  return (
    <div className="flex items-center justify-center gap-2 py-8">
      <Loader2 className="animate-spin text-brand-600" style={{ width: size, height: size }} />
      {label && <span className="text-sm text-gray-500">{label}</span>}
    </div>
  )
}
