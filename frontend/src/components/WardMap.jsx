import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAQIStore from '../store/useAQIStore'
import { getAQIColor, getAQILabel, getAQIBorder } from '../utils/aqiColors'

const CELL_W = 114
const CELL_H = 64
const GAP_X  = 8
const GAP_Y  = 10
const PAD    = 6

const SVG_W = 5 * (CELL_W + GAP_X) - GAP_X + PAD * 2
const SVG_H = 6 * (CELL_H + GAP_Y) - GAP_Y + PAD * 2

function cx(col) { return PAD + col * (CELL_W + GAP_X) }
function cy(row) { return PAD + row * (CELL_H + GAP_Y) }

const AQI_SHORT = {
  'Good': 'Good',
  'Moderate': 'Moderate',
  'Unhealthy for Sensitive Groups': 'Sensitive',
  'Unhealthy': 'Unhealthy',
  'Very Unhealthy': 'V.Unhealthy',
  'Hazardous': 'Hazardous',
}

const LEGEND = [
  { label: 'Good',         range: '0–50',    color: '#22c55e' },
  { label: 'Moderate',     range: '51–100',  color: '#eab308' },
  { label: 'Sensitive',    range: '101–150', color: '#f97316' },
  { label: 'Unhealthy',    range: '151–200', color: '#ef4444' },
  { label: 'Very Unhealthy', range: '201–300', color: '#a855f7' },
  { label: 'Hazardous',    range: '301+',    color: '#dc2626' },
]

export default function WardMap() {
  const { wards, activeLayers } = useAQIStore()
  const navigate = useNavigate()
  const [hovered, setHovered] = useState(null)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 10 }}>
      {/* Floating tooltip */}
      {hovered && (
        <div style={{
          position: 'fixed',
          pointerEvents: 'none',
          zIndex: 1000,
          left: hovered.mx + 16,
          top: hovered.my - 12,
          background: 'rgba(5,8,18,0.98)',
          border: `1px solid ${getAQIBorder(hovered.ward.aqi)}`,
          borderRadius: 12,
          padding: '12px 16px',
          minWidth: 200,
          boxShadow: `0 12px 40px rgba(0,0,0,0.6), 0 0 24px ${getAQIColor(hovered.ward.aqi)}1a`,
        }}>
          {/* Ward name */}
          <div style={{ fontSize: 12.5, fontWeight: 700, color: '#f1f5f9', marginBottom: 8 }}>
            {hovered.ward.name}
          </div>

          {/* AQI + Status + Risk row */}
          <div style={{ display: 'flex', gap: 18, marginBottom: 8 }}>
            <div>
              <div style={{ fontSize: 8.5, color: '#475569', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase' }}>AQI</div>
              <div style={{
                fontSize: 26, fontWeight: 900, color: getAQIColor(hovered.ward.aqi),
                lineHeight: 1, textShadow: `0 0 18px ${getAQIColor(hovered.ward.aqi)}60`,
              }}>
                {hovered.ward.aqi}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 8.5, color: '#475569', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase' }}>LEVEL</div>
              <div style={{
                marginTop: 4, fontSize: 10.5, fontWeight: 700,
                color: getAQIColor(hovered.ward.aqi),
                background: `${getAQIColor(hovered.ward.aqi)}18`,
                border: `1px solid ${getAQIColor(hovered.ward.aqi)}30`,
                padding: '2px 8px', borderRadius: 10,
              }}>
                {getAQILabel(hovered.ward.aqi)}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 8.5, color: '#475569', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase' }}>RISK</div>
              <div style={{
                fontSize: 20, fontWeight: 800, lineHeight: 1,
                color: hovered.ward.risk > 75 ? '#ef4444' : hovered.ward.risk > 50 ? '#f97316' : '#22c55e',
                marginTop: 3,
              }}>
                {hovered.ward.risk}
              </div>
            </div>
          </div>

          {/* Pollutants row */}
          <div style={{
            display: 'flex', gap: 14,
            padding: '7px 0', borderTop: '1px solid rgba(148,163,184,0.1)',
            marginBottom: 6,
          }}>
            {[['PM2.5', hovered.ward.pm25], ['PM10', hovered.ward.pm10], ['NO₂', hovered.ward.no2], ['O₃', hovered.ward.o3]].map(([k, v]) => (
              <div key={k}>
                <div style={{ fontSize: 8.5, color: '#475569', fontWeight: 600 }}>{k}</div>
                <div style={{ fontSize: 11, color: '#cbd5e1', fontWeight: 700 }}>{v}</div>
              </div>
            ))}
          </div>

          {/* Source */}
          {activeLayers.includes('sources') && (
            <div style={{
              fontSize: 10, color: '#94a3b8',
              borderTop: '1px solid rgba(148,163,184,0.1)',
              paddingTop: 6, display: 'flex', alignItems: 'center', gap: 5,
            }}>
              <span style={{ fontSize: 9 }}>⚡</span>
              {hovered.ward.source}
            </div>
          )}
          <div style={{ marginTop: 6, fontSize: 9, color: '#3b82f6', fontWeight: 600 }}>
            Click to open ward details →
          </div>
        </div>
      )}

      {/* SVG Map */}
      <div style={{ flex: 1, overflow: 'hidden', borderRadius: 12 }}>
        <svg
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          style={{ width: '100%', height: '100%' }}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="grid" width="22" height="22" patternUnits="userSpaceOnUse">
              <path d="M 22 0 L 0 0 0 22" fill="none" stroke="rgba(148,163,184,0.03)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width={SVG_W} height={SVG_H} fill="url(#grid)" />

          {wards.map((ward) => {
            const x = cx(ward.col)
            const y = cy(ward.row)
            const color = getAQIColor(ward.aqi)
            const short = AQI_SHORT[getAQILabel(ward.aqi)] ?? ''
            const isHovered = hovered?.ward?.id === ward.id
            const isHazardous = ward.aqi > 300

            return (
              <g
                key={ward.id}
                style={{ cursor: 'pointer' }}
                onClick={() => navigate(`/ward/${ward.id}`)}
                onMouseEnter={(e) => setHovered({ ward, mx: e.clientX, my: e.clientY })}
                onMouseLeave={() => setHovered(null)}
                onMouseMove={(e) => setHovered((h) => h ? { ...h, mx: e.clientX, my: e.clientY } : null)}
              >
                {/* Outer glow for hazardous */}
                {isHazardous && (
                  <rect
                    x={x - 3} y={y - 3} width={CELL_W + 6} height={CELL_H + 6} rx={11} ry={11}
                    fill="none" stroke={color} strokeWidth="1"
                    opacity="0.25"
                    style={{ filter: 'blur(4px)' }}
                  />
                )}

                {/* Cell background */}
                <rect
                  x={x} y={y} width={CELL_W} height={CELL_H} rx={9} ry={9}
                  fill={`${color}${isHovered ? '22' : '11'}`}
                  stroke={color}
                  strokeWidth={isHovered ? 1.8 : 0.8}
                  strokeOpacity={isHovered ? 0.85 : 0.45}
                />

                {/* AQI level colored bottom strip */}
                <rect
                  x={x + 2} y={y + CELL_H - 5} width={CELL_W - 4} height={3} rx={2} ry={2}
                  fill={color} opacity={0.55}
                />

                {/* Ward name */}
                <text
                  x={x + CELL_W / 2} y={y + 15}
                  textAnchor="middle" fill="#94a3b8"
                  fontSize={9.5} fontFamily="Inter, sans-serif" fontWeight="600"
                >
                  {ward.name}
                </text>

                {/* AQI value — big and bold */}
                <text
                  x={x + CELL_W / 2} y={y + 37}
                  textAnchor="middle" fill={color}
                  fontSize={18} fontFamily="Inter, sans-serif" fontWeight="900"
                >
                  {ward.aqi}
                </text>

                {/* AQI short label */}
                <text
                  x={x + CELL_W / 2} y={y + 50}
                  textAnchor="middle" fill={color}
                  fontSize={7.5} fontFamily="Inter, sans-serif" fontWeight="600"
                  opacity={0.7}
                >
                  {short}
                </text>

                {/* Source dot (layer toggle) */}
                {activeLayers.includes('sources') && (
                  <circle
                    cx={x + CELL_W - 10} cy={y + 10} r={3.5}
                    fill={
                      ward.source.includes('Vehicle')     ? '#3b82f6' :
                      ward.source.includes('Industrial')  ? '#ef4444' :
                      ward.source.includes('Biomass')     ? '#f97316' : '#eab308'
                    }
                    opacity={0.9}
                  />
                )}

                {/* Trend arrow */}
                <text
                  x={x + 10} y={y + 16}
                  fill={ward.trend === 'up' ? '#ef4444' : ward.trend === 'down' ? '#22c55e' : '#475569'}
                  fontSize={9} fontFamily="Inter, sans-serif" fontWeight="700"
                >
                  {ward.trend === 'up' ? '▲' : ward.trend === 'down' ? '▼' : '▬'}
                </text>
              </g>
            )
          })}

          {/* North indicator */}
          <text x={SVG_W - 18} y={22} textAnchor="middle" fill="#475569" fontSize={10} fontWeight="700">N</text>
          <line x1={SVG_W - 18} y1={26} x2={SVG_W - 18} y2={34} stroke="#475569" strokeWidth={1.5} />
        </svg>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', paddingTop: 4, alignItems: 'center' }}>
        {LEGEND.map(({ label, range, color }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 10, height: 10, borderRadius: 3, background: color, flexShrink: 0 }} />
            <span style={{ fontSize: 10, color: '#475569' }}>{label}</span>
            <span style={{ fontSize: 9, color: '#334155' }}>({range})</span>
          </div>
        ))}
        {activeLayers.includes('sources') && (
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            {[['Vehicles', '#3b82f6'], ['Industrial', '#ef4444'], ['Biomass', '#f97316'], ['Construction', '#eab308']].map(([l, c]) => (
              <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: c }} />
                <span style={{ fontSize: 9.5, color: '#475569' }}>{l}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
