# VAYU Backend

## Quickstart

```bash
# 1 — Install
pip install -r requirements.txt

# 2 — Configure
cp .env.example .env
# (edit .env with your API keys — all optional, works without them)

# 3 — Run
uvicorn main:app --reload --port 8000

# 4 — Test
open http://localhost:8000/docs
```

## File Structure

```
backend/
├── main.py          # FastAPI app + all routes
├── database.py      # SQLAlchemy models (PostgreSQL)
├── schemas.py       # Pydantic request/response models
├── ml_engine.py     # Source detection, forecasting, simulation, health advisory
├── chatbot.py       # Claude AI chatbot service
├── seed_data.py     # 15 Ghaziabad ward seed dataset
├── requirements.txt
└── .env.example
```

## All API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/wards` | All wards + live AQI (heatmap) |
| GET | `/api/ward/{id}` | Full sensor reading |
| GET | `/api/ward/{id}/history` | Historical AQI (charts) |
| GET | `/api/ward/{id}/sources` | ML source attribution |
| GET | `/api/ward/{id}/forecast` | 6h/24h/3d forecast |
| GET | `/api/ward/{id}/health` | Health advisory |
| GET | `/api/ward/{id}/policy` | Policy recommendations |
| GET | `/api/admin/policies` | All ward policies |
| POST | `/api/simulate` | Mitigation simulation |
| POST | `/api/reports` | Submit citizen report |
| GET | `/api/reports` | List reports + hotspots |
| PATCH | `/api/reports/{id}/verify` | Verify report |
| GET | `/api/hotspots` | DBSCAN hotspot clusters |
| GET | `/api/city/summary` | City dashboard summary |
| GET | `/api/alerts` | Active alerts |
| POST | `/api/chat` | AI chatbot |
| GET | `/api/external/openaq/{id}` | OpenAQ live data |
| GET | `/api/external/weather` | Weather data |
| GET | `/api/external/nasa-firms` | Satellite fire data |
| GET | `/health` | System health check |

## Connect Frontend

```js
const API = "http://localhost:8000"
const wards = await fetch(`${API}/api/wards`).then(r => r.json())
```
