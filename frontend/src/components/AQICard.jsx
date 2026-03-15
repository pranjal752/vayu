import { getAQIColor, getAQIBg, getAQIBorder, getAQILabel } from '../utils/aqiColors'

export default function AQICard({ title, value, subtitle, icon: Icon, color, trend, trendLabel, large = false }) {
  const isAQI = typeof value === 'number' && title?.toLowerCase().includes('aqi')
  const accentColor = isAQI ? getAQIColor(value) : (color ?? '#3b82f6')
  const cardBg = isAQI ? getAQIBg(value) : `${accentColor}0e`
  const cardBorder = isAQI ? getAQIBorder(value) : `${accentColor}28`

  const trendColor = trend === 'up' ? '#ef4444' : trend === 'down' ? '#22c55e' : '#94a3b8'
  const trendIcon = trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'

  return (
    <div style={{
      background: cardBg,
      border: `1px solid ${cardBorder}`,
      borderRadius: 14,
      padding: large ? '20px 22px' : '16px 18px',
      position: 'relative',
      overflow: 'hidden',
      transition: 'border-color 0.2s, box-shadow 0.2s',
    }}
    onMouseEnter={(e) => e.currentTarget.style.boxShadow = `0 0 20px ${accentColor}18`}
    onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
    >
      {/* Background glow */}
      <div style={{
        position: 'absolute', top: -30, right: -30,
        width: 90, height: 90, borderRadius: '50%',
        background: `${accentColor}08`, pointerEvents: 'none',
      }} />

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
        <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
          {title}
        </span>
        {Icon && (
          <div style={{
            width: 30, height: 30, borderRadius: 8,
            background: `${accentColor}18`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon size={14} style={{ color: accentColor }} strokeWidth={2} />
          </div>
        )}
      </div>

      <div style={{
        fontSize: large ? 36 : 28,
        fontWeight: 800,
        color: accentColor,
        lineHeight: 1,
        marginBottom: 6,
        fontVariantNumeric: 'tabular-nums',
        letterSpacing: '-1px',
      }}>
        {value}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {isAQI && (
          <span style={{
            fontSize: 10, fontWeight: 600,
            color: accentColor,
            background: `${accentColor}18`,
            border: `1px solid ${accentColor}30`,
            padding: '2px 7px', borderRadius: 5,
          }}>
            {getAQILabel(value)}
          </span>
        )}
        {subtitle && (
          <span style={{ fontSize: 11, color: '#475569' }}>{subtitle}</span>
        )}
        {trend && trendLabel && (
          <span style={{ fontSize: 11, color: trendColor, fontWeight: 600, marginLeft: 'auto' }}>
            {trendIcon} {trendLabel}
          </span>
        )}
      </div>
    </div>
  )
}
