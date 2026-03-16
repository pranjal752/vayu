import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import WardDetails from './pages/WardDetails'
import Analytics from './pages/Analytics'
import Reports from './pages/Reports'
import LoginPage from './pages/LoginPage'
import './App.css'

function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 1080) setSidebarOpen(false)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return (
    <div className="app-shell">
      <div className="app-backdrop-grid" />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      {sidebarOpen && (
        <button
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close navigation"
        />
      )}
      <div className="app-main-column">
        <Navbar onToggleSidebar={() => setSidebarOpen((open) => !open)} />
        <main className="app-main-content">
          <Routes>
            <Route path="/dashboard"  element={<Dashboard />} />
            <Route path="/ward/:id"   element={<WardDetails />} />
            <Route path="/analytics"  element={<Analytics />} />
            <Route path="/reports"    element={<Reports />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"        element={<Navigate to="/login" replace />} />
        <Route path="/login"   element={<LoginPage />} />
        <Route path="/*"       element={<AppShell />} />
      </Routes>
    </BrowserRouter>
  )
}
