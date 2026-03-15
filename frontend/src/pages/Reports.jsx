import { useState } from 'react'
import { Send, CheckCircle, Clock, AlertCircle, MapPin } from 'lucide-react'
import useAQIStore from '../store/useAQIStore'

const card = (extra = {}) => ({
  background: 'rgba(10,16,30,0.85)',
  border: '1px solid rgba(148,163,184,0.1)',
  borderRadius: 14,
  ...extra,
})

const STATUS_CFG = {
  verified: { color: '#22c55e', bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.2)', Icon: CheckCircle, label: 'Verified'  },
  pending:  { color: '#eab308', bg: 'rgba(234,179,8,0.1)',  border: 'rgba(234,179,8,0.2)',  Icon: Clock,        label: 'Pending'   },
  resolved: { color: '#3b82f6', bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.2)', Icon: CheckCircle,  label: 'Resolved'  },
}

const REPORT_TYPES = ['Garbage Burning', 'Construction Dust', 'Industrial Smoke', 'Crop Burning', 'Vehicle Smoke', 'Other']

const INITIAL = { ward: '', type: '', description: '' }

export default function Reports() {
  const { citizenReports, wards, submitReport } = useAQIStore()
  const [form, setForm] = useState(INITIAL)
  const [submitted, setSubmitted] = useState(false)
  const [filter, setFilter] = useState('all')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.ward || !form.type || !form.description.trim()) return
    submitReport(form)
    setForm(INITIAL)
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  const filtered = filter === 'all' ? citizenReports : citizenReports.filter((r) => r.status === filter)

  const inputStyle = {
    width: '100%', padding: '9px 12px',
    background: 'rgba(148,163,184,0.05)',
    border: '1px solid rgba(148,163,184,0.12)',
    borderRadius: 8, color: '#e2e8f0', fontSize: 12,
    outline: 'none', fontFamily: 'inherit',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, animation: 'fadeSlideIn 0.4s ease' }}>
      <div>
        <h1 style={{ fontSize: 20, fontWeight: 800, color: '#f1f5f9', margin: 0 }}>Citizen Reports</h1>
        <p style={{ fontSize: 11.5, color: '#475569', marginTop: 4 }}>
          Submit pollution observations or review community-reported incidents across Ghaziabad
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 16, alignItems: 'start' }}>

        {/* Submit form */}
        <div style={card({ padding: 20 })}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <MapPin size={14} style={{ color: '#3b82f6' }} /> Report Pollution
          </div>

          {submitted && (
            <div style={{
              padding: '10px 14px', borderRadius: 8, marginBottom: 14,
              background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)',
              color: '#22c55e', fontSize: 12, display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <CheckCircle size={14} /> Report submitted successfully!
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <label style={{ fontSize: 10.5, color: '#64748b', fontWeight: 600, display: 'block', marginBottom: 5, letterSpacing: '0.3px', textTransform: 'uppercase' }}>
                Ward / Area
              </label>
              <select
                value={form.ward}
                onChange={(e) => setForm({ ...form, ward: e.target.value })}
                style={{ ...inputStyle, cursor: 'pointer' }}
                required
              >
                <option value="" disabled>Select ward…</option>
                {wards.map((w) => <option key={w.id} value={w.name}>{w.name}</option>)}
              </select>
            </div>

            <div>
              <label style={{ fontSize: 10.5, color: '#64748b', fontWeight: 600, display: 'block', marginBottom: 5, letterSpacing: '0.3px', textTransform: 'uppercase' }}>
                Pollution Type
              </label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                style={{ ...inputStyle, cursor: 'pointer' }}
                required
              >
                <option value="" disabled>Select type…</option>
                {REPORT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div>
              <label style={{ fontSize: 10.5, color: '#64748b', fontWeight: 600, display: 'block', marginBottom: 5, letterSpacing: '0.3px', textTransform: 'uppercase' }}>
                Description
              </label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Describe what you observed — location, time, intensity…"
                rows={4}
                style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.5 }}
                required
              />
            </div>

            <button type="submit" style={{
              padding: '10px',
              background: 'linear-gradient(135deg, #1d4ed8, #7c3aed)',
              border: 'none', borderRadius: 8,
              color: '#fff', fontSize: 12, fontWeight: 600,
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
              transition: 'opacity 0.2s',
              fontFamily: 'inherit',
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              <Send size={13} /> Submit Report
            </button>
          </form>

          {/* Summary */}
          <div style={{ marginTop: 18, paddingTop: 14, borderTop: '1px solid rgba(148,163,184,0.08)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              {Object.entries(STATUS_CFG).map(([status, cfg]) => {
                const count = citizenReports.filter((r) => r.status === status).length
                return (
                  <div key={status} style={{
                    textAlign: 'center', padding: '8px 4px', borderRadius: 8,
                    background: cfg.bg, border: `1px solid ${cfg.border}`,
                  }}>
                    <div style={{ fontSize: 18, fontWeight: 800, color: cfg.color }}>{count}</div>
                    <div style={{ fontSize: 9.5, color: cfg.color, fontWeight: 600 }}>{cfg.label}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Reports list */}
        <div style={card({ padding: 20 })}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0', flex: 1 }}>
              Community Reports ({filtered.length})
            </span>
            <div style={{ display: 'flex', gap: 6 }}>
              {['all', 'pending', 'verified', 'resolved'].map((f) => (
                <button key={f} onClick={() => setFilter(f)} style={{
                  padding: '4px 10px', borderRadius: 6, fontSize: 10.5, fontWeight: 600,
                  cursor: 'pointer', border: '1px solid', textTransform: 'capitalize', fontFamily: 'inherit',
                  background: filter === f ? 'rgba(59,130,246,0.15)' : 'transparent',
                  color: filter === f ? '#93c5fd' : '#64748b',
                  borderColor: filter === f ? 'rgba(59,130,246,0.3)' : 'rgba(148,163,184,0.1)',
                  transition: 'all 0.15s',
                }}>{f}</button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {filtered.map((report) => {
              const cfg = STATUS_CFG[report.status] ?? STATUS_CFG.pending
              const { Icon } = cfg
              return (
                <div key={report.id} style={{
                  padding: '12px 14px', borderRadius: 10,
                  background: 'rgba(148,163,184,0.03)',
                  border: '1px solid rgba(148,163,184,0.08)',
                  display: 'flex', gap: 12, alignItems: 'flex-start',
                  transition: 'border-color 0.15s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(148,163,184,0.15)'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(148,163,184,0.08)'}
                >
                  <div style={{ width: 30, height: 30, borderRadius: 8, background: cfg.bg, border: `1px solid ${cfg.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={14} style={{ color: cfg.color }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#e2e8f0' }}>{report.type}</span>
                      <span style={{
                        fontSize: 9.5, fontWeight: 700, padding: '1px 6px', borderRadius: 4,
                        background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`,
                      }}>{cfg.label}</span>
                      <span style={{ fontSize: 11, color: '#475569', display: 'flex', alignItems: 'center', gap: 3 }}>
                        <MapPin size={9} /> {report.ward}
                      </span>
                      <span style={{ fontSize: 10, color: '#334155', marginLeft: 'auto' }}>
                        {report.minsAgo < 60 ? `${report.minsAgo}m ago` : `${Math.floor(report.minsAgo / 60)}h ago`}
                      </span>
                    </div>
                    <p style={{ margin: 0, fontSize: 11.5, color: '#64748b', lineHeight: 1.5 }}>{report.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
