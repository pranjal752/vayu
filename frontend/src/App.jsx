import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import WardDetails from './pages/WardDetails'
import Analytics from './pages/Analytics'
import Reports from './pages/Reports'
import './App.css'

export default function App() {
  return (
    <BrowserRouter>
      <div style={{
        display: 'flex',
        height: '100vh',
        overflow: 'hidden',
        background: 'linear-gradient(160deg, #0e1b17 0%, #132520 100%)',
        color: '#dbe7e2',
        fontFamily: "'Segoe UI', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      }}>
        <Sidebar />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
          <Navbar />
          <main style={{
            flex: 1,
            overflow: 'auto',
            padding: '22px 18px 22px 22px',
            background: 'transparent',
          }}>
            <Routes>
              <Route path="/"           element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard"  element={<Dashboard />} />
              <Route path="/ward/:id"   element={<WardDetails />} />
              <Route path="/analytics"  element={<Analytics />} />
              <Route path="/reports"    element={<Reports />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  )
}
