# mini-iot-backend

NestJS backend for a live IoT data monitor. Polls the [Open-Meteo](https://open-meteo.com/) API every minute for real-time outdoor temperature and humidity data, persists readings to a SQLite database via TypeORM, and exposes them through a REST endpoint for the frontend to consume.

## Data Source

Uses the **Open-Meteo API** (free, no API key required) to simulate an outdoor environmental sensor. Coordinates are hardcoded in `sensor-ingestion.service.ts` and can be changed to any location.

## Tech Stack

- NestJS
- TypeORM + SQLite
- `@nestjs/schedule` for cron-based polling
- `@nestjs/axios` for HTTP requests to Open-Meteo

## Setup

```bash
git clone https://github.com/wajdijeffry/mini-iot-backend.git
cd mini-iot-backend
npm install
```

## Run

```bash
npm run start:dev
```

The server starts on `http://localhost:3000`. On startup, and every minute thereafter, it fetches the latest temperature and humidity from Open-Meteo and saves both as separate rows to a local `db.sqlite` file (auto-created on first run, git-ignored).

## API

### `GET /api/sensor-data`

Returns the most recent reading plus historical logs.

**Query params:**
- `limit` (optional, default 50) — number of historical rows to return

**Example response:**
```json
{
  "latest": {
    "id": 12,
    "sensor_name": "outdoor_temperature",
    "value": 27.3,
    "timestamp": "2026-09-19T06:39:00.000Z"
  },
  "history": [
    { "id": 12, "sensor_name": "outdoor_temperature", "value": 27.3, "timestamp": "..." },
    { "id": 11, "sensor_name": "outdoor_humidity", "value": 62, "timestamp": "..." }
  ]
}
```

## Project Structure

```
src/
├── app.module.ts                       # Root module — TypeORM + Schedule setup
├── main.ts                             # Entry point, CORS enabled for frontend
└── sensor-data/
    ├── sensor-data.entity.ts           # DB table definition
    ├── sensor-ingestion.service.ts     # Cron job — polls Open-Meteo, saves readings
    ├── sensor-data.controller.ts       # GET /api/sensor-data
    └── sensor-data.module.ts           # Wires the above together
```

## Notes

- Polling interval is set to every minute (`CronExpression.EVERY_MINUTE`) for fast demoing. This falls within the task's suggested 1–5 minute range.
- CORS is enabled to allow the Ionic frontend (default `http://localhost:8100`) to call this API during development.
- `synchronize: true` is used for TypeORM in this project for simplicity; not recommended for production use.
