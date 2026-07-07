import { Outlet, useNavigate } from 'react-router-dom'
import Sidebar from '../components/dashboard/Sidebar'
import Topbar from '../components/dashboard/Topbar'
import { useAuth } from '../context/AuthContext'
import { useNotificationSocket } from '../hooks/useNotificationSocket'

export default function DashboardLayout() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  useNotificationSocket()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // Fallback while auth state is resolving (should not happen in practice
  // since ProtectedRoute guards this layout, but keeps TypeScript happy).
  if (!user) return null

  return (
    <div className="flex h-screen overflow-hidden bg-surface-page text-gray-100">
      <Sidebar user={user} onLogout={handleLogout} />
      <div className="flex h-screen min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="flex-1 overflow-y-auto px-8 pb-10">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

