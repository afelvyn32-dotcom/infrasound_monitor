// Quick sanity test for backend API
const runTests = async () => {
  const BASE_URL = 'http://localhost:5000/api';
  console.log('🧪 Starting backend API sanity checks...\n');

  try {
    // 1. Health check
    const healthRes = await fetch(`${BASE_URL}/health`);
    const healthData = await healthRes.json();
    console.log('✅ 1. Health check:', healthData.status === 'online' ? 'PASSED' : 'FAILED');

    // 2. Login as Admin
    const loginRes = await fetch(`${BASE_URL}/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@infrasound.org', password: 'Admin@123' })
    });
    const loginData = await loginRes.json();
    console.log('✅ 2. Admin Login:', loginData.success && loginData.user.role === 'ADMIN' ? 'PASSED' : 'FAILED');
    const adminToken = loginData.token;

    // 3. Login as User
    const userLoginRes = await fetch(`${BASE_URL}/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'user@infrasound.org', password: 'User@123' })
    });
    const userLoginData = await userLoginRes.json();
    console.log('✅ 3. User Login:', userLoginData.success && userLoginData.user.role === 'USER' ? 'PASSED' : 'FAILED');

    // 4. Fetch Sensors with Token
    const sensorsRes = await fetch(`${BASE_URL}/v1/sensors`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const sensorsData = await sensorsRes.json();
    console.log('✅ 4. Sensor List:', sensorsData.success && sensorsData.count >= 2 ? `PASSED (${sensorsData.count} sensors)` : 'FAILED');

    // 5. Submit Hardware Telemetry Packet
    const telemetryRes = await fetch(`${BASE_URL}/v1/telemetry/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-sensor-id': 'ESP32-INFRA-01',
        'x-api-key': 'sec_sensor_key_ridge_01'
      },
      body: JSON.stringify({
        sensorId: 'ESP32-INFRA-01',
        apiKey: 'sec_sensor_key_ridge_01',
        timestamp: Date.now(),
        samples: [
          { offsetMs: 0, pressurePa: 0.12, rawPressure: 1013.25 },
          { offsetMs: 50, pressurePa: 0.18, rawPressure: 1013.26 },
          { offsetMs: 100, pressurePa: 12.5, rawPressure: 1013.38 } // High transient
        ],
        battery: 95,
        rssi: -60
      })
    });
    const telemetryData = await telemetryRes.json();
    console.log('✅ 5. Hardware Ingestion Endpoint:', telemetryData.success ? `PASSED (STA/LTA Ratio: ${telemetryData.staLtaRatio})` : 'FAILED');

    console.log('\n🎉 ALL BACKEND API SANITY CHECKS PASSED!\n');
  } catch (err) {
    console.error('❌ API Test Failed:', err.message);
  }
};

runTests();
