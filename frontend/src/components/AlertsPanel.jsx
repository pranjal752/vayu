import { X, AlertTriangle, AlertCircle, Info, CheckCircle } from 'lucide-react'
import useAQIStore from '../store/useAQIStore'

const SEV_CONFIG = {
  critical: { color: '#ef4444', bg: 'rgba(239,68,68,0.1)',  border: 'rgba(239,68,68,0.25)', Icon: AlertTriangle, label: 'CRITICAL' },
  high:     { color: '#f97316', bg: 'rgba(249,115,22,0.1)', border: 'rgba(249,115,22,0.25)', Icon: AlertCircle,   label: 'HIGH'     },
  medium:   { color: '#eab308', bg: 'rgba(234,179,8,0.1)',  border: 'rgba(234,179,8,0.25)',  Icon: AlertCircle,   label: 'MEDIUM'   },
  info:     { color: '#3b82f6', bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.25)', Icon: Info,          label: 'INFO'     },
}

function timeAgo(mins) {
  if (mins < 60) return `${mins}m ago`
  return `${Math.floor(mins / 60)}h ago`
}

export default function AlertsPanel() {
  const { alerts, dismissAlert } = useAQIStore()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 12,
      }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: '#94a3b8' }}>
          Live Alerts
        </span>
        <div style={{ display: 'flex', gap: 6 }}>
          {['critical', 'high', 'medium'].map((sev) => {
            const count = alerts.filter((a) => a.severity === sev).length
            const { color, bg } = SEV_CONFIG[sev]
            return count > 0 ? (
              <span key={sev} style={{
                fontSize: 9.5, fontWeight: 700,
                padding: '2px 6px', borderRadius: 5,
                background: bg, color, letterSpacing: '0.3px',
              }}>
                {count} {sev}
              </span>
            ) : null
          })}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {alerts.length === 0 && (
          <div style={{ textAlign: 'center', padding: '32px 0' }}>
            <CheckCircle size={28} style={{ color: '#22c55e', margin: '0 auto 8px' }} />
            <div style={{ fontSize: 12, color: '#64748b' }}>All clear — no active alerts</div>
          </div>
        )}
        {alerts.map((alert) => {
          const cfg = SEV_CONFIG[alert.severity] ?? SEV_CONFIG.info
          const { Icon } = cfg
          return (
            <div key={alert.id} style={{
              padding: '10px 12px',
              background: cfg.bg,
              border: `1px solid ${cfg.border}`,
              borderLeft: `3px solid ${cfg.color}`,
              borderRadius: '0 8px 8px 0',
              position: 'relative',
              animation: 'fadeSlideIn 0.3s ease',
            }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <Icon size={13} style={{ color: cfg.color, flexShrink: 0, marginTop: 1 }} strokeWidth={2.5} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3, flexWrap: 'wrap' }}>
                    <span style={{
                      fontSize: 9, fontWeight: 700, letterSpacing: '0.5px',
                      color: cfg.color, background: `${cfg.color}18`,
                      padding: '1px 5px', borderRadius: 4,
                    }}>{cfg.label}</span>
                    <span style={{ fontSize: 10.5, fontWeight: 600, color: '#e2e8f0' }}>{alert.ward}</span>
                    <span style={{ fontSize: 9.5, color: '#475569', marginLeft: 'auto' }}>{timeAgo(alert.minsAgo)}</span>
                  </div>
                  <p style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.45, margin: 0 }}>
                    {alert.message}
                  </p>
                </div>
                <button
                  onClick={() => dismissAlert(alert.id)}
                  style={{
                    background: 'none', border: 'none',
                    color: '#334155', cursor: 'pointer', padding: 2,
                    flexShrink: 0, lineHeight: 0,
                  }}>
                  <X size={12} />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
