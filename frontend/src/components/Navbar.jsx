import { useState, useEffect } from 'react'
import { Bell, RefreshCw, Cloud, Menu, RadioTower } from 'lucide-react'
import useAQIStore from '../store/useAQIStore'
import { getAQIColor, getAQILabel } from '../utils/aqiColors'
import { formatTime, formatDate } from '../utils/formatters'

const HEALTH_SHORT = {
  'Good': 'Air quality good',
  'Moderate': 'Air quality acceptable',
  'Unhealthy for Sensitive Groups': 'Sensitive groups at risk',
  'Unhealthy': 'Unhealthy for all',
  'Very Unhealthy': 'Very unhealthy — limit outdoor activity',
  'Hazardous': '⚠ Hazardous — stay indoors',
}

export default function Navbar({ onToggleSidebar = () => {} }) {
  const { cityAqi, alerts } = useAQIStore()
  const [time, setTime] = useState(new Date())
  const [refreshing, setRefreshing] = useState(false)
  const criticalCount = alerts.filter((a) => a.severity === 'critical').length

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const handleRefresh = () => {
    setRefreshing(true)
    setTimeout(() => setRefreshing(false), 1200)
  }

  const aqiColor = getAQIColor(cityAqi)
  const aqiLabel = getAQILabel(cityAqi)
  const healthShort = HEALTH_SHORT[aqiLabel] ?? ''

  return (
    <header className="topbar-shell" style={{
      height: 68,
      background: 'linear-gradient(90deg, rgba(9,24,21,0.9) 0%, rgba(10,29,25,0.88) 50%, rgba(7,34,31,0.84) 100%)',
      borderBottom: '1px solid rgba(148,163,184,0.15)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 16px 0 14px',
      gap: 14,
      backdropFilter: 'blur(10px)',
      flexShrink: 0,
      zIndex: 9,
      position: 'relative',
    }}>
      {/* AQI level accent strip at very bottom of header */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 2,
        background: `linear-gradient(to right, transparent 0%, ${aqiColor}50 30%, ${aqiColor}80 50%, ${aqiColor}50 70%, transparent 100%)`,
        animation: 'pulseGlow 3s ease-in-out infinite',
      }} />

      <button className="sidebar-toggle-btn" onClick={onToggleSidebar} aria-label="Open navigation">
        <Menu size={15} />
      </button>

      {/* Page title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
        <div style={{
          width: 28, height: 28, borderRadius: 7,
          background: 'linear-gradient(135deg, #14b8a6, #0e7490)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <Cloud size={13} style={{ color: '#e0f2fe' }} strokeWidth={2.4} />
        </div>
        <div>
          <div style={{ fontSize: 12.5, fontWeight: 700, color: '#94a3b8', lineHeight: 1 }}>
            Ghaziabad Pollution Intelligence
          </div>
          <div style={{ fontSize: 9.5, color: '#334155', marginTop: 1 }}>
            {healthShort}
          </div>
        </div>
      </div>

      {/* Live indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <RadioTower size={12} style={{ color: '#22c55e', opacity: 0.9 }} />
        <span style={{
          width: 7, height: 7, borderRadius: '50%', background: '#22c55e',
          display: 'inline-block', animation: 'pulseDot 2s infinite',
          boxShadow: '0 0 8px rgba(34,197,94,0.6)',
        }} />
        <span style={{ fontSize: 10.5, color: '#22c55e', fontWeight: 700, letterSpacing: '0.5px' }}>LIVE</span>
      </div>

      {/* AQI Badge */}
      <div className="topbar-aqi-badge" style={{
        padding: '6px 12px',
        borderRadius: 9,
        background: `linear-gradient(135deg, ${aqiColor}18 0%, ${aqiColor}08 100%)`,
        border: `1px solid ${aqiColor}35`,
        display: 'flex', alignItems: 'center', gap: 8,
        boxShadow: `0 0 16px ${aqiColor}10`,
      }}>
        <span style={{ fontSize: 10, color: '#64748b', fontWeight: 600 }}>City AQI</span>
        <span style={{
          fontSize: 18, fontWeight: 900, color: aqiColor,
          fontVariantNumeric: 'tabular-nums',
          textShadow: `0 0 16px ${aqiColor}60`,
        }}>
          {cityAqi}
        </span>
        <span style={{
          fontSize: 9.5, fontWeight: 700, color: aqiColor,
          background: `${aqiColor}18`, border: `1px solid ${aqiColor}30`,
          padding: '2px 7px', borderRadius: 12,
        }}>
          {aqiLabel}
        </span>
      </div>

      {/* Clock */}
      <div className="topbar-clock" style={{ textAlign: 'right' }}>
        <div style={{
          fontSize: 13.5, fontWeight: 700, color: '#e2e8f0',
          fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.3px',
        }}>
          {formatTime(time)}
        </div>
        <div style={{ fontSize: 9.5, color: '#334155' }}>{formatDate(time)}</div>
      </div>

      {/* Refresh button */}
      <button
        onClick={handleRefresh}
        title="Refresh data"
        className="topbar-icon-btn"
        style={{
          width: 34, height: 34, borderRadius: 8,
          background: 'rgba(148,163,184,0.05)',
          border: '1px solid rgba(148,163,184,0.1)',
          color: '#64748b', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.2s',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.borderColor = 'rgba(148,163,184,0.2)' }}
        onMouseLeave={(e) => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.borderColor = 'rgba(148,163,184,0.1)' }}
      >
        <RefreshCw size={13} style={{ animation: refreshing ? 'spinOnce 1.2s linear' : 'none' }} />
      </button>

      {/* Alerts bell */}
      <button
        title={`${criticalCount} critical alerts`}
        className="topbar-icon-btn"
        style={{
          width: 34, height: 34, borderRadius: 8,
          background: criticalCount > 0 ? 'rgba(239,68,68,0.1)' : 'rgba(148,163,184,0.05)',
          border: `1px solid ${criticalCount > 0 ? 'rgba(239,68,68,0.3)' : 'rgba(148,163,184,0.1)'}`,
          color: criticalCount > 0 ? '#ef4444' : '#64748b',
          cursor: 'pointer', position: 'relative',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.2s',
          boxShadow: criticalCount > 0 ? '0 0 12px rgba(239,68,68,0.15)' : 'none',
        }}>
        <Bell size={13} />
        {criticalCount > 0 && (
          <span style={{
            position: 'absolute', top: -4, right: -4,
            width: 16, height: 16, borderRadius: '50%',
            background: '#ef4444', color: '#fff',
            fontSize: 9, fontWeight: 800,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '2px solid #03050d',
          }}>
            {criticalCount}
          </span>
        )}
      </button>
    </header>
  )
}
