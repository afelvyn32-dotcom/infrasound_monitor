# Infrasound Monitoring System (MERN Stack + Socket.IO + ESP32 Ready)

An end-to-end, full-stack atmospheric acoustic observatory system designed to monitor very low-frequency atmospheric pressure variations ($< 20\text{ Hz}$) and automatically detect infrasound anomalies (seismic tremor coupling, explosive shockwaves, severe weather vortices, and volcanic plumes).

Built with **React (Vite)**, **Node.js/Express**, **MongoDB/Mongoose**, **Socket.IO**, and **Signal Processing Algorithms (STA/LTA)**.

---

## Key Highlights

- **Hardware-Agnostic Ingestion Layer:** The system features a unified telemetry contract (`POST /api/v1/telemetry/submit`). An ESP32 microcontroller with a BMP280/BMP388 pressure transducer and the built-in Virtual Infrasound Simulator feed the exact same ingestion pipeline with **zero changes to the frontend**.
- **Real-Time Waveform Streaming:** Socket.IO pushes 20 Hz acoustic telemetry with sliding-window React buffering, delivering smooth 60 FPS charts without memory degradation.
- **Scientific STA/LTA Anomaly Detector:** Implements the international CTBTO/seismological standard **Short-Term Average / Long-Term Average** energy ratio algorithm to automatically detect and classify acoustic transients.
- **Dual Experience (USER vs ADMIN):**
  - **USER Experience:** Observational dashboard, live waveform telemetry, historical query with brush zoom, event logs, real-time alert feed, reports, and personal notification preferences.
  - **ADMIN Experience:** Operations console, hardware sensor provisioning, user RBAC management, event verification and audit, and an interactive **One-Click Simulator Injector** (trigger synthetic explosions, earthquakes, and storm waves live!).
- **Zero-Setup Database Strategy:** Out-of-the-box support for MongoDB Atlas / local MongoDB, with an automatic embedded in-memory database fallback (`mongodb-memory-server`) pre-seeded with operator accounts and sample historical events.

---

## Pre-Seeded Operator Credentials

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **ADMIN** | `admin@infrasound.org` | `Admin@123` | Full control, station calibration, user management, signal generator |
| **USER** | `user@infrasound.org` | `User@123` | Real-time observation, historical queries, reports, profile settings |

*(Quick demo fill buttons are also available on the Login screen).*

---

## Quick Start Guide

### 1. Install All Dependencies
From the project root:
```bash
npm run install-all
```
*(Or navigate to `server` and `client` and run `npm install` in each).*

### 2. Start the Application
You can run both backend and frontend concurrently:
```bash
npm run dev
```

Or run them individually in separate terminals:
```bash
# Terminal 1: Backend Server (Port 5000)
cd server
npm run dev

# Terminal 2: Frontend Client (Port 5173)
cd client
npm run dev
```

Open your browser at: **`http://localhost:5173`**

---

## Hardware Blueprint: ESP32 + BMP280 / BMP388

The application includes production-ready C++ firmware in [`hardware/esp32_infrasound_firmware.ino`](./hardware/esp32_infrasound_firmware.ino).

### Pin Wiring (I2C)
| ESP32 Pin | Sensor Pin (BMP280 / BMP388) | Description |
| :--- | :--- | :--- |
| **GPIO 21** | **SDA** | I2C Serial Data |
| **GPIO 22** | **SCL** | I2C Serial Clock |
| **3V3** | **VCC** | 3.3V Power Supply |
| **GND** | **GND** | Ground |

### Ingestion Contract (Payload Format)
Both the ESP32 and the Simulator send packets to `POST /api/v1/telemetry/submit`:
```json
{
  "sensorId": "ESP32-INFRA-01",
  "apiKey": "sec_sensor_key_ridge_01",
  "timestamp": 1773388200000,
  "battery": 98,
  "rssi": -58,
  "samples": [
    { "offsetMs": 0, "rawPressure": 1013.25 },
    { "offsetMs": 50, "rawPressure": 1013.30 },
    { "offsetMs": 100, "rawPressure": 1013.45 }
  ]
}
```

---

## Infrasound Science & Algorithm Details (For Project Defense / Viva)

### 1. Diurnal Drift Removal
Standard barometric pressure is approximately $101,325\text{ Pa}$ ($1013.25\text{ hPa}$) with daily thermal fluctuations ($100\text{ Pa/hr}$). Infrasound waves are minute ripples ($\pm 0.1\text{ Pa} - 20\text{ Pa}$) at frequencies between $0.01 - 20\text{ Hz}$.
The backend utilizes an exponential moving average baseline tracker:
$$\text{Baseline}_t = \alpha \cdot \text{Baseline}_{t-1} + (1 - \alpha) \cdot P_{\text{raw}}$$
$$\Delta P_t = P_{\text{raw}} - \text{Baseline}_t$$
This isolates the pure infrasonic perturbation $\Delta P$ in Pascals.

### 2. STA/LTA (Short-Term Average / Long-Term Average) Detection
- **Short-Term Average (STA):** Rolling energy window ($2\text{ seconds}$) sensitive to instantaneous acoustic arrivals.
- **Long-Term Average (LTA):** Rolling energy window ($20\text{ seconds}$) representing ambient background noise.
$$\text{Ratio}_t = \frac{\text{STA}_t}{\text{LTA}_t}$$
When $\text{Ratio}_t \ge 3.5$, an infrasound event is automatically triggered, an `InfrasoundEvent` and `Alert` are persisted to MongoDB, and a real-time notification is broadcast over Socket.IO.

### 3. Classification Heuristics
- **Explosion Shockwave:** Sharp peak amplitude ($> 12\text{ Pa}$), high frequency ($> 3\text{ Hz}$), short duration ($< 8\text{ s}$).
- **Seismic Wave:** Sustained harmonic oscillation ($0.5 - 1.5\text{ Hz}$), duration ($> 10\text{ s}$).
- **Severe Weather Front:** Low-frequency vortex rumble ($0.2 - 0.8\text{ Hz}$), duration ($> 20\text{ s}$).

---

## API Summary Table

| Category | Method | Path | Access |
| :--- | :--- | :--- | :--- |
| **Auth** | `POST` | `/api/v1/auth/register` | Public |
| | `POST` | `/api/v1/auth/login` | Public |
| | `GET` | `/api/v1/auth/me` | Authenticated |
| | `PUT` | `/api/v1/auth/profile` | Authenticated |
| **Sensors** | `GET` | `/api/v1/sensors` | Authenticated |
| | `POST` | `/api/v1/sensors` | **ADMIN** |
| | `PUT` | `/api/v1/sensors/:id` | **ADMIN** |
| | `DELETE`| `/api/v1/sensors/:id` | **ADMIN** |
| **Telemetry**| `POST` | `/api/v1/telemetry/submit` | Sensor Key |
| | `GET` | `/api/v1/telemetry/readings/:sensorId` | Authenticated |
| **Events** | `GET` | `/api/v1/events` | Authenticated |
| | `PUT` | `/api/v1/events/:id/status`| **ADMIN** |
| **Alerts** | `GET` | `/api/v1/alerts` | Authenticated |
| | `PUT` | `/api/v1/alerts/:id/ack`| Authenticated |
| **Reports** | `GET` | `/api/v1/reports` | Authenticated |
| | `POST` | `/api/v1/reports/generate`| Authenticated |
| | `GET` | `/api/v1/reports/export/csv`| Authenticated |
| **Users** | `GET` | `/api/v1/users` | **ADMIN** |
| | `PUT` | `/api/v1/users/:id/role`| **ADMIN** |
| **Settings**| `GET` | `/api/v1/settings` | **ADMIN** |
| | `POST` | `/api/v1/settings/trigger-simulation`| **ADMIN** |

---

## License
MIT Academic & Research License.
