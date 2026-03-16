import { useMemo, useState } from 'react'
import { Send, CheckCircle, Clock, MapPin, ShieldCheck, Sparkles, Search, AlertTriangle, ArrowRight } from 'lucide-react'
import useAQIStore from '../store/useAQIStore'

const card = (extra = {}) => ({
  background: 'rgba(19,42,35,0.74)',
  border: '1px solid rgba(167,243,208,0.14)',
  borderRadius: 14,
  ...extra,
})

const STATUS_CFG = {
  verified: { color: '#22c55e', bg: 'rgba(34,197,94,0.11)', border: 'rgba(34,197,94,0.26)', Icon: CheckCircle, label: 'Verified' },
  pending: { color: '#f59e0b', bg: 'rgba(245,158,11,0.11)', border: 'rgba(245,158,11,0.26)', Icon: Clock, label: 'Pending' },
  resolved: { color: '#38bdf8', bg: 'rgba(56,189,248,0.11)', border: 'rgba(56,189,248,0.26)', Icon: ShieldCheck, label: 'Resolved' },
}

const REPORT_TYPES = ['Garbage Burning', 'Construction Dust', 'Industrial Smoke', 'Crop Burning', 'Vehicle Smoke', 'Other']
const INITIAL = { ward: '', type: '', description: '' }

function timeAgo(mins) {
  if (mins < 60) return `${mins}m ago`
  return `${Math.floor(mins / 60)}h ago`
}

export default function Reports() {
  const { citizenReports, wards, submitReport } = useAQIStore()
  const [form, setForm] = useState(INITIAL)
  const [submitted, setSubmitted] = useState(false)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  const pendingCount = citizenReports.filter((r) => r.status === 'pending').length
  const verifiedCount = citizenReports.filter((r) => r.status === 'verified').length
  const resolvedCount = citizenReports.filter((r) => r.status === 'resolved').length
  const recentCount = citizenReports.filter((r) => r.minsAgo <= 60).length

  const highPriorityCount = citizenReports.filter(
    (r) => (r.status === 'pending' && r.minsAgo <= 60) || /burn|smoke|industrial/i.test(r.type)
  ).length

  const wardReportCounts = useMemo(() => {
    const byWard = citizenReports.reduce((acc, report) => {
      acc[report.ward] = (acc[report.ward] ?? 0) + 1
      return acc
    }, {})
    return Object.entries(byWard)
      .map(([ward, count]) => ({ ward, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
  }, [citizenReports])

  const filtered = useMemo(() => {
    const byStatus = filter === 'all' ? citizenReports : citizenReports.filter((r) => r.status === filter)
    const q = search.trim().toLowerCase()
    if (!q) return byStatus
    return byStatus.filter((r) => {
      const hay = `${r.type} ${r.ward} ${r.description}`.toLowerCase()
      return hay.includes(q)
    })
  }, [citizenReports, filter, search])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.ward || !form.type || !form.description.trim()) return
    submitReport(form)
    setForm(INITIAL)
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 2600)
  }

  const inputStyle = {
    width: '100%',
    padding: '10px 12px',
    background: 'rgba(167,243,208,0.05)',
    border: '1px solid rgba(167,243,208,0.18)',
    borderRadius: 8,
    color: '#eaf5ef',
    fontSize: 12,
    outline: 'none',
    fontFamily: 'inherit',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%', animation: 'fadeSlideIn 0.4s ease' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 14, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#eaf5ef', margin: 0 }}>Citizen Reporting Command Center</h1>
          <p style={{ fontSize: 11.5, color: '#7da095', marginTop: 4 }}>
            Full-screen intake, moderation and escalation view for community pollution incidents.
          </p>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: 'rgba(239,68,68,0.10)', border: '1px solid rgba(239,68,68,0.28)',
          borderRadius: 999, padding: '5px 11px',
        }}>
          <AlertTriangle size={12} style={{ color: '#ef4444' }} />
          <span style={{ fontSize: 10.5, fontWeight: 700, color: '#ef4444' }}>{highPriorityCount} high-priority incidents</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
        {[
          { label: 'Total Reports', value: citizenReports.length, color: '#38bdf8', note: 'In system' },
          { label: 'Pending', value: pendingCount, color: '#f59e0b', note: 'Need review' },
          { label: 'Verified', value: verifiedCount, color: '#22c55e', note: 'Field validated' },
          { label: 'Resolved', value: resolvedCount, color: '#38bdf8', note: 'Action complete' },
          { label: 'Last 60 min', value: recentCount, color: '#f97316', note: 'Fresh complaints' },
        ].map((item) => (
          <div key={item.label} style={card({ padding: '12px 14px' })}>
            <div style={{ fontSize: 10, color: '#88a89d', fontWeight: 700, textTransform: 'uppercase', marginBottom: 6 }}>{item.label}</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: item.color, lineHeight: 1 }}>{item.value}</div>
            <div style={{ fontSize: 10, color: '#6f9085', marginTop: 4 }}>{item.note}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 14, alignItems: 'start' }}>
        <div style={card({ padding: 18 })}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#eaf5ef', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
            <MapPin size={14} style={{ color: '#38bdf8' }} /> Submit Pollution Report
          </div>

          {submitted && (
            <div style={{
              padding: '10px 14px',
              borderRadius: 8,
              marginBottom: 12,
              background: 'rgba(34,197,94,0.12)',
              border: '1px solid rgba(34,197,94,0.22)',
              color: '#22c55e',
              fontSize: 12,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}>
              <CheckCircle size={14} /> Report submitted successfully
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <label style={{ fontSize: 10.5, color: '#7da095', fontWeight: 700, display: 'block', marginBottom: 5, letterSpacing: '0.3px', textTransform: 'uppercase' }}>
                Ward / Area
              </label>
              <select value={form.ward} onChange={(e) => setForm({ ...form, ward: e.target.value })} style={{ ...inputStyle, cursor: 'pointer' }} required>
                <option value="" disabled>Select ward...</option>
                {wards.map((w) => <option key={w.id} value={w.name}>{w.name}</option>)}
              </select>
            </div>

            <div>
              <label style={{ fontSize: 10.5, color: '#7da095', fontWeight: 700, display: 'block', marginBottom: 5, letterSpacing: '0.3px', textTransform: 'uppercase' }}>
                Pollution Type
              </label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} style={{ ...inputStyle, cursor: 'pointer' }} required>
                <option value="" disabled>Select type...</option>
                {REPORT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div>
              <label style={{ fontSize: 10.5, color: '#7da095', fontWeight: 700, display: 'block', marginBottom: 5, letterSpacing: '0.3px', textTransform: 'uppercase' }}>
                Description
              </label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Describe location, source and severity..."
                rows={5}
                style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.5 }}
                required
              />
            </div>

            <button
              type="submit"
              style={{
                padding: '10px',
                background: 'linear-gradient(135deg, #0ea5a4, #10b981)',
                border: 'none',
                borderRadius: 8,
                color: '#fff',
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 7,
                fontFamily: 'inherit',
              }}
            >
              <Send size={13} /> Submit Report
            </button>
          </form>
        </div>

        <div style={card({ padding: 18 })}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#eaf5ef', flex: 1 }}>
              Moderation Queue ({filtered.length})
            </span>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'rgba(167,243,208,0.05)', border: '1px solid rgba(167,243,208,0.16)',
              borderRadius: 8, padding: '5px 8px',
            }}>
              <Search size={11} style={{ color: '#7da095' }} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search reports"
                style={{
                  background: 'transparent', border: 'none', outline: 'none', color: '#eaf5ef',
                  fontSize: 11, width: 120,
                }}
              />
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {['all', 'pending', 'verified', 'resolved'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: 6,
                    fontSize: 10.5,
                    fontWeight: 700,
                    cursor: 'pointer',
                    border: '1px solid',
                    textTransform: 'capitalize',
                    fontFamily: 'inherit',
                    background: filter === f ? 'rgba(16,185,129,0.18)' : 'transparent',
                    color: filter === f ? '#6ee7b7' : '#7da095',
                    borderColor: filter === f ? 'rgba(16,185,129,0.3)' : 'rgba(167,243,208,0.16)',
                    transition: 'all 0.15s',
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {filtered.map((report) => {
              const cfg = STATUS_CFG[report.status] ?? STATUS_CFG.pending
              const { Icon } = cfg
              return (
                <div
                  key={report.id}
                  style={{
                    padding: '12px 14px',
                    borderRadius: 10,
                    background: 'rgba(167,243,208,0.04)',
                    border: '1px solid rgba(167,243,208,0.14)',
                    display: 'flex',
                    gap: 12,
                    alignItems: 'flex-start',
                  }}
                >
                  <div style={{ width: 30, height: 30, borderRadius: 8, background: cfg.bg, border: `1px solid ${cfg.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={14} style={{ color: cfg.color }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#eaf5ef' }}>{report.type}</span>
                      <span style={{ fontSize: 9.5, fontWeight: 700, padding: '1px 6px', borderRadius: 4, background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}>{cfg.label}</span>
                      <span style={{ fontSize: 11, color: '#89aaa0', display: 'flex', alignItems: 'center', gap: 3 }}>
                        <MapPin size={9} /> {report.ward}
                      </span>
                      <span style={{ fontSize: 10, color: '#6f9085', marginLeft: 'auto' }}>{timeAgo(report.minsAgo)}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: 11.5, color: '#9cb8ae', lineHeight: 1.5 }}>{report.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={card({ padding: 14 })}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#b7cfc5', marginBottom: 10 }}>Ward Impact</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {wardReportCounts.map((item, idx) => (
                <div key={item.ward} style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  background: 'rgba(167,243,208,0.05)', border: '1px solid rgba(167,243,208,0.14)',
                  borderRadius: 8, padding: '7px 9px',
                }}>
                  <span style={{
                    width: 18, height: 18, borderRadius: 999,
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 9, fontWeight: 800,
                    color: '#cfe1d9', background: 'rgba(148,163,184,0.16)', flexShrink: 0,
                  }}>
                    {idx + 1}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 10.5, fontWeight: 700, color: '#eaf5ef', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.ward}</div>
                    <div style={{ fontSize: 9.5, color: '#7da095' }}>{item.count} reports</div>
                  </div>
                  <ArrowRight size={11} style={{ color: '#6ee7b7' }} />
                </div>
              ))}
            </div>
          </div>

          <div style={card({ padding: 14 })}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#b7cfc5', marginBottom: 8 }}>Escalation Guidance</div>
            <ul style={{ margin: 0, paddingLeft: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <li style={{ fontSize: 10.5, color: '#a6c4b8' }}>Escalate pending industrial smoke reports older than 2 hours.</li>
              <li style={{ fontSize: 10.5, color: '#a6c4b8' }}>Cross-check crop-burning reports with satellite signals.</li>
              <li style={{ fontSize: 10.5, color: '#a6c4b8' }}>Prioritize wards with high AQI and frequent citizen alerts.</li>
            </ul>
          </div>
        </div>
      </div>

      <div style={card({ padding: 16 })}>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#b7cfc5', marginBottom: 10 }}>Incident Register (Full View)</div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11.5 }}>
            <thead>
              <tr>
                {['Type', 'Ward', 'Status', 'Age', 'Description'].map((head) => (
                  <th
                    key={head}
                    style={{
                      textAlign: 'left',
                      padding: '7px 10px',
                      color: '#7da095',
                      fontWeight: 700,
                      fontSize: 10,
                      borderBottom: '1px solid rgba(167,243,208,0.14)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.4px',
                    }}
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => {
                const cfg = STATUS_CFG[r.status] ?? STATUS_CFG.pending
                return (
                  <tr key={r.id} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(167,243,208,0.03)' }}>
                    <td style={{ padding: '8px 10px', color: '#eaf5ef', fontWeight: 600 }}>{r.type}</td>
                    <td style={{ padding: '8px 10px', color: '#a6c4b8' }}>{r.ward}</td>
                    <td style={{ padding: '8px 10px' }}>
                      <span style={{
                        fontSize: 9.5,
                        fontWeight: 700,
                        color: cfg.color,
                        background: cfg.bg,
                        border: `1px solid ${cfg.border}`,
                        borderRadius: 5,
                        padding: '2px 6px',
                      }}>
                        {cfg.label}
                      </span>
                    </td>
                    <td style={{ padding: '8px 10px', color: '#7da095' }}>{timeAgo(r.minsAgo)}</td>
                    <td style={{ padding: '8px 10px', color: '#9cb8ae' }}>{r.description}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
