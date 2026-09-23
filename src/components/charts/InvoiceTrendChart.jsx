import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

export default function InvoiceTrendChart({ data }) {
  if (!data || data.length === 0) return <p className="text-sm text-gray-500">No trend data.</p>
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6b7280' }} />
        <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} />
        <Tooltip />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Line type="monotone" dataKey="invoice_count" name="Invoice Count" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
        <Line type="monotone" dataKey="exceptions" name="Exceptions" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} />
      </LineChart>
    </ResponsiveContainer>
  )
}
