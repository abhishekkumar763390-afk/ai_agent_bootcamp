function formatCurrency(val) {
  if (val == null) return '—'
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(val)
}

function Field({ label, value, highlightMissing }) {
  const isMissing = value == null || value === ''
  return (
    <div>
      <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</dt>
      <dd className={`mt-0.5 text-sm ${isMissing && highlightMissing ? 'text-danger-600 font-medium' : 'text-gray-900'}`}>
        {isMissing ? (highlightMissing ? 'Missing' : '—') : value}
      </dd>
    </div>
  )
}

export default function InvoiceFields({ document }) {
  return (
    <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <Field label="Invoice No" value={document.invoice_no} highlightMissing />
      <Field label="Hospital" value={document.hospital_name} highlightMissing />
      <Field label="Patient Name" value={document.patient_name} highlightMissing />
      <Field label="Invoice Date" value={document.invoice_date} highlightMissing />
      <Field label="Insurer" value={document.insurer} highlightMissing />
      <Field label="Diagnosis" value={document.diagnosis} highlightMissing />
      <Field label="Printed Total" value={formatCurrency(document.printed_total)} highlightMissing />
      <Field label="Computed Total" value={formatCurrency(document.computed_total)} />
      <Field label="Totals Match" value={document.totals_match ? 'Yes' : 'No'} />
    </dl>
  )
}
