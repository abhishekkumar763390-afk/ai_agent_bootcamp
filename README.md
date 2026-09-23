# AgentForge AI Document Ops

Operations application for processing synthetic hospital invoice PDFs. The React frontend provides a dashboard, document management, bulk ingestion control, exception review, cited invoice Q&A, and analytics. A separate FastAPI backend (not included here) provides all API endpoints.

## Tech Stack

- **React 18** (JavaScript, JSX)
- **Vite** build tool
- **React Router** for routing
- **Axios** for API calls
- **Tailwind CSS** for styling
- **Recharts** for data visualization
- **Lucide React** for icons

## Getting Started

```bash
npm install
npm run dev
```

The app runs with mock data by default so it works before the backend is ready.

## Environment Variables

Copy `.env.example` to `.env` and configure:

| Variable | Default | Description |
|---|---|---|
| `VITE_API_BASE_URL` | `http://localhost:8000` | FastAPI backend URL |
| `VITE_USE_MOCKS` | `true` | Set to `false` to use live API endpoints |

## Routes

| Route | Page |
|---|---|
| `/` | Dashboard |
| `/upload` | Upload Documents |
| `/knowledge-base` | Knowledge Base (bulk ingestion & index status) |
| `/documents` | Document List |
| `/documents/:documentId` | Document Details |
| `/exceptions` | Exceptions Review Queue |
| `/chat` | Ask Invoices (cited Q&A) |
| `/analytics` | Operational Analytics |

## API Contract

The frontend expects these FastAPI endpoints:

- `GET /api/v1/health`
- `POST /api/v1/documents/upload` (multipart/form-data, field: `files`)
- `GET /api/v1/documents?page=1&page_size=20&search=&status=&hospital=&exception_type=`
- `GET /api/v1/documents/{documentId}`
- `POST /api/v1/documents/{documentId}/reprocess`
- `POST /api/v1/ingestion/bulk` (JSON `{"recursive":true}`)
- `GET /api/v1/ingestion/jobs/{jobId}`
- `GET /api/v1/ingestion/stats`
- `POST /api/v1/ingestion/reindex/{documentId}`
- `GET /api/v1/exceptions?page=1&page_size=20&status=OPEN&type=`
- `PATCH /api/v1/exceptions/{exceptionId}/review`
- `POST /api/v1/chat/query`
- `GET /api/v1/analytics/summary`
- `GET /api/v1/analytics/trends`
- `GET /api/v1/exports/invoices.xlsx`

## Service Layer

All API calls go through named service functions in `src/services/`. Page components never call Axios directly.

| Service | Functions |
|---|---|
| `documentService.js` | `getDocuments`, `getDocument`, `uploadDocuments`, `reprocessDocument`, `getHealth`, `downloadInvoicesExcel` |
| `ingestionService.js` | `startBulkIngestion`, `getIngestionJob`, `getIngestionStats`, `reindexDocument` |
| `exceptionService.js` | `getExceptions`, `reviewException` |
| `chatService.js` | `sendChatQuery` |
| `analyticsService.js` | `getAnalyticsSummary`, `getAnalyticsTrends` |

## Project Structure

```
src/
  components/
    layout/AppLayout.jsx
    common/LoadingSpinner.jsx
    common/ErrorMessage.jsx
    common/StatusBadge.jsx
    documents/DocumentTable.jsx
    documents/InvoiceFields.jsx
    documents/LineItemsTable.jsx
    exceptions/ExceptionTable.jsx
    ingestion/IngestionProgress.jsx
    ingestion/IndexStats.jsx
    chat/ChatMessage.jsx
    chat/CitationCard.jsx
    charts/ExceptionChart.jsx
    charts/InvoiceTrendChart.jsx
  pages/
    DashboardPage.jsx
    UploadPage.jsx
    KnowledgeBasePage.jsx
    DocumentsPage.jsx
    DocumentDetailPage.jsx
    ExceptionsPage.jsx
    ChatPage.jsx
    AnalyticsPage.jsx
  services/
    api.js
    documentService.js
    ingestionService.js
    exceptionService.js
    chatService.js
    analyticsService.js
  config/apiConfig.js
  mocks/mockData.js
  App.jsx
  main.jsx
backend/
  apis/.gitkeep
  services/.gitkeep
database/sql/.gitkeep
data/samples/.gitkeep
data/source_invoices/.gitkeep
data/uploads/.gitkeep
vectorstore/chroma/.gitkeep
exports/.gitkeep
```

## Backend

The FastAPI backend will be implemented separately. The `backend/` folder contains `.gitkeep` placeholders for API and service modules. The `data/source_invoices/` folder is where existing PDFs are placed for bulk ingestion. The `data/uploads/` folder stores PDFs submitted from the Upload page. The vector store persists in `vectorstore/chroma/`.

## Build

```bash
npm run build
```
