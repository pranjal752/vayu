import { X, AlertTriangle, AlertCircle, Info, CheckCircle, Zap } from 'lucide-react'
import useAQIStore from '../store/useAQIStore'

const SEV_CONFIG = {
  critical: {
    color: '#ef4444', bg: 'rgba(239,68,68,0.08)',
    border: 'rgba(239,68,68,0.22)', leftBar: '#ef4444',
    Icon: AlertTriangle, label: 'CRITICAL',
    pulse: true,
  },
  high: {
    color: '#f97316', bg: 'rgba(249,115,22,0.07)',
    border: 'rgba(249,115,22,0.2)', leftBar: '#f97316',
    Icon: AlertCircle, label: 'HIGH',
    pulse: false,
  },
  medium: {
    color: '#eab308', bg: 'rgba(234,179,8,0.07)',
    border: 'rgba(234,179,8,0.18)', leftBar: '#eab308',
    Icon: Zap, label: 'MEDIUM',
    pulse: false,
  },
  info: {
    color: '#3b82f6', bg: 'rgba(59,130,246,0.07)',
    border: 'rgba(59,130,246,0.18)', leftBar: '#3b82f6',
    Icon: Info, label: 'INFO',
    pulse: false,
  },
}

function timeAgo(mins) {
  if (mins < 60) return `${mins}m ago`
  return `${Math.floor(mins / 60)}h ago`
}

export default function AlertsPanel() {
  const { alerts, dismissAlert } = useAQIStore()
  const criticalCount = alerts.filter((a) => a.severity === 'critical').length
  const highCount = alerts.filter((a) => a.severity === 'high').length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 12, paddingBottom: 10,
        borderBottom: '1px solid rgba(148,163,184,0.08)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <span style={{ fontSize: 12.5, fontWeight: 700, color: '#e2e8f0' }}>Live Alerts</span>
          {criticalCount > 0 && (
            <span style={{
              width: 7, height: 7, borderRadius: '50%', background: '#ef4444',
              display: 'inline-block', animation: 'pulseDot 1.8s infinite',
              boxShadow: '0 0 8px rgba(239,68,68,0.7)',
            }} />
          )}
        </div>
        <div style={{ display: 'flex', gap: 5 }}>
          {['critical', 'high', 'medium'].map((sev) => {
            const count = alerts.filter((a) => a.severity === sev).length
            const { color } = SEV_CONFIG[sev]
            return count > 0 ? (
              <span key={sev} style={{
                fontSize: 9.5, fontWeight: 700,
                padding: '2px 7px', borderRadius: 12,
                background: `${color}14`, color,
                border: `1px solid ${color}28`,
                letterSpacing: '0.3px',
              }}>
                {count} {sev}
              </span>
            ) : null
          })}
        </div>
      </div>

      {/* Alerts list */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {alerts.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <div style={{
              width: 44, height: 44, borderRadius: '50%',
              background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 10px',
            }}>
              <CheckCircle size={22} style={{ color: '#22c55e' }} />
            </div>
            <div style={{ fontSize: 12, color: '#64748b', fontWeight: 500 }}>All clear — no active alerts</div>
            <div style={{ fontSize: 10.5, color: '#334155', marginTop: 3 }}>Air quality within normal range</div>
          </div>
        )}

        {alerts.map((alert) => {
          const cfg = SEV_CONFIG[alert.severity] ?? SEV_CONFIG.info
          const { Icon } = cfg
          return (
            <div
              key={alert.id}
              style={{
                padding: '10px 12px 10px 14px',
                background: cfg.bg,
                border: `1px solid ${cfg.border}`,
                borderLeft: `3px solid ${cfg.leftBar}`,
                borderRadius: '0 10px 10px 0',
                position: 'relative',
                animation: 'slideInRight 0.3s ease',
                boxShadow: cfg.pulse ? `0 0 14px ${cfg.color}10` : 'none',
              }}
            >
              <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <div style={{
                  width: 24, height: 24, borderRadius: 6, flexShrink: 0,
                  background: `${cfg.color}14`,
                  border: `1px solid ${cfg.color}22`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginTop: 1,
                }}>
                  <Icon size={12} style={{ color: cfg.color }} strokeWidth={2.5} />
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4, flexWrap: 'wrap' }}>
                    <span style={{
                      fontSize: 9, fontWeight: 800, letterSpacing: '0.5px',
                      color: cfg.color, background: `${cfg.color}18`,
                      border: `1px solid ${cfg.color}28`,
                      padding: '1px 6px', borderRadius: 10,
                    }}>
                      {cfg.label}
                    </span>
                    <span style={{ fontSize: 11, fontWeight: 600, color: '#cbd5e1' }}>{alert.ward}</span>
                    <span style={{ fontSize: 9.5, color: '#334155', marginLeft: 'auto' }}>{timeAgo(alert.minsAgo)}</span>
                  </div>
                  <p style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.5, margin: 0 }}>
                    {alert.message}
                  </p>
                </div>

                <button
                  onClick={() => dismissAlert(alert.id)}
                  title="Dismiss"
                  style={{
                    background: 'rgba(148,163,184,0.06)',
                    border: '1px solid rgba(148,163,184,0.1)',
                    borderRadius: 5,
                    color: '#475569', cursor: 'pointer', padding: '3px 4px',
                    flexShrink: 0, lineHeight: 0,
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#e2e8f0'; e.currentTarget.style.background = 'rgba(148,163,184,0.12)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = '#475569'; e.currentTarget.style.background = 'rgba(148,163,184,0.06)' }}
                >
                  <X size={11} />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
