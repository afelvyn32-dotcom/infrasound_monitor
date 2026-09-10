/**
 * Mock Sensors Dataset
 * Centralized station and sensor inventory across the observation network
 */

export const MOCK_SENSORS = [
  {
    sensorId: 'INS-BLR-01',
    name: 'Station A · Main Observatory',
    station: 'Station A',
    stationCode: 'BLR-01',
    location: 'Bengaluru, India',
    coordinates: '12.9716° N, 77.5946° E',
    elevation: '920 m',
    status: 'ONLINE',
    health: 'Good (99.8%)',
    dataQuality: 99.8,
    sampleRate: '20 Hz',
    sensorType: 'Differential Microbarometer',
    sensorModel: 'BMP388 Precision Tri-Array',
    firmwareVersion: 'v2.4.1-rc3',
    battery: 98,
    lastUpdate: '2 sec ago',
    installationDate: '2025-04-12',
    thresholds: {
      minFreqHz: 0.1,
      maxFreqHz: 20.0,
      triggerRatio: 3.5,
      maxPressurePa: 1.2
    }
  },
  {
    sensorId: 'INS-HYD-02',
    name: 'Station B · Deccan Array',
    station: 'Station B',
    stationCode: 'HYD-02',
    location: 'Hyderabad, India',
    coordinates: '17.3850° N, 78.4867° E',
    elevation: '542 m',
    status: 'ONLINE',
    health: 'Good (98.5%)',
    dataQuality: 98.5,
    sampleRate: '20 Hz',
    sensorType: 'Capacitive Pressure Transducer',
    sensorModel: 'BMP388 Precision Tri-Array',
    firmwareVersion: 'v2.4.0',
    battery: 92,
    lastUpdate: '4 sec ago',
    installationDate: '2025-06-20',
    thresholds: {
      minFreqHz: 0.1,
      maxFreqHz: 20.0,
      triggerRatio: 3.5,
      maxPressurePa: 1.2
    }
  },
  {
    sensorId: 'INS-DEL-03',
    name: 'Station C · Northern Plains',
    station: 'Station C',
    stationCode: 'DEL-03',
    location: 'New Delhi, India',
    coordinates: '28.6139° N, 77.2090° E',
    elevation: '216 m',
    status: 'ONLINE',
    health: 'Good (99.1%)',
    dataQuality: 99.1,
    sampleRate: '20 Hz',
    sensorType: 'Optical Microbarometer',
    sensorModel: 'INFRA-OPT-300',
    firmwareVersion: 'v2.4.1',
    battery: 95,
    lastUpdate: '1 sec ago',
    installationDate: '2025-08-15',
    thresholds: {
      minFreqHz: 0.1,
      maxFreqHz: 20.0,
      triggerRatio: 3.5,
      maxPressurePa: 1.2
    }
  },
  {
    sensorId: 'INS-PUN-04',
    name: 'Station D · Western Ghats',
    station: 'Station D',
    stationCode: 'PUN-04',
    location: 'Pune, India',
    coordinates: '18.5204° N, 73.8567° E',
    elevation: '560 m',
    status: 'OFFLINE',
    health: 'Maintenance Pending',
    dataQuality: 0.0,
    sampleRate: '20 Hz',
    sensorType: 'Differential Microbarometer',
    sensorModel: 'BMP388 Precision Tri-Array',
    firmwareVersion: 'v2.3.9',
    battery: 14,
    lastUpdate: '25 min ago',
    installationDate: '2025-09-01',
    thresholds: {
      minFreqHz: 0.1,
      maxFreqHz: 20.0,
      triggerRatio: 3.5,
      maxPressurePa: 1.2
    }
  },
  {
    sensorId: 'INS-MUM-05',
    name: 'Station E · Coastal Infrasound Post',
    station: 'Station E',
    stationCode: 'MUM-05',
    location: 'Mumbai, India',
    coordinates: '19.0760° N, 72.8777° E',
    elevation: '14 m',
    status: 'ONLINE',
    health: 'Good (97.9%)',
    dataQuality: 97.9,
    sampleRate: '20 Hz',
    sensorType: 'Acoustic Resonance Array',
    sensorModel: 'ACOUST-ARRAY-X1',
    firmwareVersion: 'v2.4.1',
    battery: 89,
    lastUpdate: '3 sec ago',
    installationDate: '2025-11-10',
    thresholds: {
      minFreqHz: 0.1,
      maxFreqHz: 20.0,
      triggerRatio: 3.5,
      maxPressurePa: 1.2
    }
  }
];

export const getPrimaryStation = () => MOCK_SENSORS[0];

export const getSensorById = (id) => MOCK_SENSORS.find(s => s.sensorId === id) || MOCK_SENSORS[0];
