import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'
import DashboardPage from './pages/DashboardPage'
import UploadPage from './pages/UploadPage'
import KnowledgeBasePage from './pages/KnowledgeBasePage'
import DocumentsPage from './pages/DocumentsPage'
import DocumentDetailPage from './pages/DocumentDetailPage'
import ExceptionsPage from './pages/ExceptionsPage'
import ChatPage from './pages/ChatPage'
import AnalyticsPage from './pages/AnalyticsPage'

function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/knowledge-base" element={<KnowledgeBasePage />} />
          <Route path="/documents" element={<DocumentsPage />} />
          <Route path="/documents/:documentId" element={<DocumentDetailPage />} />
          <Route path="/exceptions" element={<ExceptionsPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  )
}

export default App
