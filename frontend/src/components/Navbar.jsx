import { useState, useEffect } from 'react'
import { Bell, RefreshCw, Wind } from 'lucide-react'
import useAQIStore from '../store/useAQIStore'
import { getAQIColor, getAQILabel } from '../utils/aqiColors'
import { formatTime, formatDate } from '../utils/formatters'

export default function Navbar() {
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

  return (
    <header style={{
      height: 60,
      background: 'rgba(8,13,26,0.95)',
      borderBottom: '1px solid rgba(148,163,184,0.08)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 24px',
      gap: 16,
      backdropFilter: 'blur(8px)',
      flexShrink: 0,
      zIndex: 9,
    }}>
      {/* Page title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
        <Wind size={16} style={{ color: '#3b82f6' }} strokeWidth={2} />
        <span style={{ fontSize: 13, fontWeight: 600, color: '#94a3b8' }}>
          Ghaziabad Pollution Intelligence Platform
        </span>
      </div>

      {/* Live indicator + AQI badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{
          width: 7, height: 7, borderRadius: '50%', background: '#22c55e',
          display: 'inline-block', animation: 'pulseDot 2s infinite',
        }} />
        <span style={{ fontSize: 11, color: '#22c55e', fontWeight: 600 }}>LIVE</span>
      </div>

      <div style={{
        padding: '4px 10px',
        borderRadius: 8,
        background: `${aqiColor}14`,
        border: `1px solid ${aqiColor}30`,
        display: 'flex', alignItems: 'center', gap: 7,
      }}>
        <span style={{ fontSize: 11, color: '#64748b', fontWeight: 500 }}>City AQI</span>
        <span style={{ fontSize: 16, fontWeight: 800, color: aqiColor }}>{cityAqi}</span>
        <span style={{ fontSize: 10, color: aqiColor, opacity: 0.85 }}>{getAQILabel(cityAqi)}</span>
      </div>

      {/* Clock */}
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0', fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.3px' }}>
          {formatTime(time)}
        </div>
        <div style={{ fontSize: 10, color: '#475569' }}>{formatDate(time)}</div>
      </div>

      {/* Refresh */}
      <button onClick={handleRefresh} style={{
        width: 36, height: 36, borderRadius: 8,
        background: 'rgba(148,163,184,0.06)',
        border: '1px solid rgba(148,163,184,0.1)',
        color: '#64748b', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'color 0.2s',
      }}>
        <RefreshCw size={14} style={{ animation: refreshing ? 'spinOnce 1.2s linear' : 'none' }} />
      </button>

      {/* Alerts bell */}
      <button style={{
        width: 36, height: 36, borderRadius: 8,
        background: criticalCount > 0 ? 'rgba(239,68,68,0.1)' : 'rgba(148,163,184,0.06)',
        border: `1px solid ${criticalCount > 0 ? 'rgba(239,68,68,0.3)' : 'rgba(148,163,184,0.1)'}`,
        color: criticalCount > 0 ? '#ef4444' : '#64748b',
        cursor: 'pointer', position: 'relative',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.2s',
      }}>
        <Bell size={14} />
        {criticalCount > 0 && (
          <span style={{
            position: 'absolute', top: -4, right: -4,
            width: 16, height: 16, borderRadius: '50%',
            background: '#ef4444', color: '#fff',
            fontSize: 9, fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '2px solid #080d1a',
          }}>{criticalCount}</span>
        )}
      </button>
    </header>
  )
}
