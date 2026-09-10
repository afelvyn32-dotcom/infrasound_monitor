import http from 'http';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { ENV } from './config/env.js';
import { connectDB } from './config/db.js';
import { initSocket } from './config/socket.js';
import { seedInitialData } from './seed.js';
import { errorHandler } from './middleware/errorHandler.js';
import { startSimulator } from './services/simulatorService.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import sensorRoutes from './routes/sensorRoutes.js';
import telemetryRoutes from './routes/telemetryRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import alertRoutes from './routes/alertRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import userRoutes from './routes/userRoutes.js';
import settingRoutes from './routes/settingRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDist = path.resolve(__dirname, '../../client/dist');

const app = express();
const server = http.createServer(app);

// Basic Middlewares
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'Infrasound Monitoring System Backend'
  });
});

// Mount API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/sensors', sensorRoutes);
app.use('/api/v1/telemetry', telemetryRoutes);
app.use('/api/v1/events', eventRoutes);
app.use('/api/v1/alerts', alertRoutes);
app.use('/api/v1/reports', reportRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/settings', settingRoutes);

// Global Error Handler for API
app.use(errorHandler);

// Production Static Client Serving & SPA Fallback
if (fs.existsSync(clientDist)) {
  console.log(`📦 Serving production client build from: ${clientDist}`);
  app.use(express.static(clientDist));

  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/socket.io')) {
      return next();
    }
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

// Bootstrap Server
const startServer = async () => {
  try {
    // 1. Connect DB
    await connectDB();

    // 2. Seed Initial Admin & Stations
    await seedInitialData();

    // 3. Initialize WebSocket Gateway
    initSocket(server, ENV.CLIENT_URL);

    // 4. Start HTTP / WebSocket Server
    server.listen(ENV.PORT, () => {
      console.log(`=======================================================`);
      console.log(`📡 INFRASOUND MONITORING SERVER ONLINE on port ${ENV.PORT}`);
      console.log(`🔗 Web UI & API: http://localhost:${ENV.PORT}`);
      console.log(`🔗 API Base:     http://localhost:${ENV.PORT}/api/v1`);
      console.log(`👥 Pre-seeded credentials:`);
      console.log(`   Admin: admin@infrasound.org / Admin@123`);
      console.log(`   User:  user@infrasound.org  / User@123`);
      console.log(`=======================================================`);

      // 5. Start Simulator if enabled
      if (ENV.SIMULATION_ENABLED) {
        startSimulator();
      }
    });
  } catch (error) {
    console.error('Fatal Server Boot Error:', error);
    process.exit(1);
  }
};

startServer();
