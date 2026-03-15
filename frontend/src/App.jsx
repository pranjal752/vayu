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
        background: '#05080f',
        color: '#e2e8f0',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}>
        <Sidebar />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
          <Navbar />
          <main style={{
            flex: 1,
            overflow: 'auto',
            padding: '22px 26px',
            background: '#05080f',
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
