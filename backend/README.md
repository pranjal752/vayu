# Vayu Backend

## Overview

The Vayu Backend is the server-side component of the real-time ward-level air quality monitoring and mitigation platform. It handles data ingestion from various sources, processes air quality metrics, runs machine learning models for pollution source detection and forecasting, and provides APIs for the frontend dashboard and citizen applications.

## Features

### Data Ingestion and Processing
- Real-time data collection from IoT sensors, satellite imagery, and weather APIs
- Data cleaning and feature engineering pipeline
- Storage in cloud database (PostgreSQL/MongoDB)

### Machine Learning Models
- **Pollution Source Detection**: Random Forest, Gradient Boosting, CNN for satellite imagery analysis
- **AQI Forecasting**: LSTM, ARIMA, Gradient Boosting for 6-hour, 24-hour, and 3-day predictions
- **Hotspot Detection**: DBSCAN, K-Means clustering algorithms

### API Services
- RESTful APIs for real-time AQI data
- Admin dashboard endpoints for analytics and recommendations
- Citizen health advisory APIs
- Real-time notifications via WebSockets

### Automated Policy Recommendations
- Rule-based engine suggesting mitigation actions based on detected pollution sources
- Integration with municipal systems for enforcement alerts

## Technology Stack

- **Framework**: Python FastAPI / Flask
- **Machine Learning**: Scikit-learn, TensorFlow, Keras
- **Database**: PostgreSQL / MongoDB
- **Real-time Processing**: Kafka / WebSockets
- **Cloud**: AWS / GCP
- **Data Processing**: Pandas, NumPy
- **API Documentation**: Swagger/OpenAPI

## Installation

### Prerequisites
- Python 3.8+
- pip
- Virtual environment (recommended)

### Setup
1. Clone the repository and navigate to the backend directory:
   ```bash
   cd vayu/backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up environment variables:
   Create a `.env` file with the following variables:
   ```
   DATABASE_URL=your_database_url
   API_KEY=your_api_key
   SECRET_KEY=your_secret_key
   ```

5. Run database migrations (if using SQL database):
   ```bash
   alembic upgrade head
   ```

## Running the Server

### Development
```bash
uvicorn main:app --reload
```

### Production
```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`

## API Documentation

Once the server is running, visit `http://localhost:8000/docs` for interactive API documentation.

### Key Endpoints

#### AQI Data
- `GET /api/aqi/{ward_id}` - Get current AQI for a specific ward
- `GET /api/aqi/history/{ward_id}` - Get historical AQI data
- `GET /api/aqi/forecast/{ward_id}` - Get AQI forecast

#### Pollution Analysis
- `POST /api/analyze/sources` - Analyze pollution sources for given data
- `GET /api/hotspots` - Get current pollution hotspots
- `GET /api/recommendations/{ward_id}` - Get policy recommendations

#### Admin
- `GET /api/admin/dashboard` - Get dashboard data
- `POST /api/admin/alerts` - Send alerts to citizens

#### Citizen
- `GET /api/citizen/advisory/{ward_id}` - Get health advisory
- `POST /api/citizen/subscribe` - Subscribe to notifications

## Database Schema

### Tables/Collections

#### AirQualityData
- ward_id: String
- timestamp: DateTime
- pm25: Float
- pm10: Float
- no2: Float
- so2: Float
- co: Float
- o3: Float
- temperature: Float
- humidity: Float

#### PollutionSources
- ward_id: String
- predicted_source: String
- confidence: Float
- timestamp: DateTime

#### Forecasts
- ward_id: String
- forecast_type: String (6h, 24h, 3d)
- predicted_aqi: Float
- timestamp: DateTime

#### Recommendations
- ward_id: String
- issue: String
- action: String
- priority: String

## Machine Learning Models

### Training Data Requirements
The models require historical air quality data with the following features:
- PM2.5, PM10, NO2, SO2, CO, O3 concentrations
- Temperature, humidity, wind speed
- Traffic density, construction activity indicators
- Satellite-derived biomass burning indices

### Model Training
```bash
python scripts/train_source_detection.py
python scripts/train_forecasting.py
python scripts/train_hotspot_detection.py
```

### Model Evaluation
- Source detection accuracy: Target >85%
- Forecasting accuracy: Target >80%

## Real-time Data Pipeline

1. IoT sensors and APIs push data to ingestion endpoints
2. Data is validated, cleaned, and stored in database
3. ML models process data in real-time
4. Results are cached and served via APIs
5. WebSocket connections push updates to clients

## Security

- JWT-based authentication for admin APIs
- API key authentication for data ingestion
- Role-based access control
- Data encryption in transit and at rest
- Compliance with environmental data privacy standards

## Monitoring and Logging

- Application logs using Python logging
- Performance monitoring with Prometheus/Grafana
- Error tracking with Sentry
- Database query monitoring

## Deployment

### Docker
```bash
docker build -t vayu-backend .
docker run -p 8000:8000 vayu-backend
```

### Cloud Deployment
- AWS: ECS/Fargate or Lambda
- GCP: Cloud Run or App Engine
- CI/CD with GitHub Actions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## Testing

```bash
pytest
```

## License

This project is licensed under the MIT License.

## Contact

For questions or support, please contact the development team.