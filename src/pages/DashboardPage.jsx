import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FileText, CheckCircle, AlertTriangle, Copy, IndianRupee, TrendingUp } from 'lucide-react'
import { getAnalyticsSummary, getAnalyticsTrends } from '../services/analyticsService'
import { getDocuments } from '../services/documentService'
import DocumentTable from '../components/documents/DocumentTable'
import ExceptionChart from '../components/charts/ExceptionChart'
import InvoiceTrendChart from '../components/charts/InvoiceTrendChart'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorMessage from '../components/common/ErrorMessage'

function formatINR(val) {
  if (val == null) return '—'
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val)
}

export default function DashboardPage() {
  const [summary, setSummary] = useState(null)
  const [trends, setTrends] = useState(null)
  const [recentDocs, setRecentDocs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function load() {
      try {
        const [s, t, d] = await Promise.all([
          getAnalyticsSummary(),
          getAnalyticsTrends(),
          getDocuments({ page: 1, page_size: 5 }),
        ])
        setSummary(s)
        setTrends(t)
        setRecentDocs(d.items || [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return <LoadingSpinner label="Loading dashboard..." />
  if (error) return <ErrorMessage message={error} />

  const kpis = [
    { label: 'Total Documents', value: summary?.total_documents?.toLocaleString(), icon: FileText, color: 'text-brand-600' },
    { label: 'Approved', value: summary?.approved_documents?.toLocaleString(), icon: CheckCircle, color: 'text-success-600' },
    { label: 'Review Required', value: summary?.review_required_documents?.toLocaleString(), icon: AlertTriangle, color: 'text-warning-600' },
    { label: 'Duplicates', value: summary?.duplicate_invoices?.toLocaleString(), icon: Copy, color: 'text-gray-600' },
    { label: 'Total Invoice Value', value: formatINR(summary?.total_invoice_value), icon: IndianRupee, color: 'text-navy-700' },
    { label: 'Exception Rate', value: summary?.exception_rate != null ? `${summary.exception_rate}%` : '—', icon: TrendingUp, color: 'text-danger-600' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Operational overview of invoice processing</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {kpis.map((kpi) => {
          const Icon = kpi.icon
          return (
            <div key={kpi.label} className="kpi-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="kpi-label">{kpi.label}</p>
                  <p className="kpi-value">{kpi.value}</p>
                </div>
                <Icon className={`h-8 w-8 ${kpi.color}`} />
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="card">
          <div className="card-header">
            <h2 className="text-sm font-semibold text-gray-900">Exception Breakdown</h2>
          </div>
          <div className="card-body">
            <ExceptionChart data={summary?.by_exception_type} />
          </div>
        </div>
        <div className="card">
          <div className="card-header">
            <h2 className="text-sm font-semibold text-gray-900">Invoice Trend</h2>
          </div>
          <div className="card-body">
            <InvoiceTrendChart data={trends} />
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900">Recent Documents</h2>
          <Link to="/documents" className="text-sm font-medium text-brand-600 hover:text-brand-700">
            View all
          </Link>
        </div>
        <DocumentTable documents={recentDocs} />
      </div>
    </div>
  )
}
