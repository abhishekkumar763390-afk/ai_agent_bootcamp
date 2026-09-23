function StatItem({ label, value }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</p>
      <p className="mt-1 text-xl font-bold text-gray-900">{value?.toLocaleString() ?? '—'}</p>
    </div>
  )
}

export default function IndexStats({ stats }) {
  if (!stats) return null
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      <StatItem label="Source Folder" value={stats.source_folder} />
      <StatItem label="Discovered PDFs" value={stats.discovered_pdfs} />
      <StatItem label="Processed" value={stats.processed} />
      <StatItem label="Succeeded" value={stats.succeeded} />
      <StatItem label="Failed" value={stats.failed} />
      <StatItem label="Skipped Duplicates" value={stats.skipped_duplicates} />
      <StatItem label="Indexed Documents" value={stats.indexed_documents} />
      <StatItem label="Indexed Chunks" value={stats.indexed_chunks} />
    </div>
  )
}
