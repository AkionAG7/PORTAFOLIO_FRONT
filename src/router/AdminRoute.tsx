import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  return user?.rol === 'admin' ? <>{children}</> : <Navigate to="/dashboard" replace />
}
