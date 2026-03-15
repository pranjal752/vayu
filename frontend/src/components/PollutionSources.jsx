import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import useAQIStore from '../store/useAQIStore'

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  const { name, value, color } = payload[0].payload
  return (
    <div style={{
      background: 'rgba(8,13,26,0.97)',
      border: `1px solid ${color}40`,
      borderRadius: 8, padding: '8px 12px',
    }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: '#f1f5f9' }}>{name}</div>
      <div style={{ fontSize: 16, fontWeight: 800, color }}>{value}%</div>
    </div>
  )
}

const SOURCE_ICONS = {
  'Vehicle Emissions': '🚗',
  'Industrial':        '🏭',
  'Biomass Burning':   '🔥',
  'Construction Dust': '🏗️',
}

export default function PollutionSources() {
  const { sourceBreakdown } = useAQIStore()

  return (
    <div>
      <div style={{ marginBottom: 12, fontSize: 12, fontWeight: 600, color: '#94a3b8' }}>
        Pollution Source Detection
      </div>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        {/* Donut chart */}
        <div style={{ width: 120, height: 120, flexShrink: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={sourceBreakdown}
                cx="50%" cy="50%"
                innerRadius={32} outerRadius={52}
                paddingAngle={3}
                dataKey="value"
              >
                {sourceBreakdown.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} opacity={0.85} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Source list */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {sourceBreakdown.map(({ name, value, color }) => (
            <div key={name}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                <span style={{ fontSize: 11, color: '#94a3b8', display: 'flex', gap: 5, alignItems: 'center' }}>
                  <span>{SOURCE_ICONS[name] ?? '•'}</span> {name}
                </span>
                <span style={{ fontSize: 11, fontWeight: 700, color }}>{value}%</span>
              </div>
              <div style={{ height: 4, background: 'rgba(148,163,184,0.1)', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{
                  height: '100%', width: `${value}%`,
                  background: color,
                  borderRadius: 2,
                  transition: 'width 0.6s ease',
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
