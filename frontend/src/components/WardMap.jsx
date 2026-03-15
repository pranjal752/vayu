import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAQIStore from '../store/useAQIStore'
import { getAQIColor, getAQILabel, getAQIBg, getAQIBorder } from '../utils/aqiColors'

const CELL_W = 114
const CELL_H = 52
const GAP_X  = 8
const GAP_Y  = 10
const PAD    = 6

const SVG_W = 5 * (CELL_W + GAP_X) - GAP_X + PAD * 2  // 616
const SVG_H = 6 * (CELL_H + GAP_Y) - GAP_Y + PAD * 2  // 368

function cx(col) { return PAD + col * (CELL_W + GAP_X) }
function cy(row) { return PAD + row * (CELL_H + GAP_Y) }

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
          left: hovered.mx + 14,
          top: hovered.my - 10,
          background: 'rgba(8,13,26,0.97)',
          border: `1px solid ${getAQIBorder(hovered.ward.aqi)}`,
          borderRadius: 10,
          padding: '10px 14px',
          minWidth: 180,
          boxShadow: `0 8px 32px rgba(0,0,0,0.5), 0 0 20px ${getAQIColor(hovered.ward.aqi)}18`,
        }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#f1f5f9', marginBottom: 6 }}>
            {hovered.ward.name}
          </div>
          <div style={{ display: 'flex', gap: 16, marginBottom: 6 }}>
            <div>
              <div style={{ fontSize: 9, color: '#64748b', fontWeight: 600 }}>AQI</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: getAQIColor(hovered.ward.aqi), lineHeight: 1 }}>
                {hovered.ward.aqi}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 9, color: '#64748b', fontWeight: 600 }}>STATUS</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: getAQIColor(hovered.ward.aqi) }}>
                {getAQILabel(hovered.ward.aqi)}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 9, color: '#64748b', fontWeight: 600 }}>RISK</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: hovered.ward.risk > 75 ? '#ef4444' : '#eab308', lineHeight: 1 }}>
                {hovered.ward.risk}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ fontSize: 10, color: '#64748b' }}>PM2.5: <span style={{ color: '#e2e8f0' }}>{hovered.ward.pm25}</span></div>
            <div style={{ fontSize: 10, color: '#64748b' }}>PM10: <span style={{ color: '#e2e8f0' }}>{hovered.ward.pm10}</span></div>
          </div>
          {activeLayers.includes('sources') && (
            <div style={{
              marginTop: 7, paddingTop: 7,
              borderTop: '1px solid rgba(148,163,184,0.1)',
              fontSize: 10, color: '#94a3b8',
            }}>
              ⚡ {hovered.ward.source}
            </div>
          )}
          <div style={{ marginTop: 5, fontSize: 9, color: '#3b82f6' }}>Click to open ward details →</div>
        </div>
      )}

      {/* SVG Map */}
      <div style={{ flex: 1, overflow: 'hidden', borderRadius: 12 }}>
        <svg
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          style={{ width: '100%', height: '100%' }}
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Grid lines */}
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(148,163,184,0.04)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width={SVG_W} height={SVG_H} fill="url(#grid)" />

          {/* Ward cells */}
          {wards.map((ward) => {
            const x = cx(ward.col)
            const y = cy(ward.row)
            const color = getAQIColor(ward.aqi)
            const isHovered = hovered?.ward?.id === ward.id

            return (
              <g
                key={ward.id}
                style={{ cursor: 'pointer' }}
                onClick={() => navigate(`/ward/${ward.id}`)}
                onMouseEnter={(e) => setHovered({ ward, mx: e.clientX, my: e.clientY })}
                onMouseLeave={() => setHovered(null)}
                onMouseMove={(e) => setHovered((h) => h ? { ...h, mx: e.clientX, my: e.clientY } : null)}
              >
                {/* Glow for high AQI */}
                {ward.aqi > 300 && (
                  <rect x={x - 2} y={y - 2} width={CELL_W + 4} height={CELL_H + 4} rx={10} ry={10}
                    fill="none" stroke={color} strokeWidth="0.5" opacity="0.3"
                    style={{ filter: 'blur(3px)' }}
                  />
                )}
                {/* Cell background */}
                <rect
                  x={x} y={y} width={CELL_W} height={CELL_H} rx={8} ry={8}
                  fill={`${color}${isHovered ? '28' : '16'}`}
                  stroke={color}
                  strokeWidth={isHovered ? 1.8 : 0.8}
                  strokeOpacity={isHovered ? 0.9 : 0.5}
                />
                {/* Ward name */}
                <text x={x + CELL_W / 2} y={y + 16}
                  textAnchor="middle" fill="#94a3b8"
                  fontSize={9} fontFamily="Inter, sans-serif" fontWeight="500">
                  {ward.name}
                </text>
                {/* AQI value */}
                <text x={x + CELL_W / 2} y={y + 32}
                  textAnchor="middle" fill={color}
                  fontSize={15} fontFamily="Inter, sans-serif" fontWeight="800">
                  {ward.aqi}
                </text>
                {/* Source dot (if layer active) */}
                {activeLayers.includes('sources') && (
                  <circle cx={x + CELL_W - 10} cy={y + 10} r={3}
                    fill={
                      ward.source.includes('Vehicle') ? '#3b82f6' :
                      ward.source.includes('Industrial') ? '#ef4444' :
                      ward.source.includes('Biomass') ? '#f97316' : '#eab308'
                    }
                    opacity={0.85}
                  />
                )}
                {/* Trend arrow */}
                <text x={x + 10} y={y + 14}
                  fill={ward.trend === 'up' ? '#ef4444' : ward.trend === 'down' ? '#22c55e' : '#64748b'}
                  fontSize={8} fontFamily="Inter, sans-serif">
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
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', paddingTop: 4 }}>
        {LEGEND.map(({ label, range, color }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: color, flexShrink: 0, opacity: 0.8 }} />
            <span style={{ fontSize: 10, color: '#475569' }}>{range}</span>
          </div>
        ))}
        {activeLayers.includes('sources') && (
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            {[['Vehicles','#3b82f6'],['Industrial','#ef4444'],['Biomass','#f97316'],['Construction','#eab308']].map(([l, c]) => (
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
