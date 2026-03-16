import {
  AreaChart, Area, CartesianGrid,
  XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine
} from 'recharts'
import { getAQIColor, getAQILabel } from '../utils/aqiColors'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  const aqi = payload[0]?.value
  return (
    <div style={{
      background: 'rgba(8,13,26,0.97)',
      border: `1px solid ${getAQIColor(aqi)}40`,
      borderRadius: 8, padding: '8px 12px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
    }}>
      <div style={{ fontSize: 10, color: '#64748b', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 15, fontWeight: 800, color: getAQIColor(aqi) }}>{aqi} AQI</div>
      <div style={{ fontSize: 10, color: getAQIColor(aqi), opacity: 0.8 }}>{getAQILabel(aqi)}</div>
      {payload[1] && (
        <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 2 }}>PM2.5: {payload[1].value}</div>
      )}
    </div>
  )
}

export default function ForecastChart({ data = [], title = '72-Hour AQI Forecast', height = 200 }) {
  if (!data.length) return null

  const currentAQI = data[0]?.aqi ?? 0
  const mainColor = getAQIColor(currentAQI)
  const splitIdx = data.findIndex((d) => d.forecast)
  const splitLabel = splitIdx > 0 ? data[splitIdx]?.hour : null

  return (
    <div>
      <div style={{ marginBottom: 10, display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: '#94a3b8' }}>{title}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginLeft: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 20, height: 2, background: mainColor, display: 'inline-block', borderRadius: 1 }} />
            <span style={{ fontSize: 10, color: '#475569' }}>Actual</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 20, height: 2, background: mainColor, display: 'inline-block', borderRadius: 1, opacity: 0.5, borderTop: '2px dashed' }} />
            <span style={{ fontSize: 10, color: '#475569' }}>Forecast</span>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data} margin={{ top: 5, right: 4, bottom: 0, left: -20 }}>
          <defs>
            <linearGradient id="aqiGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor={mainColor} stopOpacity={0.25} />
              <stop offset="95%" stopColor={mainColor} stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="pm25Grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#64748b" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#64748b" stopOpacity={0.01} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.06)" vertical={false} />
          <XAxis
            dataKey="hour"
            tick={{ fill: '#475569', fontSize: 9.5 }}
            tickLine={false} axisLine={false}
            interval={4}
          />
          <YAxis
            tick={{ fill: '#475569', fontSize: 9.5 }}
            tickLine={false} axisLine={false}
            domain={['auto', 'auto']}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: mainColor, strokeOpacity: 0.3, strokeWidth: 1 }} />
          {splitLabel && (
            <ReferenceLine x={splitLabel} stroke="#334155" strokeDasharray="4 2" label={{ value: 'Forecast', fill: '#475569', fontSize: 9 }} />
          )}
          {/* AQI threshold lines */}
          {[50, 100, 150, 200, 300].map((v) => (
            <ReferenceLine key={v} y={v} stroke="rgba(148,163,184,0.07)" strokeDasharray="3 3" />
          ))}
          <Area type="monotone" dataKey="pm25" stroke="#64748b" strokeWidth={1} fill="url(#pm25Grad)" dot={false} />
          <Area type="monotone" dataKey="aqi" stroke={mainColor} strokeWidth={2} fill="url(#aqiGrad)" dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
