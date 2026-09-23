import { useEffect, useState } from 'react'
import { Download, BarChart3, PieChart as PieIcon, TrendingUp } from 'lucide-react'
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import { getAnalyticsSummary, getAnalyticsTrends } from '../services/analyticsService'
import { downloadInvoicesExcel } from '../services/documentService'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorMessage from '../components/common/ErrorMessage'

const PIE_COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#6366f1']

function formatINR(val) {
  if (val == null) return '—'
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val)
}

export default function AnalyticsPage() {
  const [summary, setSummary] = useState(null)
  const [trends, setTrends] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [dateFilter, setDateFilter] = useState('')
  const [hospitalFilter, setHospitalFilter] = useState('')
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const params = {}
        if (dateFilter) params.date = dateFilter
        if (hospitalFilter) params.hospital = hospitalFilter
        const [s, t] = await Promise.all([getAnalyticsSummary(params), getAnalyticsTrends(params)])
        setSummary(s)
        setTrends(t)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [dateFilter, hospitalFilter])

  const handleDownload = async () => {
    setDownloading(true)
    try {
      const blob = await downloadInvoicesExcel()
      if (blob instanceof Blob) {
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'invoices.xlsx'
        a.click()
        URL.revokeObjectURL(url)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setDownloading(false)
    }
  }

  if (loading) return <LoadingSpinner label="Loading analytics..." />
  if (error) return <ErrorMessage message={error} />

  const kpis = [
    { label: 'Total Documents', value: summary?.total_documents?.toLocaleString() },
    { label: 'Approved', value: summary?.approved_documents?.toLocaleString() },
    { label: 'Review Required', value: summary?.review_required_documents?.toLocaleString() },
    { label: 'Duplicates', value: summary?.duplicate_invoices?.toLocaleString() },
    { label: 'Total Invoice Value', value: formatINR(summary?.total_invoice_value) },
    { label: 'Exception Rate', value: summary?.exception_rate != null ? `${summary.exception_rate}%` : '—' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="mt-1 text-sm text-gray-500">Operational analytics and insights</p>
        </div>
        <button onClick={handleDownload} disabled={downloading} className="btn-success">
          <Download className="h-4 w-4" /> {downloading ? 'Preparing...' : 'Export Excel'}
        </button>
      </div>

      <div className="card p-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="label">Date Filter</label>
            <input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="input" />
          </div>
          <div>
            <label className="label">Hospital Filter</label>
            <input type="text" placeholder="Hospital name" value={hospitalFilter} onChange={(e) => setHospitalFilter(e.target.value)} className="input" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="kpi-card">
            <p className="kpi-label">{kpi.label}</p>
            <p className="kpi-value">{kpi.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="card">
          <div className="card-header">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-900">
              <TrendingUp className="h-4 w-4 text-gray-400" /> Invoice Value Trend
            </h2>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={trends} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6b7280' }} />
                <YAxis tick={{ fontSize: 10, fill: '#6b7280' }} tickFormatter={(v) => `${(v / 10000000).toFixed(0)}Cr`} />
                <Tooltip formatter={(v) => formatINR(v)} />
                <Line type="monotone" dataKey="invoice_value" name="Invoice Value" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-900">
              <BarChart3 className="h-4 w-4 text-gray-400" /> Hospital Comparison
            </h2>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={summary?.by_hospital || []} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="hospital" tick={{ fontSize: 10, fill: '#6b7280' }} angle={-25} textAnchor="end" height={60} />
                <YAxis tick={{ fontSize: 10, fill: '#6b7280' }} />
                <Tooltip />
                <Bar dataKey="count" name="Document Count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-900">
              <PieIcon className="h-4 w-4 text-gray-400" /> Insurer Split
            </h2>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={summary?.by_insurer || []} dataKey="count" nameKey="insurer" cx="50%" cy="50%" outerRadius={90} label={({ insurer }) => insurer}>
                  {PIE_COLORS.map((color, i) => <Cell key={i} fill={color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-900">
              <BarChart3 className="h-4 w-4 text-gray-400" /> Processing Status
            </h2>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={summary?.by_status || []} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="status" tick={{ fontSize: 10, fill: '#6b7280' }} angle={-25} textAnchor="end" height={60} />
                <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} />
                <Tooltip />
                <Bar dataKey="count" name="Count" radius={[4, 4, 0, 0]}>
                  {PIE_COLORS.map((color, i) => <Cell key={i} fill={color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
