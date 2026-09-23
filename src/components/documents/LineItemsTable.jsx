function formatCurrency(val) {
  if (val == null) return '—'
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(val)
}

export default function LineItemsTable({ items }) {
  if (!items || items.length === 0) return <p className="text-sm text-gray-500">No line items extracted.</p>
  return (
    <div className="table-wrapper">
      <table className="table">
        <thead>
          <tr>
            <th>#</th>
            <th>Description</th>
            <th className="text-right">Qty</th>
            <th className="text-right">Unit Price</th>
            <th className="text-right">Line Total</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <tr key={i}>
              <td className="font-mono text-xs">{i + 1}</td>
              <td className="text-gray-900">{item.description}</td>
              <td className="text-right font-mono text-xs">{item.quantity}</td>
              <td className="text-right font-mono text-xs">{formatCurrency(item.unit_price)}</td>
              <td className="text-right font-mono text-xs font-medium">{formatCurrency(item.line_total)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
