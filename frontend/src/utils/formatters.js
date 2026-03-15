export const formatAQI = (v) => Math.round(Number(v))

export const formatTime = (date = new Date()) =>
  date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })

export const formatDate = (date = new Date()) =>
  date.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })

export const formatNumber = (n) =>
  n >= 100000 ? `${(n / 100000).toFixed(1)}L` : n >= 1000 ? `${(n / 1000).toFixed(0)}K` : String(n)

export const formatPollutant = (value, unit = 'µg/m³') => `${Number(value).toFixed(1)} ${unit}`
