import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ProtectedRoute from './ProtectedRoute'
import AdminRoute from './AdminRoute'
import ProtectedLayout from '../components/ProtectedLayout'
import LoginPage from '../features/auth/pages/LoginPage'
import RegisterPage from '../features/auth/pages/RegisterPage'
import DashboardPage from '../features/dashboard/pages/DashboardPage'
import ContactPage from '../features/contact/pages/ContactPage'
import ProjectPage from '../features/project/pages/ProjectPage'
import StackPage from '../features/stack/pages/StackPage'
import LanguagePage from '../features/language/pages/LanguagePage'
import UserPage from '../features/user/pages/UserPage'
import UsersAdminPage from '../features/user/pages/UsersAdminPage'

function RootRedirect() {
  const { isAuthenticated } = useAuth()
  return <Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />
}

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected area */}
      <Route
        element={
          <ProtectedRoute>
            <ProtectedLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/projects" element={<ProjectPage />} />
        <Route path="/stack" element={<StackPage />} />
        <Route path="/languages" element={<LanguagePage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/profile" element={<UserPage />} />
        <Route
          path="/users"
          element={
            <AdminRoute>
              <UsersAdminPage />
            </AdminRoute>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
