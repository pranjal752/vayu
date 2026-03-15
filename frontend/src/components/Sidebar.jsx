import { NavLink, useLocation } from 'react-router-dom'
import { LayoutDashboard, BarChart2, FileText, Wind, ChevronRight } from 'lucide-react'
import useAQIStore from '../store/useAQIStore'
import { getAQIColor } from '../utils/aqiColors'

const NAV = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard'  },
  { to: '/analytics', icon: BarChart2,       label: 'Analytics'  },
  { to: '/reports',   icon: FileText,        label: 'Reports'    },
]

const ROLES = ['admin', 'analyst', 'citizen']

export default function Sidebar() {
  const location = useLocation()
  const { cityAqi, activeRole, setRole } = useAQIStore()
  const { activeLayers, toggleLayer } = useAQIStore()
  const aqiColor = getAQIColor(cityAqi)

  return (
    <aside style={{
      width: 230,
      minWidth: 230,
      height: '100vh',
      background: '#080d1a',
      borderRight: '1px solid rgba(148,163,184,0.08)',
      display: 'flex',
      flexDirection: 'column',
      padding: '0',
      position: 'relative',
      zIndex: 10,
    }}>
      {/* Logo */}
      <div style={{
        padding: '22px 20px 18px',
        borderBottom: '1px solid rgba(148,163,184,0.08)',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}>
        <div style={{
          width: 38, height: 38,
          borderRadius: 10,
          background: 'linear-gradient(135deg, #1d4ed8 0%, #7c3aed 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, fontWeight: 900,
          color: '#fff',
          boxShadow: '0 4px 14px rgba(124,58,237,0.4)',
        }}>V</div>
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9', letterSpacing: '-0.3px' }}>VAYU</div>
          <div style={{ fontSize: 10, color: '#64748b', fontWeight: 500, letterSpacing: '0.5px' }}>AIR INTELLIGENCE</div>
        </div>
      </div>

      {/* City AQI pill */}
      <div style={{
        margin: '14px 14px 6px',
        padding: '10px 14px',
        background: `${aqiColor}14`,
        border: `1px solid ${aqiColor}30`,
        borderRadius: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ fontSize: 9.5, color: '#64748b', fontWeight: 600, letterSpacing: '0.8px', textTransform: 'uppercase' }}>City AQI</div>
          <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 1 }}>Ghaziabad, UP</div>
        </div>
        <div style={{ fontSize: 26, fontWeight: 800, color: aqiColor, lineHeight: 1 }}>{cityAqi}</div>
      </div>

      {/* Navigation */}
      <nav style={{ padding: '8px 10px', flex: 1 }}>
        <div style={{ fontSize: 9.5, color: '#475569', fontWeight: 600, letterSpacing: '0.8px', padding: '8px 8px 4px', textTransform: 'uppercase' }}>Menu</div>
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} style={({ isActive }) => ({
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '9px 10px',
            borderRadius: 8,
            marginBottom: 2,
            color: isActive ? '#f1f5f9' : '#64748b',
            background: isActive ? 'rgba(59,130,246,0.12)' : 'transparent',
            border: `1px solid ${isActive ? 'rgba(59,130,246,0.25)' : 'transparent'}`,
            textDecoration: 'none',
            fontSize: 13,
            fontWeight: 500,
            transition: 'all 0.18s',
          })}>
            <Icon size={16} strokeWidth={1.8} />
            <span style={{ flex: 1 }}>{label}</span>
            {location.pathname.startsWith(to) && <ChevronRight size={12} style={{ color: '#3b82f6' }} />}
          </NavLink>
        ))}

        <div style={{ fontSize: 9.5, color: '#475569', fontWeight: 600, letterSpacing: '0.8px', padding: '16px 8px 4px', textTransform: 'uppercase' }}>Map Layers</div>
        {[
          { key: 'aqi',       label: 'AQI Heatmap',   color: '#3b82f6' },
          { key: 'sources',   label: 'Pollution Sources', color: '#f97316' },
          { key: 'satellite', label: 'Satellite Hotspots', color: '#ef4444' },
          { key: 'reports',   label: 'Citizen Reports',color: '#22c55e' },
        ].map(({ key, label, color }) => {
          const active = activeLayers.includes(key)
          return (
            <button key={key} onClick={() => toggleLayer(key)} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '8px 10px', width: '100%',
              borderRadius: 7, marginBottom: 2,
              background: 'transparent', border: 'none',
              color: active ? '#e2e8f0' : '#475569',
              cursor: 'pointer', fontSize: 12, fontWeight: 500,
              transition: 'color 0.15s',
              textAlign: 'left',
            }}>
              <span style={{
                width: 8, height: 8, borderRadius: 2, flexShrink: 0,
                background: active ? color : '#334155',
                transition: 'background 0.15s',
              }} />
              {label}
            </button>
          )
        })}
      </nav>

      {/* Role switcher */}
      <div style={{
        padding: '12px 14px',
        borderTop: '1px solid rgba(148,163,184,0.08)',
      }}>
        <div style={{ fontSize: 9.5, color: '#475569', fontWeight: 600, letterSpacing: '0.8px', marginBottom: 8, textTransform: 'uppercase' }}>Role</div>
        <div style={{ display: 'flex', gap: 4 }}>
          {ROLES.map((r) => (
            <button key={r} onClick={() => setRole(r)} style={{
              flex: 1, padding: '5px 0',
              borderRadius: 6,
              border: '1px solid',
              borderColor: activeRole === r ? '#3b82f6' : 'rgba(148,163,184,0.12)',
              background: activeRole === r ? 'rgba(59,130,246,0.15)' : 'transparent',
              color: activeRole === r ? '#93c5fd' : '#64748b',
              fontSize: 10, fontWeight: 600,
              cursor: 'pointer', textTransform: 'capitalize',
              transition: 'all 0.15s',
            }}>{r}</button>
          ))}
        </div>
      </div>
    </aside>
  )
}
