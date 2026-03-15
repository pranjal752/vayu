import { useNavigate } from 'react-router-dom'
import { Activity, AlertTriangle, Shield, Cpu, TrendingUp, Flame, Wind } from 'lucide-react'
import useAQIStore from '../store/useAQIStore'
import { getAQIColor, getAQILabel, getAQIBg, getAQIBorder } from '../utils/aqiColors'
import AQICard from '../components/AQICard'
import WardMap from '../components/WardMap'
import ForecastChart from '../components/ForecastChart'
import AlertsPanel from '../components/AlertsPanel'
import PollutionSources from '../components/PollutionSources'

const card = (extra = {}) => ({
  background: 'rgba(10,16,30,0.85)',
  border: '1px solid rgba(148,163,184,0.1)',
  borderRadius: 14,
  ...extra,
})

export default function Dashboard() {
  const { wards, alerts, cityAqi, cityForecast, satelliteHotspots } = useAQIStore()
  const navigate = useNavigate()

  const criticalCount = alerts.filter((a) => a.severity === 'critical').length
  const avgRisk = Math.round(wards.reduce((s, w) => s + w.risk, 0) / wards.length)
  const topHotspots = [...wards].sort((a, b) => b.aqi - a.aqi).slice(0, 5)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18, animation: 'fadeSlideIn 0.4s ease' }}>

      {/* ── Stat cards row ─────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        <AQICard
          title="City AQI"
          value={cityAqi}
          subtitle="Ghaziabad avg"
          icon={Wind}
          trend="up" trendLabel="+12 today"
        />
        <AQICard
          title="Active Alerts"
          value={criticalCount}
          subtitle={`${alerts.length} total open`}
          icon={AlertTriangle}
          color="#ef4444"
          trend={criticalCount > 2 ? 'up' : 'stable'}
          trendLabel={criticalCount > 2 ? 'Rising' : 'Stable'}
        />
        <AQICard
          title="City Risk Index"
          value={avgRisk}
          subtitle="Combined risk score"
          icon={Shield}
          color="#a855f7"
          trend="up" trendLabel="+5 pts"
        />
        <AQICard
          title="Sensors Online"
          value={`${wards.length}/25`}
          subtitle="All stations live"
          icon={Cpu}
          color="#22c55e"
          trend="stable" trendLabel="Nominal"
        />
      </div>

      {/* ── Map + Alerts row ────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 14 }}>
        {/* Ward Map */}
        <div style={{ ...card({ padding: 16, minHeight: 420 }) }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0' }}>Ward Intelligence Map</div>
              <div style={{ fontSize: 10.5, color: '#475569', marginTop: 2 }}>Ghaziabad — {wards.length} wards monitored • Click ward to inspect</div>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {[['Very Unhealthy', '#a855f7', 3], ['Unhealthy', '#ef4444', 5], ['Moderate', '#f97316', 8]].map(([label, color, count]) => (
                <span key={label} style={{
                  fontSize: 9.5, padding: '2px 7px', borderRadius: 5,
                  background: `${color}14`, color, border: `1px solid ${color}30`,
                  fontWeight: 600,
                }}>{count} {label}</span>
              ))}
            </div>
          </div>
          <WardMap />
        </div>

        {/* Alerts Panel */}
        <div style={{ ...card({ padding: 16, overflow: 'hidden', display: 'flex', flexDirection: 'column' }) }}>
          <AlertsPanel />
        </div>
      </div>

      {/* ── Forecast + Sources + Top Wards row ────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 240px 260px', gap: 14 }}>

        {/* Forecast */}
        <div style={card({ padding: 16 })}>
          <ForecastChart data={cityForecast} title="72-Hour City AQI Forecast" height={180} />
        </div>

        {/* Pollution Sources */}
        <div style={card({ padding: 16 })}>
          <PollutionSources />
        </div>

        {/* Hotspot wards */}
        <div style={card({ padding: 16 })}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 7 }}>
            <Flame size={13} style={{ color: '#ef4444' }} />
            Top Pollution Hotspots
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            {topHotspots.map((ward, idx) => {
              const color = getAQIColor(ward.aqi)
              return (
                <div
                  key={ward.id}
                  onClick={() => navigate(`/ward/${ward.id}`)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '8px 10px', borderRadius: 8,
                    background: `${color}0c`, border: `1px solid ${color}20`,
                    cursor: 'pointer', transition: 'all 0.15s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = `${color}18`; e.currentTarget.style.borderColor = `${color}40` }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = `${color}0c`; e.currentTarget.style.borderColor = `${color}20` }}
                >
                  <span style={{ fontSize: 10, color: '#475569', width: 14 }}>#{idx + 1}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: '#e2e8f0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {ward.name}
                    </div>
                    <div style={{ fontSize: 9.5, color: '#475569' }}>{ward.source}</div>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 800, color, flexShrink: 0 }}>{ward.aqi}</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── Satellite Hotspots banner ───────────────────────────────── */}
      <div style={{ ...card({ padding: '12px 16px' }) }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <span style={{
            fontSize: 9.5, fontWeight: 700, letterSpacing: '0.5px',
            background: 'rgba(239,68,68,0.1)', color: '#ef4444',
            border: '1px solid rgba(239,68,68,0.25)', padding: '3px 8px', borderRadius: 5,
          }}>🛰 NASA FIRMS</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: '#94a3b8' }}>Satellite Fire Hotspots —</span>
          <div style={{ display: 'flex', gap: 12, flex: 1, flexWrap: 'wrap' }}>
            {satelliteHotspots.map((h) => {
              const color = h.intensity === 'high' ? '#ef4444' : h.intensity === 'medium' ? '#f97316' : '#eab308'
              return (
                <div key={h.id} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: color, flexShrink: 0 }} />
                  <span style={{ fontSize: 11, color: '#94a3b8' }}>{h.name}</span>
                  <span style={{ fontSize: 9.5, color, fontWeight: 600 }}>{h.intensity.toUpperCase()}</span>
                  <span style={{ fontSize: 9.5, color: '#475569' }}>({h.type})</span>
                </div>
              )
            })}
          </div>
          <span style={{ fontSize: 10, color: '#334155' }}>Updated 15 min ago</span>
        </div>
      </div>
    </div>
  )
}
