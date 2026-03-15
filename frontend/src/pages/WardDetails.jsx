import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, MapPin, Users, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell
} from 'recharts'
import useAQIStore from '../store/useAQIStore'
import { getAQIColor, getAQILabel, getAQIBg, getAQIBorder } from '../utils/aqiColors'
import { formatNumber } from '../utils/formatters'
import ForecastChart from '../components/ForecastChart'

const card = (extra = {}) => ({
  background: 'rgba(10,16,30,0.85)',
  border: '1px solid rgba(148,163,184,0.1)',
  borderRadius: 14,
  ...extra,
})

const POLLUTANTS = [
  { key: 'pm25', label: 'PM2.5', unit: 'µg/m³', safe: 60,  color: '#ef4444' },
  { key: 'pm10', label: 'PM10',  unit: 'µg/m³', safe: 100, color: '#f97316' },
  { key: 'no2',  label: 'NO₂',  unit: 'µg/m³', safe: 80,  color: '#eab308' },
  { key: 'o3',   label: 'O₃',   unit: 'µg/m³', safe: 100, color: '#3b82f6' },
  { key: 'co',   label: 'CO',   unit: 'mg/m³',  safe: 4,   color: '#a855f7' },
]

export default function WardDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getWardById, getWardForecast, getWardHistory, citizenReports } = useAQIStore()

  const ward = getWardById(id)
  const forecast = getWardForecast(id)
  const history  = getWardHistory(id)
  const reports  = citizenReports.filter((r) => r.ward === ward?.name)

  if (!ward) return (
    <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>
      Ward not found.{' '}
      <button onClick={() => navigate('/dashboard')} style={{ color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer' }}>
        Back to Dashboard
      </button>
    </div>
  )

  const color = getAQIColor(ward.aqi)
  const TrendIcon = ward.trend === 'up' ? TrendingUp : ward.trend === 'down' ? TrendingDown : Minus

  const pollutantData = POLLUTANTS.map((p) => ({
    name: p.label,
    value: ward[p.key],
    safe: p.safe,
    color: ward[p.key] > p.safe ? '#ef4444' : '#22c55e',
    unit: p.unit,
  }))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, animation: 'fadeSlideIn 0.35s ease' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <button onClick={() => navigate(-1)} style={{
          width: 34, height: 34, borderRadius: 8, background: 'rgba(148,163,184,0.06)',
          border: '1px solid rgba(148,163,184,0.12)', color: '#94a3b8',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <ArrowLeft size={15} />
        </button>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: '#f1f5f9', margin: 0 }}>{ward.name}</h1>
          <div style={{ fontSize: 11, color: '#475569', marginTop: 2, display: 'flex', gap: 10 }}>
            <span><MapPin size={10} style={{ verticalAlign: 'middle', marginRight: 3 }} />Ghaziabad, Uttar Pradesh</span>
            <span><Users size={10} style={{ verticalAlign: 'middle', marginRight: 3 }} />{formatNumber(ward.pop)} residents</span>
          </div>
        </div>

        {/* AQI badge */}
        <div style={{
          padding: '12px 20px', borderRadius: 12, textAlign: 'center',
          background: getAQIBg(ward.aqi), border: `1px solid ${getAQIBorder(ward.aqi)}`,
        }}>
          <div style={{ fontSize: 32, fontWeight: 900, color, lineHeight: 1, letterSpacing: '-1px' }}>{ward.aqi}</div>
          <div style={{ fontSize: 10, fontWeight: 600, color, marginTop: 3 }}>{getAQILabel(ward.aqi)}</div>
        </div>

        {/* Risk badge */}
        <div style={{
          padding: '12px 18px', borderRadius: 12, textAlign: 'center',
          background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.2)',
        }}>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#a855f7', lineHeight: 1 }}>{ward.risk}</div>
          <div style={{ fontSize: 10, fontWeight: 600, color: '#a855f7', marginTop: 3 }}>Risk Score</div>
        </div>

        {/* Trend */}
        <div style={{
          padding: '12px 16px', borderRadius: 12, textAlign: 'center',
          background: ward.trend === 'up' ? 'rgba(239,68,68,0.1)' : ward.trend === 'down' ? 'rgba(34,197,94,0.1)' : 'rgba(148,163,184,0.06)',
          border: `1px solid ${ward.trend === 'up' ? 'rgba(239,68,68,0.2)' : ward.trend === 'down' ? 'rgba(34,197,94,0.2)' : 'rgba(148,163,184,0.1)'}`,
        }}>
          <TrendIcon size={22} style={{ color: ward.trend === 'up' ? '#ef4444' : ward.trend === 'down' ? '#22c55e' : '#94a3b8' }} />
          <div style={{ fontSize: 10, color: '#64748b', marginTop: 3, textTransform: 'capitalize' }}>{ward.trend}</div>
        </div>
      </div>

      {/* Pollutant cards + Forecast */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10 }}>
        {POLLUTANTS.map((p) => {
          const val = ward[p.key]
          const exceeded = val > p.safe
          return (
            <div key={p.key} style={{
              ...card({ padding: '12px 14px' }),
              borderColor: exceeded ? `${p.color}30` : 'rgba(148,163,184,0.1)',
              background: exceeded ? `${p.color}0c` : 'rgba(10,16,30,0.85)',
            }}>
              <div style={{ fontSize: 10, color: '#475569', fontWeight: 600, marginBottom: 6 }}>{p.label}</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: exceeded ? p.color : '#94a3b8', lineHeight: 1 }}>
                {val}
              </div>
              <div style={{ fontSize: 9.5, color: '#334155', marginTop: 2 }}>{p.unit}</div>
              <div style={{ marginTop: 6, height: 3, background: 'rgba(148,163,184,0.08)', borderRadius: 2 }}>
                <div style={{
                  height: '100%', borderRadius: 2,
                  width: `${Math.min(100, (val / (p.safe * 1.5)) * 100)}%`,
                  background: exceeded ? p.color : '#22c55e',
                }} />
              </div>
              <div style={{ fontSize: 9, color: exceeded ? p.color : '#22c55e', marginTop: 2, fontWeight: 600 }}>
                {exceeded ? '⚠ Exceeds safe' : '✓ Safe'}
              </div>
            </div>
          )
        })}
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div style={card({ padding: 16 })}>
          <ForecastChart data={history}  title="24-Hour AQI History"  height={190} />
        </div>
        <div style={card({ padding: 16 })}>
          <ForecastChart data={forecast} title="72-Hour AQI Forecast" height={190} />
        </div>
      </div>

      {/* Source + Reports */}
      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 14 }}>
        {/* Primary source */}
        <div style={card({ padding: 16 })}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 14 }}>
            ML Source Detection
          </div>
          <div style={{
            padding: '14px', borderRadius: 10,
            background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.2)',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>
              {ward.source.includes('Vehicle') ? '🚗' : ward.source.includes('Industrial') ? '🏭' : ward.source.includes('Biomass') ? '🔥' : '🏗️'}
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9', marginBottom: 4 }}>{ward.source}</div>
            <div style={{ fontSize: 10, color: '#64748b' }}>Primary pollution contributor</div>
            <div style={{ marginTop: 12, fontSize: 11, color: '#94a3b8', background: 'rgba(148,163,184,0.05)', borderRadius: 7, padding: '7px 10px', lineHeight: 1.5 }}>
              XGBoost model confidence: <span style={{ color: '#3b82f6', fontWeight: 600 }}>87%</span>
            </div>
          </div>
        </div>

        {/* Citizen reports */}
        <div style={card({ padding: 16 })}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 12 }}>
            Citizen Reports ({reports.length})
          </div>
          {reports.length === 0 ? (
            <div style={{ color: '#475569', fontSize: 12, padding: '16px 0' }}>No reports for this ward.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {reports.map((r) => (
                <div key={r.id} style={{
                  padding: '10px 12px', borderRadius: 8,
                  background: 'rgba(148,163,184,0.04)',
                  border: '1px solid rgba(148,163,184,0.08)',
                  display: 'flex', gap: 12, alignItems: 'flex-start',
                }}>
                  <span style={{
                    fontSize: 9.5, fontWeight: 700, padding: '2px 7px', borderRadius: 5, flexShrink: 0, marginTop: 1,
                    background: r.status === 'verified' ? 'rgba(34,197,94,0.1)' : r.status === 'resolved' ? 'rgba(59,130,246,0.1)' : 'rgba(234,179,8,0.1)',
                    color: r.status === 'verified' ? '#22c55e' : r.status === 'resolved' ? '#3b82f6' : '#eab308',
                    border: `1px solid ${r.status === 'verified' ? 'rgba(34,197,94,0.2)' : r.status === 'resolved' ? 'rgba(59,130,246,0.2)' : 'rgba(234,179,8,0.2)'}`,
                  }}>{r.status}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: '#e2e8f0', marginBottom: 2 }}>{r.type}</div>
                    <p style={{ fontSize: 11, color: '#64748b', margin: 0, lineHeight: 1.45 }}>{r.description}</p>
                  </div>
                  <span style={{ fontSize: 10, color: '#334155', flexShrink: 0 }}>
                    {r.minsAgo < 60 ? `${r.minsAgo}m ago` : `${Math.floor(r.minsAgo / 60)}h ago`}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
