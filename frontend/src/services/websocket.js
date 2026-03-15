const WS_BASE = (import.meta.env.VITE_API_URL ?? 'http://localhost:8000').replace(/^http/, 'ws')

export const createAQISocket = (onMessage) => {
  const ws = new WebSocket(`${WS_BASE}/ws/aqi`)
  ws.onmessage = (e) => onMessage(JSON.parse(e.data))
  return ws
}

export const createWardSocket = (id, onMessage) => {
  const ws = new WebSocket(`${WS_BASE}/ws/ward/${id}`)
  ws.onmessage = (e) => onMessage(JSON.parse(e.data))
  return ws
}

export const createAlertsSocket = (onMessage) => {
  const ws = new WebSocket(`${WS_BASE}/ws/alerts`)
  ws.onmessage = (e) => onMessage(JSON.parse(e.data))
  return ws
}
