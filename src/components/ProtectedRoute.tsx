import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * Wraps dashboard routes so only authenticated users can access them.
 * When the backend is ready, `useAuth` will derive auth state from
 * a real token / session, and this component needs no changes.
 */
export default function ProtectedRoute() {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
