import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Upload,
  Database,
  FileText,
  AlertTriangle,
  MessageSquare,
  BarChart3,
  Hammer,
} from 'lucide-react'

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/upload', label: 'Upload', icon: Upload },
  { to: '/knowledge-base', label: 'Knowledge Base', icon: Database },
  { to: '/documents', label: 'Documents', icon: FileText },
  { to: '/exceptions', label: 'Exceptions', icon: AlertTriangle },
  { to: '/chat', label: 'Ask Invoices', icon: MessageSquare },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
]

export default function AppLayout({ children }) {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <aside className="flex w-64 flex-shrink-0 flex-col bg-navy-900">
        <div className="flex items-center gap-2 px-5 py-5 border-b border-navy-700">
          <Hammer className="h-6 w-6 text-brand-400" />
          <div>
            <h1 className="text-sm font-bold text-white leading-tight">AgentForge</h1>
            <p className="text-xs text-navy-300">AI Document Ops</p>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
                }
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            )
          })}
        </nav>
        <div className="px-5 py-4 border-t border-navy-700">
          <p className="text-xs text-navy-400">v1.0.0</p>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  )
}
