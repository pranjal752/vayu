import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import useAQIStore from '../store/useAQIStore'
import { getAQIColor, getAQILabel } from '../utils/aqiColors'

const card = (extra = {}) => ({
  background: 'rgba(10,16,30,0.85)',
  border: '1px solid rgba(148,163,184,0.1)',
  borderRadius: 14,
  ...extra,
})

const SectionTitle = ({ children }) => (
  <div style={{ fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 14 }}>{children}</div>
)

const AQITooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  const aqi = payload[0]?.value
  return (
    <div style={{
      background: 'rgba(8,13,26,0.97)',
      border: `1px solid ${getAQIColor(aqi)}40`,
      borderRadius: 8, padding: '7px 11px',
    }}>
      <div style={{ fontSize: 9.5, color: '#64748b', marginBottom: 3 }}>{label}</div>
      <div style={{ fontSize: 14, fontWeight: 800, color: getAQIColor(aqi) }}>{aqi} AQI</div>
    </div>
  )
}

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const monthlyData = MONTHS.map((m, i) => ({
  month: m,
  aqi: Math.round(180 + Math.sin((i + 6) * 0.8) * 80 + (i > 8 ? 60 : 0)),
  pm25: Math.round(85 + Math.sin((i + 6) * 0.8) * 35 + (i > 8 ? 28 : 0)),
}))

const HOURS = Array.from({ length: 24 }, (_, h) => {
  const t = `${String(h).padStart(2, '0')}:00`
  const diurnal = Math.sin(h * Math.PI / 12) * 55
  return { hour: t, aqi: Math.round(200 + diurnal + (Math.random() * 20 - 10)) }
})

export default function Analytics() {
  const { wards, cityHistory, sourceBreakdown } = useAQIStore()

  const wardBarData = [...wards]
    .sort((a, b) => b.aqi - a.aqi)
    .slice(0, 12)
    .map((w) => ({ name: w.name.length > 12 ? w.name.slice(0, 12) + '…' : w.name, aqi: w.aqi, color: getAQIColor(w.aqi) }))

  const peakEvents = wards
    .filter((w) => w.aqi > 300)
    .sort((a, b) => b.aqi - a.aqi)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, animation: 'fadeSlideIn 0.4s ease' }}>

      {/* Page heading */}
      <div>
        <h1 style={{ fontSize: 20, fontWeight: 800, color: '#f1f5f9', margin: 0 }}>Analytics</h1>
        <p style={{ fontSize: 11.5, color: '#475569', marginTop: 4 }}>
          Temporal trends, ward comparisons and source analysis for Ghaziabad
        </p>
      </div>

      {/* Summary stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {[
          { label: 'Annual Avg AQI',  value: 248, color: '#a855f7', note: 'Very Unhealthy' },
          { label: 'Worst Month',     value: 'Nov', color: '#ef4444', note: 'AQI avg 342' },
          { label: 'Best Month',      value: 'Jul', color: '#22c55e', note: 'AQI avg 124' },
          { label: 'Hazardous Days',  value: 43,    color: '#ef4444', note: 'This year' },
        ].map(({ label, value, color, note }) => (
          <div key={label} style={card({ padding: '14px 16px' })}>
            <div style={{ fontSize: 10, color: '#64748b', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 8 }}>{label}</div>
            <div style={{ fontSize: 26, fontWeight: 800, color, lineHeight: 1 }}>{value}</div>
            <div style={{ fontSize: 10, color: '#475569', marginTop: 4 }}>{note}</div>
          </div>
        ))}
      </div>

      {/* Last 24h + Monthly trends */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div style={card({ padding: 16 })}>
          <SectionTitle>24-Hour AQI Trend (City-Wide)</SectionTitle>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={cityHistory} margin={{ top: 5, right: 4, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="h24" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#a855f7" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.06)" vertical={false} />
              <XAxis dataKey="time" tick={{ fill: '#475569', fontSize: 9 }} tickLine={false} axisLine={false} interval={5} />
              <YAxis tick={{ fill: '#475569', fontSize: 9 }} tickLine={false} axisLine={false} />
              <Tooltip content={<AQITooltip />} cursor={{ stroke: '#a855f7', strokeOpacity: 0.3, strokeWidth: 1 }} />
              <Area type="monotone" dataKey="aqi" stroke="#a855f7" strokeWidth={2} fill="url(#h24)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div style={card({ padding: 16 })}>
          <SectionTitle>Monthly Average AQI (2025)</SectionTitle>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={monthlyData} margin={{ top: 5, right: 4, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.06)" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: '#475569', fontSize: 9 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: '#475569', fontSize: 9 }} tickLine={false} axisLine={false} />
              <Tooltip content={<AQITooltip />} cursor={{ fill: 'rgba(148,163,184,0.04)' }} />
              <Bar dataKey="aqi" radius={[4, 4, 0, 0]}>
                {monthlyData.map((d) => <Cell key={d.month} fill={getAQIColor(d.aqi)} fillOpacity={0.8} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Ward comparison + Diurnal + Source */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px 220px', gap: 14 }}>
        {/* Ward bar chart */}
        <div style={card({ padding: 16 })}>
          <SectionTitle>Ward-wise AQI Comparison (Top 12)</SectionTitle>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={wardBarData} layout="vertical" margin={{ top: 0, right: 20, bottom: 0, left: 70 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.05)" horizontal={false} />
              <XAxis type="number" tick={{ fill: '#475569', fontSize: 9 }} tickLine={false} axisLine={false} domain={[0, 500]} />
              <YAxis type="category" dataKey="name" tick={{ fill: '#94a3b8', fontSize: 10 }} tickLine={false} axisLine={false} width={68} />
              <Tooltip content={<AQITooltip />} cursor={{ fill: 'rgba(148,163,184,0.04)' }} />
              <Bar dataKey="aqi" radius={[0, 4, 4, 0]}>
                {wardBarData.map((d) => <Cell key={d.name} fill={d.color} fillOpacity={0.8} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Diurnal pattern */}
        <div style={card({ padding: 16 })}>
          <SectionTitle>Diurnal AQI Pattern</SectionTitle>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={HOURS} margin={{ top: 5, right: 4, bottom: 0, left: -22 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.06)" vertical={false} />
              <XAxis dataKey="hour" tick={{ fill: '#475569', fontSize: 8 }} tickLine={false} axisLine={false} interval={5} />
              <YAxis tick={{ fill: '#475569', fontSize: 9 }} tickLine={false} axisLine={false} />
              <Tooltip content={<AQITooltip />} cursor={{ stroke: '#3b82f6', strokeOpacity: 0.3 }} />
              <Line type="monotone" dataKey="aqi" stroke="#3b82f6" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Source breakdown */}
        <div style={card({ padding: 16 })}>
          <SectionTitle>Source Distribution</SectionTitle>
          <ResponsiveContainer width="100%" height={130}>
            <PieChart>
              <Pie data={sourceBreakdown} cx="50%" cy="50%" innerRadius={36} outerRadius={56} paddingAngle={3} dataKey="value">
                {sourceBreakdown.map((e) => <Cell key={e.name} fill={e.color} opacity={0.85} />)}
              </Pie>
              <Tooltip formatter={(v, n) => [`${v}%`, n]} contentStyle={{ background: 'rgba(8,13,26,0.97)', border: '1px solid rgba(148,163,184,0.15)', borderRadius: 8, fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginTop: 8 }}>
            {sourceBreakdown.map(({ name, value, color }) => (
              <div key={name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 8, height: 8, borderRadius: 2, background: color, flexShrink: 0 }} />
                  <span style={{ fontSize: 10.5, color: '#94a3b8' }}>{name}</span>
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, color }}>{value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Peak events table */}
      <div style={card({ padding: 16 })}>
        <SectionTitle>Current Hazardous / Very Unhealthy Zones ({peakEvents.length} wards)</SectionTitle>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr>
                {['Ward','AQI','PM2.5','PM10','NO₂','Source','Risk','Trend'].map((h) => (
                  <th key={h} style={{ textAlign: 'left', padding: '6px 10px', color: '#475569', fontWeight: 600, fontSize: 10, borderBottom: '1px solid rgba(148,163,184,0.08)', letterSpacing: '0.4px', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {peakEvents.map((w, i) => {
                const color = getAQIColor(w.aqi)
                return (
                  <tr key={w.id} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(148,163,184,0.02)' }}>
                    <td style={{ padding: '8px 10px', color: '#e2e8f0', fontWeight: 600 }}>{w.name}</td>
                    <td style={{ padding: '8px 10px', fontWeight: 800, color }}>{w.aqi}</td>
                    <td style={{ padding: '8px 10px', color: '#94a3b8' }}>{w.pm25}</td>
                    <td style={{ padding: '8px 10px', color: '#94a3b8' }}>{w.pm10}</td>
                    <td style={{ padding: '8px 10px', color: '#94a3b8' }}>{w.no2}</td>
                    <td style={{ padding: '8px 10px', color: '#94a3b8' }}>{w.source}</td>
                    <td style={{ padding: '8px 10px', color: w.risk > 75 ? '#ef4444' : '#eab308', fontWeight: 700 }}>{w.risk}</td>
                    <td style={{ padding: '8px 10px', color: w.trend === 'up' ? '#ef4444' : w.trend === 'down' ? '#22c55e' : '#64748b' }}>
                      {w.trend === 'up' ? '▲ Rising' : w.trend === 'down' ? '▼ Falling' : '▬ Stable'}
                    </td>
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
