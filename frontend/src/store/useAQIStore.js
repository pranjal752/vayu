import { create } from 'zustand'

// ─── Ward grid layout (col 0-4, row 0-5) on a 5×6 grid ─────────────────────
const WARDS = [
  { id:  1, name: 'Loni',             aqi: 389, pm25: 187, pm10: 298, no2: 78,  o3: 45, co: 2.3, temp: 28, humidity: 62, risk: 92, source: 'Biomass Burning',   pop: 185000, trend: 'up',     col: 1, row: 0 },
  { id:  2, name: 'Bhopura',          aqi: 315, pm25: 142, pm10: 235, no2: 89,  o3: 38, co: 1.8, temp: 29, humidity: 58, risk: 84, source: 'Industrial',        pop:  98000, trend: 'stable', col: 3, row: 0 },
  { id:  3, name: 'Brick Kiln Zone',  aqi: 412, pm25: 210, pm10: 345, no2: 56,  o3: 29, co: 3.4, temp: 31, humidity: 45, risk: 97, source: 'Industrial (Kilns)',pop:  45000, trend: 'up',     col: 0, row: 1 },
  { id:  4, name: 'Arthala',          aqi: 298, pm25: 135, pm10: 212, no2: 72,  o3: 42, co: 1.6, temp: 29, humidity: 60, risk: 80, source: 'Biomass Burning',   pop: 120000, trend: 'up',     col: 1, row: 1 },
  { id:  5, name: 'GT Road Corridor', aqi: 325, pm25: 148, pm10: 256, no2: 112, o3: 67, co: 2.1, temp: 30, humidity: 55, risk: 87, source: 'Vehicle Emissions', pop: 210000, trend: 'stable', col: 2, row: 1 },
  { id:  6, name: 'Sahibabad Indl',   aqi: 342, pm25: 165, pm10: 278, no2: 134, o3: 52, co: 2.8, temp: 32, humidity: 48, risk: 91, source: 'Industrial',        pop: 175000, trend: 'up',     col: 3, row: 1 },
  { id:  7, name: 'Govindpuram',      aqi: 267, pm25: 118, pm10: 198, no2: 68,  o3: 48, co: 1.4, temp: 28, humidity: 63, risk: 74, source: 'Construction Dust', pop: 145000, trend: 'down',   col: 0, row: 2 },
  { id:  8, name: 'Vijay Nagar',      aqi: 287, pm25: 128, pm10: 215, no2: 95,  o3: 54, co: 1.9, temp: 29, humidity: 59, risk: 78, source: 'Vehicle Emissions', pop: 195000, trend: 'stable', col: 1, row: 2 },
  { id:  9, name: 'Central GZB',      aqi: 245, pm25: 108, pm10: 184, no2: 87,  o3: 61, co: 1.7, temp: 30, humidity: 56, risk: 70, source: 'Vehicle Emissions', pop: 220000, trend: 'down',   col: 2, row: 2 },
  { id: 10, name: 'Nehru Nagar',      aqi: 230, pm25: 102, pm10: 172, no2: 78,  o3: 55, co: 1.5, temp: 29, humidity: 61, risk: 65, source: 'Construction Dust', pop: 135000, trend: 'down',   col: 3, row: 2 },
  { id: 11, name: 'Sanjay Nagar',     aqi: 195, pm25:  87, pm10: 145, no2: 65,  o3: 49, co: 1.2, temp: 28, humidity: 64, risk: 58, source: 'Vehicle Emissions', pop:  98000, trend: 'stable', col: 4, row: 2 },
  { id: 12, name: 'Pasaunda',         aqi: 334, pm25: 152, pm10: 264, no2: 48,  o3: 35, co: 2.2, temp: 31, humidity: 52, risk: 88, source: 'Industrial',        pop:  65000, trend: 'up',     col: 0, row: 3 },
  { id: 13, name: 'Modinagar',        aqi: 156, pm25:  68, pm10: 112, no2: 45,  o3: 38, co: 0.9, temp: 27, humidity: 67, risk: 44, source: 'Construction Dust', pop: 124000, trend: 'stable', col: 1, row: 3 },
  { id: 14, name: 'Raj Nagar',        aqi: 178, pm25:  79, pm10: 135, no2: 62,  o3: 44, co: 1.1, temp: 28, humidity: 65, risk: 52, source: 'Vehicle Emissions', pop: 156000, trend: 'down',   col: 2, row: 3 },
  { id: 15, name: 'Pratap Vihar',     aqi: 212, pm25:  94, pm10: 158, no2: 71,  o3: 50, co: 1.3, temp: 29, humidity: 62, risk: 60, source: 'Vehicle Emissions', pop: 112000, trend: 'stable', col: 3, row: 3 },
  { id: 16, name: 'Vasundhara',       aqi: 187, pm25:  83, pm10: 143, no2: 58,  o3: 46, co: 1.0, temp: 28, humidity: 66, risk: 54, source: 'Construction Dust', pop: 245000, trend: 'down',   col: 4, row: 3 },
  { id: 17, name: 'Makanpur',         aqi: 276, pm25: 122, pm10: 204, no2: 74,  o3: 47, co: 1.6, temp: 30, humidity: 58, risk: 76, source: 'Biomass Burning',   pop:  78000, trend: 'up',     col: 0, row: 4 },
  { id: 18, name: 'Raj Nagar Ext.',   aqi: 167, pm25:  74, pm10: 124, no2: 54,  o3: 41, co: 1.0, temp: 28, humidity: 65, risk: 48, source: 'Construction Dust', pop: 185000, trend: 'stable', col: 1, row: 4 },
  { id: 19, name: 'Muradnagar',       aqi: 178, pm25:  79, pm10: 132, no2: 59,  o3: 43, co: 1.1, temp: 27, humidity: 68, risk: 52, source: 'Construction Dust', pop: 142000, trend: 'down',   col: 2, row: 4 },
  { id: 20, name: 'Kaushambi',        aqi: 210, pm25:  93, pm10: 155, no2: 78,  o3: 56, co: 1.3, temp: 29, humidity: 63, risk: 60, source: 'Vehicle Emissions', pop: 168000, trend: 'stable', col: 3, row: 4 },
  { id: 21, name: 'Indirapuram',      aqi: 198, pm25:  88, pm10: 148, no2: 72,  o3: 53, co: 1.2, temp: 28, humidity: 64, risk: 57, source: 'Vehicle Emissions', pop: 312000, trend: 'down',   col: 4, row: 4 },
  { id: 22, name: 'Vaishali Sec 4',   aqi: 165, pm25:  73, pm10: 122, no2: 58,  o3: 44, co: 0.9, temp: 27, humidity: 66, risk: 46, source: 'Vehicle Emissions', pop: 225000, trend: 'down',   col: 1, row: 5 },
  { id: 23, name: 'Wave City',        aqi: 189, pm25:  84, pm10: 141, no2: 62,  o3: 47, co: 1.1, temp: 29, humidity: 62, risk: 54, source: 'Construction Dust', pop:  95000, trend: 'stable', col: 2, row: 5 },
  { id: 24, name: 'Dasna',            aqi: 155, pm25:  68, pm10: 114, no2: 49,  o3: 40, co: 0.8, temp: 27, humidity: 69, risk: 43, source: 'Construction Dust', pop:  88000, trend: 'down',   col: 3, row: 5 },
  { id: 25, name: 'Crossings Repblk', aqi: 143, pm25:  63, pm10: 105, no2: 44,  o3: 38, co: 0.7, temp: 27, humidity: 70, risk: 40, source: 'Vehicle Emissions', pop: 210000, trend: 'down',   col: 4, row: 5 },
]

const ALERTS = [
  { id: 1, severity: 'critical', ward: 'Brick Kiln Zone',  message: 'AQI exceeded 400 — Hazardous levels detected. Immediate action required.',     minsAgo: 8  },
  { id: 2, severity: 'critical', ward: 'Loni',             message: 'PM2.5 spike — possible large-scale crop/biomass burning detected via satellite.', minsAgo: 22 },
  { id: 3, severity: 'high',     ward: 'Sahibabad Indl',   message: 'Industrial NO2 surge — emissions at 2.1× permissible threshold.',               minsAgo: 45 },
  { id: 4, severity: 'high',     ward: 'Pasaunda',         message: 'Rising AQI trend — ML forecast predicts 380+ in next 6 hours.',                 minsAgo: 67 },
  { id: 5, severity: 'medium',   ward: 'GT Road Corridor', message: 'Morning rush-hour vehicle pollution spike detected.',                            minsAgo: 112},
  { id: 6, severity: 'medium',   ward: 'Govindpuram',      message: 'Construction dust elevated — 3 new active sites without barriers.',              minsAgo: 145},
  { id: 7, severity: 'info',     ward: 'Indirapuram',      message: 'AQI improving — wind direction shift aiding pollutant dispersion.',              minsAgo: 180},
]

const CITIZEN_REPORTS = [
  { id: 1, ward: 'Loni',           type: 'Crop Burning',     description: 'Large fire near agricultural fields on Loni bypass road, black smoke visible.', minsAgo: 120, status: 'verified'  },
  { id: 2, ward: 'Brick Kiln Zone',type: 'Industrial Smoke', description: 'Continuous thick black smoke from brick kiln near NH-9 overpass since morning.', minsAgo: 240, status: 'verified'  },
  { id: 3, ward: 'Sahibabad Indl', type: 'Industrial Smoke', description: 'Grey smoke emission from large factory near GIP Mall area.',                       minsAgo: 360, status: 'pending'   },
  { id: 4, ward: 'Govindpuram',    type: 'Garbage Burning',  description: 'Municipal waste pile burning near the weekly market area.',                        minsAgo: 480, status: 'pending'   },
  { id: 5, ward: 'GT Road',        type: 'Construction Dust',description: 'Uncovered construction site on main road without water sprinklers.',               minsAgo: 600, status: 'resolved'  },
]

const SATELLITE_HOTSPOTS = [
  { id: 1, name: 'Loni Farms',       lat: 28.7510, lng: 77.3882, intensity: 'high',   type: 'Crop Burning'  },
  { id: 2, name: 'Bhopura Fields',   lat: 28.7190, lng: 77.4450, intensity: 'medium', type: 'Crop Burning'  },
  { id: 3, name: 'Dasna Industrial', lat: 28.6734, lng: 77.5124, intensity: 'high',   type: 'Industrial'    },
  { id: 4, name: 'NH-9 Corridor',    lat: 28.6839, lng: 77.4289, intensity: 'low',    type: 'Vehicle Smoke' },
]

// ─── Data generators ─────────────────────────────────────────────────────────
const seededRand = (seed) => {
  let s = seed
  return () => { s = (s * 9301 + 49297) % 233280; return s / 233280 }
}

export const generateForecast = (baseAqi, seed = 42) => {
  const rand = seededRand(seed + baseAqi)
  const pts = []
  let cur = baseAqi
  for (let h = 0; h <= 72; h += 3) {
    const noise = (rand() - 0.49) * 28
    const diurnal = Math.sin((h % 24) * Math.PI / 12) * 18
    cur = Math.max(60, Math.min(520, cur + noise + diurnal * 0.3))
    pts.push({
      hour: h === 0 ? 'Now' : `+${h}h`,
      aqi: Math.round(cur),
      pm25: Math.round(cur * 0.46),
      forecast: h > 0,
    })
  }
  return pts
}

export const generateHistory = (baseAqi, seed = 7) => {
  const rand = seededRand(seed + baseAqi)
  return Array.from({ length: 24 }, (_, i) => {
    const h = 23 - i
    const t = new Date()
    t.setHours(t.getHours() - h, 0, 0, 0)
    const diurnal = Math.sin(h * Math.PI / 12) * 35
    const noise = (rand() - 0.5) * 22
    const aqi = Math.round(Math.max(60, baseAqi + diurnal + noise))
    return {
      time: t.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false }),
      aqi,
      pm25: Math.round(aqi * 0.46),
    }
  })
}

const cityAqi = Math.round(WARDS.reduce((s, w) => s + w.aqi, 0) / WARDS.length)

const sourceBreakdown = [
  { name: 'Vehicle Emissions', value: 34, color: '#3b82f6' },
  { name: 'Industrial',        value: 28, color: '#ef4444' },
  { name: 'Biomass Burning',   value: 22, color: '#f97316' },
  { name: 'Construction Dust', value: 16, color: '#eab308' },
]

const useAQIStore = create((set, get) => ({
  wards: WARDS,
  alerts: ALERTS,
  citizenReports: CITIZEN_REPORTS,
  satelliteHotspots: SATELLITE_HOTSPOTS,
  sourceBreakdown,
  cityAqi,
  cityForecast: generateForecast(cityAqi, 10),
  cityHistory: generateHistory(cityAqi, 5),
  selectedWard: null,
  activeRole: 'admin',
  activeLayers: ['aqi', 'sources'],

  selectWard: (ward) => set({ selectedWard: ward }),
  clearSelection: () => set({ selectedWard: null }),
  setRole: (role) => set({ activeRole: role }),
  toggleLayer: (layer) => set((state) => ({
    activeLayers: state.activeLayers.includes(layer)
      ? state.activeLayers.filter((l) => l !== layer)
      : [...state.activeLayers, layer],
  })),
  dismissAlert: (id) => set((state) => ({ alerts: state.alerts.filter((a) => a.id !== id) })),
  submitReport: (report) => set((state) => ({
    citizenReports: [{ ...report, id: Date.now(), minsAgo: 0, status: 'pending' }, ...state.citizenReports],
  })),
  getWardById: (id) => get().wards.find((w) => w.id === Number(id)),
  getWardForecast: (id) => { const w = get().wards.find((w) => w.id === Number(id)); return w ? generateForecast(w.aqi, w.id * 3) : [] },
  getWardHistory:  (id) => { const w = get().wards.find((w) => w.id === Number(id)); return w ? generateHistory(w.aqi,  w.id * 7) : [] },
}))

export default useAQIStore
