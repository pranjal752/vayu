import { NavLink, useLocation } from 'react-router-dom'
import { LayoutDashboard, BarChart2, FileText, Wind, ChevronRight, Layers, Satellite, MessageSquare, Map } from 'lucide-react'
import useAQIStore from '../store/useAQIStore'
import { getAQIColor, getAQILabel } from '../utils/aqiColors'


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
      background: 'linear-gradient(175deg, rgba(14,33,28,0.94) 0%, rgba(16,39,33,0.92) 100%)',
      borderRight: '1px solid rgba(167,243,208,0.12)',
      display: 'flex',
      flexDirection: 'column',
      padding: '0',
      position: 'relative',
      zIndex: 10,
    }}>
      {/* Logo */}
      <div style={{
        padding: '22px 20px 18px',
        borderBottom: '1px solid rgba(167,243,208,0.12)',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}>
        <div style={{
          width: 44,
          height: 40,
          borderRadius: 11,
          background: 'linear-gradient(145deg, rgba(29,78,216,0.26) 0%, rgba(124,58,237,0.23) 100%)',
          border: '1px solid rgba(96,165,250,0.34)',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 8px 18px rgba(29,78,216,0.24)',
          flexShrink: 0,
        }}>
          <span style={{
            position: 'absolute',
            width: 17,
            height: 17,
            borderRadius: '50%',
            left: 6,
            top: 14,
            background: 'rgba(191,219,254,0.92)',
          }} />
          <span style={{
            position: 'absolute',
            width: 20,
            height: 20,
            borderRadius: '50%',
            left: 15,
            top: 9,
            background: 'rgba(219,234,254,0.95)',
          }} />
          <span style={{
            position: 'absolute',
            width: 16,
            height: 16,
            borderRadius: '50%',
            left: 25,
            top: 14,
            background: 'rgba(191,219,254,0.92)',
          }} />
          <span style={{
            position: 'absolute',
            left: 8,
            top: 24,
            width: 29,
            height: 10,
            borderRadius: 6,
            background: 'rgba(219,234,254,0.95)',
          }} />
          <span style={{
            position: 'absolute',
            right: 5,
            top: 5,
            fontSize: 9,
            fontWeight: 900,
            color: '#38bdf8',
            textShadow: '0 0 8px rgba(56,189,248,0.65)',
          }}>
            V
          </span>
          <span style={{
            position: 'absolute',
            bottom: 4,
            left: 8,
            width: 14,
            height: 1.5,
            borderRadius: 2,
            background: 'rgba(125,211,252,0.75)',
          }} />
          <span style={{
            position: 'absolute',
            bottom: 4,
            left: 24,
            width: 10,
            height: 1.5,
            borderRadius: 2,
            background: 'rgba(125,211,252,0.55)',
          }} />
        </div>
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9', letterSpacing: '-0.3px' }}>VAYU</div>
          <div style={{ fontSize: 10, color: '#64748b', fontWeight: 500, letterSpacing: '0.5px' }}>AIR INTELLIGENCE</div>
        </div>
      </div>

      {/* City AQI panel */}
      <div style={{
        margin: '12px 12px 4px',
        padding: '11px 14px',
        background: `linear-gradient(135deg, ${aqiColor}14 0%, rgba(5,8,18,0.6) 100%)`,
        border: `1px solid ${aqiColor}30`,
        borderRadius: 12,
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Glow */}
        <div style={{ position: 'absolute', top: -20, right: -20, width: 70, height: 70, borderRadius: '50%', background: `radial-gradient(circle, ${aqiColor}20 0%, transparent 70%)`, pointerEvents: 'none' }} />
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
          <div>
            <div style={{ fontSize: 9.5, color: '#64748b', fontWeight: 700, letterSpacing: '0.8px', textTransform: 'uppercase' }}>City AQI</div>
            <div style={{ fontSize: 10.5, color: '#475569', marginTop: 1 }}>Ghaziabad, UP</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 28, fontWeight: 900, color: aqiColor, lineHeight: 1, textShadow: `0 0 20px ${aqiColor}50` }}>{cityAqi}</div>
            <div style={{ fontSize: 9, color: aqiColor, fontWeight: 700, marginTop: 2 }}>{getAQILabel(cityAqi).toUpperCase()}</div>
          </div>
        </div>
        {/* Mini spectrum bar with marker */}
        <div style={{ position: 'relative', height: 5, borderRadius: 3 }}>
          <div style={{ position: 'absolute', inset: 0, borderRadius: 3, background: 'linear-gradient(to right, #22c55e, #eab308, #f97316, #ef4444, #a855f7, #dc2626)', opacity: 0.22 }} />
          <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${Math.min((cityAqi / 500) * 100, 97)}%`, borderRadius: 3, background: aqiColor, opacity: 0.8 }} />
          <div style={{ position: 'absolute', left: `${Math.min((cityAqi / 500) * 100, 96)}%`, top: '50%', transform: 'translate(-50%,-50%)', width: 9, height: 9, borderRadius: '50%', background: aqiColor, border: '2px solid #03050d', boxShadow: `0 0 8px ${aqiColor}` }} />
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ padding: '8px 10px', flex: 1 }}>
        <div style={{ fontSize: 9.5, color: '#475569', fontWeight: 600, letterSpacing: '0.8px', padding: '8px 8px 4px', textTransform: 'uppercase' }}>Menu</div>
        {NAV.map(({ to, icon: Icon, label }) => {
          const isActive = location.pathname.startsWith(to)
          return (
            <NavLink key={to} to={to} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '9px 11px',
              borderRadius: 9,
              marginBottom: 3,
              color: isActive ? '#e2e8f0' : '#64748b',
              background: isActive
                ? 'linear-gradient(135deg, rgba(59,130,246,0.18) 0%, rgba(59,130,246,0.06) 100%)'
                : 'transparent',
              border: `1px solid ${isActive ? 'rgba(59,130,246,0.30)' : 'transparent'}`,
              textDecoration: 'none',
              fontSize: 13,
              fontWeight: isActive ? 600 : 500,
              transition: 'all 0.18s',
              boxShadow: isActive ? '0 2px 12px rgba(59,130,246,0.08)' : 'none',
            }}>
              <Icon size={15} strokeWidth={isActive ? 2.2 : 1.8} style={{ color: isActive ? '#60a5fa' : '#64748b' }} />
              <span style={{ flex: 1 }}>{label}</span>
              {isActive && <ChevronRight size={12} style={{ color: '#3b82f6' }} />}
            </NavLink>
          )
        })}

        <div style={{ fontSize: 9.5, color: '#475569', fontWeight: 600, letterSpacing: '0.8px', padding: '16px 8px 4px', textTransform: 'uppercase' }}>Map Layers</div>
        {[
          { key: 'aqi',       label: 'AQI Heatmap',        color: '#3b82f6', Icon: Map       },
          { key: 'sources',   label: 'Pollution Sources',   color: '#f97316', Icon: Layers    },
          { key: 'satellite', label: 'Satellite Hotspots',  color: '#ef4444', Icon: Satellite },
          { key: 'reports',   label: 'Citizen Reports',     color: '#22c55e', Icon: MessageSquare },
        ].map(({ key, label, color, Icon }) => {
          const active = activeLayers.includes(key)
          return (
            <button key={key} onClick={() => toggleLayer(key)} style={{
              display: 'flex', alignItems: 'center', gap: 9,
              padding: '7px 10px', width: '100%',
              borderRadius: 7, marginBottom: 2,
              background: active ? `${color}0d` : 'transparent',
              border: `1px solid ${active ? color + '28' : 'transparent'}`,
              color: active ? '#e2e8f0' : '#475569',
              cursor: 'pointer', fontSize: 12, fontWeight: active ? 600 : 500,
              transition: 'all 0.15s',
              textAlign: 'left',
            }}>
              <span style={{
                width: 7, height: 7, borderRadius: '50%', flexShrink: 0,
                background: active ? color : '#1e293b',
                boxShadow: active ? `0 0 6px ${color}` : 'none',
                transition: 'all 0.2s',
              }} />
              {Icon && <Icon size={12} style={{ color: active ? color : '#334155', flexShrink: 0 }} strokeWidth={active ? 2.2 : 1.8} />} 
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
