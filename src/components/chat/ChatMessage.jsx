import { FileText, User, Bot } from 'lucide-react'

export default function ChatMessage({ message }) {
  const isUser = message.role === 'user'
  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${isUser ? 'bg-brand-600' : 'bg-navy-700'}`}>
        {isUser ? <User className="h-4 w-4 text-white" /> : <Bot className="h-4 w-4 text-white" />}
      </div>
      <div className={`max-w-[75%] rounded-lg px-4 py-2.5 ${isUser ? 'bg-brand-600 text-white' : 'bg-white border border-gray-200 text-gray-900'}`}>
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        {message.citations && message.citations.length > 0 && (
          <div className="mt-3 space-y-2 border-t border-gray-200 pt-3">
            <p className={`text-xs font-medium ${isUser ? 'text-brand-100' : 'text-gray-500'}`}>Citations</p>
            {message.citations.map((c, i) => (
              <div key={i} className={`rounded-md p-2 text-xs ${isUser ? 'bg-brand-700' : 'bg-gray-50'}`}>
                <p className="font-medium">{c.invoice_no} — {c.file_name}</p>
                <p className="mt-0.5 opacity-80">Page {c.page_number} | Chunk: {c.chunk_id}</p>
                <p className="mt-1 italic opacity-70">"{c.snippet}"</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
