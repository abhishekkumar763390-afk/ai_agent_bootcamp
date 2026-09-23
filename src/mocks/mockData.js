const hospitals = [
  'Lifeline Medical Centre',
  'Mercy General Hospital',
  'St. Anns Cardiac Institute',
  'Riverside Health Clinic',
  'Summit Surgical Center',
  'Greenfield Community Hospital',
  'Hillview Trauma Center',
  'Lakeside Childrens Hospital',
]

const insurers = ['National Health Assurance', 'SafeGuard Insurance', 'MediCover Plus', 'PrimeCare Health', 'Unity Medical Insurance']

const statuses = ['APPROVED', 'REVIEW_REQUIRED', 'EXTRACTION_FAILED', 'DUPLICATE']
const vectorStatuses = ['INDEXED', 'NOT_INDEXED', 'INDEXING', 'FAILED']
const sourceTypes = ['BULK_FOLDER', 'UI_UPLOAD']
const exceptionTypes = ['TOTAL_MISMATCH', 'DUPLICATE_FILE', 'DUPLICATE_INVOICE', 'MISSING_PATIENT_NAME', 'MISSING_DIAGNOSIS', 'MISSING_INSURER', 'MISSING_INVOICE_DATE', 'EXTRACTION_FAILED']

const firstNames = ['Aryan', 'Priya', 'Rahul', 'Sneha', 'Vikram', 'Ananya', 'Karthik', 'Deepa', 'Arjun', 'Meera', 'Sanjay', 'Kavya', 'Rohan', 'Pooja', 'Aditya', 'Nisha']
const lastNames = ['Maharaj', 'Sharma', 'Patel', 'Reddy', 'Nair', 'Iyer', 'Kapoor', 'Singh', 'Gupta', 'Rao', 'Menon', 'Joshi']

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

function formatCurrency(val) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(val)
}

function generateDocuments(count) {
  const docs = []
  for (let i = 1; i <= count; i++) {
    const status = i % 7 === 0 ? 'REVIEW_REQUIRED' : i % 15 === 0 ? 'EXTRACTION_FAILED' : i % 20 === 0 ? 'DUPLICATE' : 'APPROVED'
    const hasException = status === 'REVIEW_REQUIRED' || status === 'EXTRACTION_FAILED'
    const doc = {
      id: i,
      file_name: `doc_${String(i).padStart(5, '0')}.pdf`,
      source_type: i % 3 === 0 ? 'UI_UPLOAD' : 'BULK_FOLDER',
      invoice_no: `INV-${100000 + i}`,
      hospital_name: pick(hospitals),
      patient_name: i % 11 === 0 ? null : `${pick(firstNames)} ${pick(lastNames)}`,
      invoice_date: i % 13 === 0 ? null : randomDate(new Date(2025, 0, 1), new Date(2025, 8, 22)).toISOString().split('T')[0],
      printed_total: i % 9 === 0 ? null : Math.round((Math.random() * 200000 + 5000) * 100) / 100,
      status,
      vector_status: i % 15 === 0 ? 'NOT_INDEXED' : 'INDEXED',
      exception_count: hasException ? Math.floor(Math.random() * 3) + 1 : 0,
      created_at: randomDate(new Date(2025, 6, 1), new Date(2026, 8, 22)).toISOString(),
    }
    docs.push(doc)
  }
  return docs
}

export const mockDocuments = generateDocuments(60)

function generateLineItems() {
  const items = []
  const procedures = ['Consultation', 'Room Charges', 'Surgery', 'Anesthesia', 'Pharmacy', 'Lab Tests', 'Radiology', 'ICU Stay', 'Medical Supplies', 'Blood Transfusion']
  const count = Math.floor(Math.random() * 5) + 2
  for (let i = 0; i < count; i++) {
    const qty = Math.floor(Math.random() * 3) + 1
    const rate = Math.round((Math.random() * 20000 + 500) * 100) / 100
    items.push({
      description: pick(procedures),
      quantity: qty,
      unit_price: rate,
      line_total: Math.round(qty * rate * 100) / 100,
    })
  }
  return items
}

export function getMockDocumentDetail(id) {
  const doc = mockDocuments.find((d) => d.id === parseInt(id)) || mockDocuments[0]
  const lineItems = generateLineItems()
  const computedTotal = lineItems.reduce((sum, li) => sum + li.line_total, 0)
  const printedTotal = doc.printed_total || computedTotal
  const totalMismatch = Math.abs(computedTotal - printedTotal) > 0.01
  return {
    ...doc,
    insurer: doc.id % 7 === 0 ? null : pick(insurers),
    diagnosis: doc.id % 5 === 0 ? null : 'Acute appendicitis with localized peritonitis',
    extraction_method: doc.id % 4 === 0 ? 'OLLAMA_VISION_OCR' : 'NATIVE_TEXT',
    ocr_pages: doc.id % 4 === 0 ? [1, 3] : [],
    chunk_count: Math.floor(Math.random() * 12) + 3,
    line_items: lineItems,
    computed_total: Math.round(computedTotal * 100) / 100,
    printed_total: printedTotal,
    totals_match: !totalMismatch,
    validation_results: [
      { field: 'invoice_no', status: doc.invoice_no ? 'PASS' : 'FAIL', message: doc.invoice_no ? '' : 'Missing invoice number' },
      { field: 'patient_name', status: doc.patient_name ? 'PASS' : 'FAIL', message: doc.patient_name ? '' : 'Missing patient name' },
      { field: 'invoice_date', status: doc.invoice_date ? 'PASS' : 'FAIL', message: doc.invoice_date ? '' : 'Missing invoice date' },
      { field: 'hospital_name', status: doc.hospital_name ? 'PASS' : 'FAIL', message: doc.hospital_name ? '' : 'Missing hospital name' },
      { field: 'printed_total', status: doc.printed_total ? 'PASS' : 'FAIL', message: doc.printed_total ? '' : 'Missing total' },
      { field: 'totals_match', status: totalMismatch ? 'FAIL' : 'PASS', message: totalMismatch ? `Computed ${formatCurrency(computedTotal)} vs Printed ${formatCurrency(printedTotal)}` : '' },
    ],
    exceptions: doc.exception_count > 0 ? Array.from({ length: doc.exception_count }, (_, i) => ({
      id: doc.id * 100 + i,
      type: pick(exceptionTypes),
      status: 'OPEN',
      message: 'Validation issue detected during processing',
      created_at: doc.created_at,
    })) : [],
    audit_trail: [
      { action: 'PDF_RECEIVED', timestamp: doc.created_at, detail: `File ${doc.file_name} received via ${doc.source_type}` },
      { action: 'SHA256_COMPUTED', timestamp: doc.created_at, detail: 'Hash stored for duplicate detection' },
      { action: 'TEXT_EXTRACTED', timestamp: doc.created_at, detail: `${doc.id % 4 === 0 ? 'OCR used for scanned pages' : 'Native text extracted'}` },
      { action: 'VALIDATED', timestamp: doc.created_at, detail: doc.status === 'APPROVED' ? 'All checks passed' : 'Validation issues found' },
      { action: 'INDEXED', timestamp: doc.created_at, detail: `${doc.chunk_count || 5} chunks stored in vector index` },
    ],
  }
}

export function getMockExceptions(count = 30) {
  const exceptions = []
  for (let i = 1; i <= count; i++) {
    const doc = mockDocuments[i % mockDocuments.length]
    exceptions.push({
      id: i,
      document_id: doc.id,
      file_name: doc.file_name,
      invoice_no: doc.invoice_no,
      hospital_name: doc.hospital_name,
      type: pick(exceptionTypes),
      status: i % 4 === 0 ? 'RESOLVED' : 'OPEN',
      message: 'Validation issue detected during processing',
      created_at: doc.created_at,
    })
  }
  return exceptions
}

export const mockIngestionStats = {
  source_folder: 'data/source_invoices',
  discovered_pdfs: 18000,
  processed: 17850,
  succeeded: 17700,
  failed: 150,
  skipped_duplicates: 850,
  indexed_documents: 17650,
  indexed_chunks: 142800,
  last_run: '2026-09-22T14:30:00Z',
}

export function getMockIngestionJob(jobId) {
  return {
    job_id: jobId || 'job-001',
    status: 'RUNNING',
    total: 18000,
    processed: 9450,
    succeeded: 9300,
    failed: 80,
    skipped_duplicates: 450,
    current_file: `doc_${String(9450).padStart(5, '0')}.pdf`,
    started_at: '2026-09-23T08:00:00Z',
    estimated_completion: '2026-09-23T10:30:00Z',
  }
}

export const mockAnalyticsSummary = {
  total_documents: 18000,
  approved_documents: 17700,
  review_required_documents: 150,
  duplicate_invoices: 850,
  total_invoice_value: 1854000000,
  exception_rate: 0.83,
  by_hospital: hospitals.slice(0, 5).map((h, i) => ({ hospital: h, count: 2000 + i * 300, value: 200000000 + i * 40000000 })),
  by_insurer: insurers.map((ins, i) => ({ insurer: ins, count: 3000 + i * 500, value: 300000000 + i * 60000000 })),
  by_status: [
    { status: 'APPROVED', count: 17700 },
    { status: 'REVIEW_REQUIRED', count: 150 },
    { status: 'EXTRACTION_FAILED', count: 80 },
    { status: 'DUPLICATE', count: 70 },
  ],
  by_exception_type: exceptionTypes.map((type, i) => ({ type, count: 20 + i * 15 })),
}

export function getMockTrends() {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']
  return months.map((month, i) => ({
    month,
    invoice_count: 1800 + i * 120,
    invoice_value: 180000000 + i * 15000000,
    exceptions: 30 - i * 2,
  }))
}

export const mockChatResponse = {
  answer: 'The printed total is INR 105,442.33 for invoice INV-100001 from Lifeline Medical Centre, dated 2025-06-01. The patient listed is Aryan Maharaj.',
  citations: [
    {
      document_id: 1,
      invoice_no: 'INV-100001',
      file_name: 'doc_00001.pdf',
      page_number: 1,
      chunk_id: 'doc-1-page-1-chunk-1',
      snippet: 'Grand Total 105,442.33',
    },
    {
      document_id: 1,
      invoice_no: 'INV-100001',
      file_name: 'doc_00001.pdf',
      page_number: 2,
      chunk_id: 'doc-1-page-2-chunk-3',
      snippet: 'Patient Name: Aryan Maharaj | Invoice Date: 2025-06-01',
    },
  ],
}

export const mockNoEvidenceResponse = {
  answer: 'I could not find enough evidence to answer this question. Try rephrasing or asking about a different invoice.',
  citations: [],
}

export const mockHealth = {
  status: 'healthy',
  version: '1.0.0',
  ollama_connected: true,
  database_connected: true,
  vectorstore_connected: true,
}
