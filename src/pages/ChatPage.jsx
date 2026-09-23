import { useState, useRef, useEffect } from 'react'
import { Send, MessageSquare, Info } from 'lucide-react'
import { sendChatQuery } from '../services/chatService'
import ChatMessage from '../components/chat/ChatMessage'
import CitationCard from '../components/chat/CitationCard'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorMessage from '../components/common/ErrorMessage'

export default function ChatPage() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const scrollRef = useRef(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, loading])

  const handleSend = async (e) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const question = input.trim()
    setInput('')
    setError(null)
    setMessages((prev) => [...prev, { role: 'user', content: question }])
    setLoading(true)

    try {
      const res = await sendChatQuery(question)
      setMessages((prev) => [...prev, { role: 'assistant', content: res.answer, citations: res.citations }])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Ask Invoices</h1>
        <p className="mt-1 text-sm text-gray-500">Ask questions across all indexed invoice documents</p>
      </div>

      <div className="card p-4">
        <div className="flex items-start gap-2 rounded-lg bg-brand-50 p-3 text-sm text-brand-700">
          <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <p>Search covers every successfully indexed PDF from both the bulk folder and UI uploads. Every answer includes citation cards linking back to the source document.</p>
        </div>
      </div>

      <div className="card flex flex-col" style={{ height: 'calc(100vh - 320px)', minHeight: '400px' }}>
        <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 p-5">
          {messages.length === 0 && (
            <div className="flex h-full items-center justify-center text-center">
              <div>
                <MessageSquare className="mx-auto h-10 w-10 text-gray-300" />
                <p className="mt-2 text-sm text-gray-500">Ask a question about your invoices to get started.</p>
                <p className="text-xs text-gray-400">e.g. "What is the total for invoice INV-100001?"</p>
              </div>
            </div>
          )}
          {messages.map((msg, i) => (
            <ChatMessage key={i} message={msg} />
          ))}
          {loading && <LoadingSpinner label="Searching indexed documents..." />}
        </div>

        {error && <div className="px-5"><ErrorMessage message={error} onDismiss={() => setError(null)} /></div>}

        <form onSubmit={handleSend} className="border-t border-gray-200 p-4">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask a question about your invoices..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              className="input flex-1"
            />
            <button type="submit" disabled={loading || !input.trim()} className="btn-primary">
              <Send className="h-4 w-4" /> Send
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
