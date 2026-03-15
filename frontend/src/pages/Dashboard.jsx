import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle, Shield, Cpu, Flame, Wind, MapPin, Sparkles, ArrowRight, ShieldAlert } from 'lucide-react'
import useAQIStore from '../store/useAQIStore'
import { getAQIColor, getAQILabel } from '../utils/aqiColors'
import AQICard from '../components/AQICard'
import WardMap from '../components/WardMap'
import ForecastChart from '../components/ForecastChart'
import AlertsPanel from '../components/AlertsPanel'
import PollutionSources from '../components/PollutionSources'

const LEVEL_BANDS = [
  { label: 'Good',          color: '#22c55e', min: 0,   max: 50  },
  { label: 'Moderate',      color: '#eab308', min: 51,  max: 100 },
  { label: 'Sensitive',     color: '#f97316', min: 101, max: 150 },
  { label: 'Unhealthy',     color: '#ef4444', min: 151, max: 200 },
  { label: 'V.Unhealthy',   color: '#a855f7', min: 201, max: 300 },
  { label: 'Hazardous',     color: '#dc2626', min: 301, max: 999 },
]

const card = (extra = {}) => ({
  background: 'rgba(19,42,35,0.74)',
  border: '1px solid rgba(167,243,208,0.14)',
  borderRadius: 16,
  ...extra,
})

export default function Dashboard() {
  const { wards, alerts, cityAqi, cityForecast, satelliteHotspots } = useAQIStore()
  const navigate = useNavigate()
  const featureImage = 'https://imgs.search.brave.com/epcF9zEYDhOCjl_5nOZfP1eBsgajKOQhXaVmVPekL_s/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9taXIt/czMtY2RuLWNmLmJl/aGFuY2UubmV0L3By/b2plY3RzLzQwNC9j/NjgwYjQyMzEyOTIy/OTUuWTNKdmNDd3pN/RFk0TERJME1EQXNO/amdzTUEucG5n'

  const criticalCount = alerts.filter((a) => a.severity === 'critical').length
  const avgRisk = Math.round(wards.reduce((s, w) => s + w.risk, 0) / wards.length)
  const topHotspots = useMemo(() => [...wards].sort((a, b) => b.aqi - a.aqi).slice(0, 5), [wards])

  const wardsByLevel = useMemo(() =>
    LEVEL_BANDS.map((band) => ({
      ...band,
      count: wards.filter((w) => w.aqi >= band.min && w.aqi <= band.max).length,
    })),
    [wards]
  )

  const aqiColor = getAQIColor(cityAqi)
  const hazardousCount = wardsByLevel.find((b) => b.label === 'Hazardous')?.count ?? 0
  const unhealthyCount = wardsByLevel.find((b) => b.label === 'Unhealthy')?.count ?? 0

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'minmax(0, 1fr) minmax(300px, 27%)',
      gap: 14,
      width: '100%',
      alignItems: 'start',
      animation: 'fadeSlideIn 0.4s ease',
    }}>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minWidth: 0 }}>

      {/* ── Stat cards row ─────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(205px, 1fr))', gap: 12 }}>
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

      {/* ── Ward Level Distribution ──────────────────────────────────── */}
      <div style={{
        ...card({ padding: '11px 18px' }),
        background: 'rgba(16,37,31,0.66)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 10.5, fontWeight: 700, color: '#475569', letterSpacing: '0.6px', textTransform: 'uppercase', flexShrink: 0 }}>
            Ward Status
          </span>

          <div style={{ display: 'flex', gap: 7, flex: 1, flexWrap: 'wrap', alignItems: 'center' }}>
            {wardsByLevel.map(({ label, color, count }) => count === 0 ? null : (
              <div key={label} style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: `${color}0e`, border: `1px solid ${color}28`,
                borderRadius: 20, padding: '4px 11px',
                animation: 'slideInRight 0.3s ease',
              }}>
                <span style={{
                  width: 7, height: 7, borderRadius: '50%',
                  background: color, flexShrink: 0,
                  boxShadow: `0 0 8px ${color}`,
                }} />
                <span style={{ fontSize: 13, fontWeight: 800, color, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{count}</span>
                <span style={{ fontSize: 10.5, color: '#64748b' }}>{label}</span>
              </div>
            ))}
          </div>

          {/* AQI spectrum bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            <div style={{
              height: 6, width: 130, borderRadius: 3,
              background: 'linear-gradient(to right, #22c55e 0%, #eab308 20%, #f97316 40%, #ef4444 58%, #a855f7 78%, #dc2626 100%)',
              position: 'relative',
            }}>
              {/* City AQI marker on spectrum */}
              <div style={{
                position: 'absolute',
                left: `${Math.min((cityAqi / 500) * 100, 96)}%`,
                top: '50%', transform: 'translate(-50%, -50%)',
                width: 10, height: 10, borderRadius: '50%',
                background: aqiColor, border: '2px solid #03050d',
                boxShadow: `0 0 8px ${aqiColor}`,
              }} />
            </div>
            <span style={{ fontSize: 9.5, color: '#475569' }}>0 — 500+ AQI</span>
          </div>

          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: `${aqiColor}10`, border: `1px solid ${aqiColor}25`,
            borderRadius: 8, padding: '5px 11px', flexShrink: 0,
          }}>
            <MapPin size={11} style={{ color: aqiColor }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: aqiColor }}>City: {cityAqi}</span>
            <span style={{ fontSize: 10, color: '#64748b' }}>{getAQILabel(cityAqi)}</span>
          </div>
        </div>
      </div>

      {/* ── Map panel ─────────────────────────────────────────── */}
      <div style={{ ...card({ padding: 16, minHeight: 420 }) }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, flexWrap: 'wrap', gap: 10 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0' }}>Ward Intelligence Map</div>
            <div style={{ fontSize: 10.5, color: '#475569', marginTop: 2 }}>
              Ghaziabad — {wards.length} wards monitored · Click any ward to inspect
            </div>
          </div>
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
            {wardsByLevel.filter((b) => b.count > 0 && b.min >= 151).map(({ label, color, count }) => (
              <span key={label} style={{
                fontSize: 9.5, padding: '2px 8px', borderRadius: 6,
                background: `${color}14`, color, border: `1px solid ${color}32`, fontWeight: 700,
              }}>
                {count} {label}
              </span>
            ))}
          </div>
        </div>
        <WardMap />
      </div>

      {/* ── Forecast + Sources row ───────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(230px, 270px)', gap: 14 }}>

        {/* Forecast */}
        <div style={card({ padding: 16 })}>
          <ForecastChart data={cityForecast} title="72-Hour City AQI Forecast" height={180} />
        </div>

        {/* Pollution Sources */}
        <div style={card({ padding: 16 })}>
          <PollutionSources />
        </div>
      </div>

      {/* ── NASA FIRMS Satellite Banner ──────────────────────────────── */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(110,231,183,0.08) 0%, rgba(18,42,35,0.84) 60%)',
        border: '1px solid rgba(167,243,208,0.16)',
        borderRadius: 16, padding: '11px 18px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <span style={{
            fontSize: 9.5, fontWeight: 800, letterSpacing: '0.6px',
            background: 'rgba(239,68,68,0.12)', color: '#ef4444',
            border: '1px solid rgba(239,68,68,0.3)', padding: '3px 9px', borderRadius: 6,
          }}>
            🛰 NASA FIRMS
          </span>
          <span style={{ fontSize: 12, fontWeight: 600, color: '#94a3b8' }}>Active Fire Hotspots —</span>
          <div style={{ display: 'flex', gap: 14, flex: 1, flexWrap: 'wrap', alignItems: 'center' }}>
            {satelliteHotspots.map((h) => {
              const c = h.intensity === 'high' ? '#ef4444' : h.intensity === 'medium' ? '#f97316' : '#eab308'
              return (
                <div key={h.id} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{
                    width: 8, height: 8, borderRadius: '50%', background: c, flexShrink: 0,
                    animation: h.intensity === 'high' ? 'pulseDot 2s infinite' : 'none',
                    boxShadow: `0 0 6px ${c}`,
                  }} />
                  <span style={{ fontSize: 11, color: '#94a3b8' }}>{h.name}</span>
                  <span style={{
                    fontSize: 9.5, color: c, fontWeight: 700,
                    background: `${c}14`, padding: '1px 6px', borderRadius: 4,
                  }}>
                    {h.intensity.toUpperCase()}
                  </span>
                  <span style={{ fontSize: 9.5, color: '#334155' }}>({h.type})</span>
                </div>
              )
            })}
          </div>
          <span style={{
            fontSize: 10, color: '#334155',
            background: 'rgba(148,163,184,0.05)', border: '1px solid rgba(148,163,184,0.08)',
            padding: '2px 8px', borderRadius: 5,
          }}>
            Updated 15 min ago
          </span>
        </div>
      </div>

      {/* ── Atmospheric visual panel ──────────────────────────────── */}
      <div style={card({ padding: 14 })}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#b7cfc5' }}>Atmospheric Context Visual</div>
          <span style={{ fontSize: 9.5, color: '#7da095', fontWeight: 600 }}>Reference image</span>
        </div>
        <div style={{
          borderRadius: 12,
          overflow: 'hidden',
          border: '1px solid rgba(167,243,208,0.18)',
          background: 'rgba(167,243,208,0.05)',
        }}>
          <img
            src={featureImage}
            alt="Cloudy atmospheric air quality visual"
            style={{ display: 'block', width: '100%', height: 'clamp(220px, 30vh, 320px)', objectFit: 'cover', objectPosition: 'center center' }}
            loading="lazy"
          />
        </div>
      </div>

      </div>

      {/* ── Right utility rail ───────────────────────────────────── */}
      <aside style={{ display: 'flex', flexDirection: 'column', gap: 12, position: 'sticky', top: 12, minWidth: 0 }}>
        <div style={card({
          padding: 14,
          background: `linear-gradient(145deg, ${aqiColor}12 0%, rgba(7,12,24,0.9) 68%)`,
          border: `1px solid ${aqiColor}2a`,
        })}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 9 }}>
            <Sparkles size={14} style={{ color: '#60a5fa' }} />
            <div style={{ fontSize: 11.5, fontWeight: 700, color: '#e2e8f0' }}>Action Center</div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 10 }}>
            <div style={{
              border: '1px solid rgba(148,163,184,0.12)', borderRadius: 8, padding: '7px 8px',
              background: 'rgba(148,163,184,0.04)',
            }}>
              <div style={{ fontSize: 9, color: '#475569', textTransform: 'uppercase', fontWeight: 700 }}>Hazardous</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#ef4444' }}>{hazardousCount}</div>
            </div>
            <div style={{
              border: '1px solid rgba(148,163,184,0.12)', borderRadius: 8, padding: '7px 8px',
              background: 'rgba(148,163,184,0.04)',
            }}>
              <div style={{ fontSize: 9, color: '#475569', textTransform: 'uppercase', fontWeight: 700 }}>Unhealthy</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#f97316' }}>{unhealthyCount}</div>
            </div>
          </div>

          {[
            { title: 'Open Deep Analytics', sub: 'View temporal and seasonal trends', color: '#3b82f6', action: () => navigate('/analytics') },
            { title: 'Review Citizen Reports', sub: 'Validate and triage complaints', color: '#22c55e', action: () => navigate('/reports') },
          ].map((item) => (
            <button
              key={item.title}
              onClick={item.action}
              style={{
                width: '100%', textAlign: 'left', cursor: 'pointer',
                border: `1px solid ${item.color}2d`, background: `${item.color}0d`,
                borderRadius: 9, padding: '9px 10px', marginBottom: 7,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#e2e8f0' }}>{item.title}</span>
                <ArrowRight size={12} style={{ color: item.color }} />
              </div>
              <div style={{ fontSize: 9.5, color: '#64748b', marginTop: 2 }}>{item.sub}</div>
            </button>
          ))}
        </div>

        <div style={{ ...card({ padding: 16, overflow: 'hidden', display: 'flex', flexDirection: 'column' }) }}>
          <AlertsPanel />
        </div>

        <div style={card({ padding: 14 })}>
          <div style={{
            fontSize: 12, fontWeight: 700, color: '#94a3b8', marginBottom: 10,
            display: 'flex', alignItems: 'center', gap: 7,
          }}>
            <ShieldAlert size={13} style={{ color: '#ef4444' }} />
            Priority Wards
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            {topHotspots.map((ward, idx) => {
              const color = getAQIColor(ward.aqi)
              const label = getAQILabel(ward.aqi)
              return (
                <button
                  key={ward.id}
                  onClick={() => navigate(`/ward/${ward.id}`)}
                  style={{
                    width: '100%',
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '8px 10px', borderRadius: 9,
                    background: `${color}0c`, border: `1px solid ${color}24`,
                    cursor: 'pointer', textAlign: 'left',
                  }}
                >
                  <span style={{
                    fontSize: 9, fontWeight: 800, color: '#334155',
                    width: 18, height: 18, borderRadius: '50%',
                    background: 'rgba(148,163,184,0.12)',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    {idx + 1}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 10.5, fontWeight: 700, color: '#e2e8f0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {ward.name}
                    </div>
                    <div style={{ fontSize: 9, color: '#64748b' }}>{label} • {ward.aqi} AQI</div>
                  </div>
                  <Flame size={12} style={{ color }} />
                </button>
              )
            })}
          </div>
        </div>
      </aside>

    </div>
  )
}
