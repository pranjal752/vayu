import { getAQIColor, getAQILabel, getAQIBg, getAQIBorder, getAQILight } from '../utils/aqiColors'

const HEALTH_ADVISORY = {
  'Good':                           'Air quality is satisfactory',
  'Moderate':                       'Acceptable for most people',
  'Unhealthy (Sensitive)':          'Sensitive groups take precaution',
  'Unhealthy':                      'Health effects for general public',
  'Very Unhealthy':                 'Serious health effects — limit outdoor activity',
  'Hazardous':                      '⚠ Emergency conditions — stay indoors',
}

function AQIMeter({ value, color }) {
  const pct = Math.min((value / 500) * 100, 100)
  return (
    <div style={{ position: 'relative', height: 6, borderRadius: 3, marginTop: 12, overflow: 'visible' }}>
      {/* Spectrum background */}
      <div style={{
        position: 'absolute', inset: 0, borderRadius: 3,
        background: 'linear-gradient(to right, #22c55e 0%, #eab308 20%, #f97316 40%, #ef4444 58%, #a855f7 78%, #dc2626 100%)',
        opacity: 0.18,
      }} />
      {/* Color fill */}
      <div style={{
        position: 'absolute', left: 0, top: 0, height: '100%',
        width: `${pct}%`, borderRadius: 3,
        background: `linear-gradient(to right, #22c55e, ${color})`,
        boxShadow: `0 0 4px ${color}28`,
        transition: 'width 0.9s cubic-bezier(0.4,0,0.2,1)',
      }} />
      {/* Needle dot */}
      <div style={{
        position: 'absolute',
        left: `${Math.min(pct, 97)}%`,
        top: '50%',
        transform: 'translate(-50%, -50%)',
        width: 12, height: 12, borderRadius: '50%',
        background: color,
        border: '2px solid #10211c',
        boxShadow: `0 0 5px ${color}45`,
        zIndex: 2,
        transition: 'left 0.9s cubic-bezier(0.4,0,0.2,1)',
      }} />
    </div>
  )
}

export default function AQICard({ title, value, subtitle, icon: Icon, color, trend, trendLabel, large = false }) {
  const isAQI = typeof value === 'number' && title?.toLowerCase().includes('aqi')
  const accentColor = isAQI ? getAQIColor(value) : (color ?? '#3b82f6')
  const accentLight = isAQI ? getAQILight(value) : accentColor
  const aqiBg = isAQI ? getAQIBg(value) : `${accentColor}08`
  const aqiBorder = isAQI ? getAQIBorder(value) : 'rgba(148,163,184,0.18)'
  const aqiLabel = isAQI ? getAQILabel(value) : null
  const healthText = aqiLabel ? HEALTH_ADVISORY[aqiLabel] : null

  const trendColor = trend === 'up' ? '#ef4444' : trend === 'down' ? '#22c55e' : '#64748b'
  const trendArrow = trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'

  return (
    <div
      style={{
        background: isAQI
          ? `linear-gradient(155deg, ${aqiBg} 0%, rgba(19,42,35,0.82) 58%)`
          : `linear-gradient(155deg, ${accentColor}08 0%, rgba(19,42,35,0.72) 58%)`,
        border: `1px solid ${isAQI ? aqiBorder : 'rgba(148,163,184,0.18)'}`,
        borderRadius: 16,
        padding: large ? '22px 24px' : '16px 18px',
        position: 'relative',
        overflow: 'hidden',
        transition: 'transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease',
        cursor: 'default',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)'
        e.currentTarget.style.boxShadow = '0 10px 22px rgba(0,0,0,0.16)'
        e.currentTarget.style.borderColor = `${accentColor}4a`
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = 'none'
        e.currentTarget.style.borderColor = isAQI ? aqiBorder : 'rgba(148,163,184,0.18)'
      }}
    >
      {/* Top AQI status strip */}
      {isAQI && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          height: 3,
          background: `linear-gradient(to right, ${accentColor}, ${accentLight})`,
          opacity: 0.9,
        }} />
      )}

      {/* Radial background glow */}
      <div style={{
        position: 'absolute', top: -30, right: -30,
        width: 110, height: 110, borderRadius: '50%',
        background: `radial-gradient(circle, ${accentColor}12 0%, transparent 72%)`,
        pointerEvents: 'none',
      }} />
      {/* Bottom shimmer line */}
      {isAQI && (
        <div style={{
          position: 'absolute', bottom: 0, left: '15%', right: '15%',
          height: 2,
          background: `linear-gradient(to right, transparent, ${accentColor}65, transparent)`,
          pointerEvents: 'none',
          animation: 'pulseGlow 3s ease-in-out infinite',
        }} />
      )}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <span style={{
          fontSize: 10.5, color: '#64748b', fontWeight: 700,
          letterSpacing: '0.7px', textTransform: 'uppercase',
        }}>
          {title}
        </span>
        {Icon && (
          <div style={{
            width: 32, height: 32, borderRadius: 9,
            background: `${accentColor}16`,
            border: `1px solid ${accentColor}28`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon size={15} style={{ color: accentColor }} strokeWidth={2} />
          </div>
        )}
      </div>

      {/* Value */}
      <div style={{
        fontSize: large ? 42 : 32,
        fontWeight: 900,
        color: accentColor,
        lineHeight: 1,
        marginBottom: 8,
        fontVariantNumeric: 'tabular-nums',
        letterSpacing: '-1.5px',
        textShadow: isAQI ? `0 0 10px ${accentColor}20` : 'none',
        animation: 'countUp 0.35s ease',
      }}>
        {value}
      </div>

      {/* AQI level badge */}
      {isAQI && aqiLabel && (
        <div style={{ marginBottom: 8 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            fontSize: 10, fontWeight: 700, color: accentColor,
            background: `${accentColor}14`, border: `1px solid ${accentColor}30`,
            padding: '3px 9px', borderRadius: 20,
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: '50%',
              background: accentColor, display: 'inline-block',
              boxShadow: `0 0 5px ${accentColor}`,
            }} />
            {aqiLabel.toUpperCase()}
          </span>
        </div>
      )}

      {/* Subtitle + trend row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: 20 }}>
        {subtitle && <span style={{ fontSize: 10.5, color: '#475569' }}>{subtitle}</span>}
        {trend && trendLabel && (
          <span style={{
            fontSize: 10.5, color: trendColor, fontWeight: 700,
            background: `${trendColor}12`, padding: '2px 7px', borderRadius: 5,
            marginLeft: 'auto',
          }}>
            {trendArrow} {trendLabel}
          </span>
        )}
      </div>

      {/* AQI progress meter */}
      {isAQI && <AQIMeter value={value} color={accentColor} />}

      {/* Health advisory text */}
      {isAQI && healthText && (
        <div style={{ marginTop: 9, fontSize: 9.5, color: '#475569', lineHeight: 1.4 }}>
          {healthText}
        </div>
      )}
    </div>
  )
}
