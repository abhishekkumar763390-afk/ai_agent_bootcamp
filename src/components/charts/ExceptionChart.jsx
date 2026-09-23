import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const COLORS = ['#ef4444', '#f59e0b', '#3b82f6', '#22c55e', '#8b5cf6', '#ec4899', '#14b8a6', '#6366f1']

export default function ExceptionChart({ data }) {
  if (!data || data.length === 0) return <p className="text-sm text-gray-500">No exception data.</p>
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="type" tick={{ fontSize: 10, fill: '#6b7280' }} angle={-25} textAnchor="end" height={60} />
        <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} />
        <Tooltip />
        <Bar dataKey="count" name="Exceptions" radius={[4, 4, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
