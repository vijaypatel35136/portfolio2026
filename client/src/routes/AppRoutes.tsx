import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import ScrollDots from '../components/ScrollDots'
import Home from '../pages/Home'
import AdminLogin from '../pages/AdminLogin'
import AdminDashboard from '../pages/AdminDashboard'

interface AppRoutesProps {
  darkMode: boolean
  setDarkMode: (value: boolean | ((prev: boolean) => boolean)) => void
}

export function AppRoutes({ darkMode, setDarkMode }: AppRoutesProps) {
  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/"
        element={
          <>
            <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
            <ScrollDots darkMode={darkMode} />
            <Home darkMode={darkMode} setDarkMode={setDarkMode} />
          </>
        }
      />

      {/* Admin routes */}
      <Route path="/vijay_dev" element={<AdminLogin />} />
      <Route path="/vijay_dev/dashboard" element={<AdminDashboard />} />

      {/* Catch all - redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AppRoutes
