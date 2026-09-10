import User from './models/User.js';
import Sensor from './models/Sensor.js';
import InfrasoundEvent from './models/InfrasoundEvent.js';
import Alert from './models/Alert.js';

export const seedInitialData = async () => {
  try {
    // 1. Seed Admin & Standard User
    const adminEmail = 'admin@infrasound.org';
    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      admin = await User.create({
        name: 'Chief Scientist (Admin)',
        email: adminEmail,
        password: 'Admin@123',
        role: 'ADMIN',
        organization: 'Atmospheric Acoustics Central HQ',
        notificationSettings: {
          emailAlerts: true,
          browserSound: true,
          minSeverity: 'LOW'
        }
      });
      console.log(`[Seed] Created Admin User: ${adminEmail} (Password: Admin@123)`);
    }

    const userEmail = 'user@infrasound.org';
    let user = await User.findOne({ email: userEmail });
    if (!user) {
      user = await User.create({
        name: 'Field Analyst (User)',
        email: userEmail,
        password: 'User@123',
        role: 'USER',
        organization: 'Regional Observatory Partner',
        notificationSettings: {
          emailAlerts: true,
          browserSound: true,
          minSeverity: 'MEDIUM'
        }
      });
      console.log(`[Seed] Created Standard User: ${userEmail} (Password: User@123)`);
    }

    // 2. Seed Default Sensors
    const s1 = await Sensor.findOne({ sensorId: 'ESP32-INFRA-01' });
    if (!s1) {
      await Sensor.create({
        sensorId: 'ESP32-INFRA-01',
        name: 'Ridge Observatory Station (ESP32-01)',
        location: { name: 'North Ridge Crest', latitude: 37.7749, longitude: -122.4194, elevationMeters: 450 },
        status: 'SIMULATED',
        apiKey: 'sec_sensor_key_ridge_01',
        samplingRateHz: 20,
        thresholds: {
          staWindowSec: 2,
          ltaWindowSec: 20,
          triggerRatio: 3.5,
          detriggerRatio: 1.5,
          maxPressurePa: 15.0
        }
      });
      console.log('[Seed] Seeded Sensor: ESP32-INFRA-01');
    }

    const s2 = await Sensor.findOne({ sensorId: 'ESP32-INFRA-02' });
    if (!s2) {
      await Sensor.create({
        sensorId: 'ESP32-INFRA-02',
        name: 'Valley Acoustic Lab (ESP32-02)',
        location: { name: 'South Valley Basin', latitude: 37.7600, longitude: -122.4400, elevationMeters: 65 },
        status: 'SIMULATED',
        apiKey: 'sec_sensor_key_valley_02',
        samplingRateHz: 20,
        thresholds: {
          staWindowSec: 2,
          ltaWindowSec: 20,
          triggerRatio: 3.5,
          detriggerRatio: 1.5,
          maxPressurePa: 15.0
        }
      });
      console.log('[Seed] Seeded Sensor: ESP32-INFRA-02');
    }

    // 3. Seed Sample Infrasound Events for historical demo
    const eventCount = await InfrasoundEvent.countDocuments();
    if (eventCount === 0) {
      const pastEvents = [
        {
          eventId: 'EVT-HIST-001',
          sensorId: 'ESP32-INFRA-01',
          startTime: new Date(Date.now() - 3600 * 1000 * 4),
          endTime: new Date(Date.now() - 3600 * 1000 * 4 + 14000),
          durationSec: 14.0,
          peakAmplitudePa: 6.4,
          dominantFrequencyHz: 1.15,
          staLtaRatio: 4.8,
          detectionMethod: 'STA_LTA',
          classification: 'SEISMIC',
          status: 'VERIFIED',
          notes: 'Regional minor seismic tremor confirmed by Geological Survey'
        },
        {
          eventId: 'EVT-HIST-002',
          sensorId: 'ESP32-INFRA-02',
          startTime: new Date(Date.now() - 3600 * 1000 * 2),
          endTime: new Date(Date.now() - 3600 * 1000 * 2 + 5000),
          durationSec: 5.0,
          peakAmplitudePa: 14.8,
          dominantFrequencyHz: 4.2,
          staLtaRatio: 7.2,
          detectionMethod: 'STA_LTA',
          classification: 'EXPLOSION',
          status: 'VERIFIED',
          notes: 'Scheduled quarry detonation recorded by station array'
        },
        {
          eventId: 'EVT-HIST-003',
          sensorId: 'ESP32-INFRA-01',
          startTime: new Date(Date.now() - 3600 * 1000 * 1),
          endTime: new Date(Date.now() - 3600 * 1000 * 1 + 28000),
          durationSec: 28.0,
          peakAmplitudePa: 7.9,
          dominantFrequencyHz: 0.35,
          staLtaRatio: 5.1,
          detectionMethod: 'STA_LTA',
          classification: 'SEVERE_WEATHER',
          status: 'DETECTED',
          notes: 'Atmospheric gravity wave precursor to frontal storm'
        }
      ];

      await InfrasoundEvent.insertMany(pastEvents);

      // Seed corresponding alerts
      await Alert.insertMany([
        {
          alertId: 'ALT-HIST-001',
          eventId: 'EVT-HIST-001',
          sensorId: 'ESP32-INFRA-01',
          severity: 'HIGH',
          title: 'Seismic Infrasound Pulse',
          message: 'STA/LTA trigger ratio 4.8 on ESP32-INFRA-01 with 6.4 Pa peak.',
          peakAmplitudePa: 6.4,
          isAcknowledged: true
        },
        {
          alertId: 'ALT-HIST-002',
          eventId: 'EVT-HIST-002',
          sensorId: 'ESP32-INFRA-02',
          severity: 'CRITICAL',
          title: 'High-Energy Transient Shockwave',
          message: 'STA/LTA trigger ratio 7.2 on ESP32-INFRA-02 with 14.8 Pa peak.',
          peakAmplitudePa: 14.8,
          isAcknowledged: false
        }
      ]);
      console.log('[Seed] Seeded historical events & alerts for presentation demo');
    }
  } catch (err) {
    console.error('[Seed] Seeding error:', err.message);
  }
};
