import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './authContext'

export function ProtectedRoute({ children }) {
  const { session, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <div className="page-state">Memuat sesi...</div>
  }

  if (!session?.user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return children
}
