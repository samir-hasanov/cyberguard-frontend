import { Spinner } from '@chakra-ui/react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import SocLayout from '../layouts/SocLayout'
import DashboardPage from '../pages/Dashboard/DashboardPage'
import LoginPage from '../pages/Login/LoginPage'
import PlaceholderPage from '../pages/PlaceholderPage'
import UsersPage from '../pages/Users/UsersPage'

function Protected() {
  const { ready, user } = useAuth()
  if (!ready) {
    return <Spinner color="cyan.300" m={8} />
  }
  if (!user) {
    return <Navigate to="/login" replace />
  }
  return <SocLayout />
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="login" element={<LoginPage />} />
      <Route element={<Protected />}>
        <Route index element={<DashboardPage />} />
        <Route path="alerts" element={<PlaceholderPage phase="5" titleKey="alerts" />} />
        <Route path="incidents" element={<PlaceholderPage phase="5" titleKey="incidents" />} />
        <Route path="assets" element={<PlaceholderPage phase="5" titleKey="assets" />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="logs" element={<PlaceholderPage phase="3" titleKey="logs" />} />
        <Route path="firewall" element={<PlaceholderPage phase="6" titleKey="firewall" />} />
        <Route path="threat-intel" element={<PlaceholderPage phase="8" titleKey="threatIntel" />} />
        <Route path="reports" element={<PlaceholderPage phase="9" titleKey="reports" />} />
      </Route>
    </Routes>
  )
}
