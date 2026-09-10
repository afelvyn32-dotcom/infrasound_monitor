import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGO_URI: process.env.MONGO_URI || '',
  JWT_SECRET: process.env.JWT_SECRET || 'infrasound_secret_jwt_key_fallback',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  SIMULATION_ENABLED: process.env.SIMULATION_ENABLED !== 'false',
  SIMULATION_INTERVAL_MS: Number(process.env.SIMULATION_INTERVAL_MS) || 500
};
