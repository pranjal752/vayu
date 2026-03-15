export const AQI_LEVELS = [
  { min: 0,   max: 50,       label: 'Good',               shortLabel: 'GOOD',    color: '#22c55e', lightColor: '#4ade80', bg: 'rgba(34,197,94,0.12)',   border: 'rgba(34,197,94,0.30)'   },
  { min: 51,  max: 100,      label: 'Moderate',            shortLabel: 'MOD',     color: '#eab308', lightColor: '#fbbf24', bg: 'rgba(234,179,8,0.12)',   border: 'rgba(234,179,8,0.30)'   },
  { min: 101, max: 150,      label: 'Unhealthy (Sensitive)',shortLabel: 'SENS',   color: '#f97316', lightColor: '#fb923c', bg: 'rgba(249,115,22,0.12)',  border: 'rgba(249,115,22,0.30)'  },
  { min: 151, max: 200,      label: 'Unhealthy',           shortLabel: 'UNHLT',   color: '#ef4444', lightColor: '#f87171', bg: 'rgba(239,68,68,0.12)',   border: 'rgba(239,68,68,0.30)'   },
  { min: 201, max: 300,      label: 'Very Unhealthy',      shortLabel: 'V.UNHLT', color: '#a855f7', lightColor: '#c084fc', bg: 'rgba(168,85,247,0.12)',  border: 'rgba(168,85,247,0.30)'  },
  { min: 301, max: Infinity, label: 'Hazardous',           shortLabel: 'HAZ',     color: '#ef4444', lightColor: '#fca5a5', bg: 'rgba(220,38,38,0.15)',   border: 'rgba(220,38,38,0.40)'   },
]

export const getAQILevel  = (aqi) => AQI_LEVELS.find(l => aqi >= l.min && aqi <= l.max) ?? AQI_LEVELS.at(-1)
export const getAQIColor  = (aqi) => getAQILevel(aqi).color
export const getAQILight  = (aqi) => getAQILevel(aqi).lightColor
export const getAQILabel  = (aqi) => getAQILevel(aqi).label
export const getAQIShort  = (aqi) => getAQILevel(aqi).shortLabel
export const getAQIBg     = (aqi) => getAQILevel(aqi).bg
export const getAQIBorder = (aqi) => getAQILevel(aqi).border
