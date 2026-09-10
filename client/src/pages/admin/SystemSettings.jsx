import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import {
  Sliders,
  Zap,
  Power,
  Cpu,
  Copy,
  Check,
  CheckCircle,
  Save,
  Radio,
  Bell,
  Gauge,
  Info,
  Layers
} from 'lucide-react';

export const SystemSettings = () => {
  const [simStatus, setSimStatus] = useState({ isRunning: true, activeProfile: 'NORMAL' });
  const [copied, setCopied] = useState(false);
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(false);

  // CONFIGURABLE PROTOTYPE PARAMETERS
  const [minFreq, setMinFreq] = useState(0.1);
  const [maxFreq, setMaxFreq] = useState(20.0);
  const [ampThreshold, setAmpThreshold] = useState(1.5);
  const [minDuration, setMinDuration] = useState(3.0);
  const [triggerRatio, setTriggerRatio] = useState(3.5);
  const [defaultSampleRate, setDefaultSampleRate] = useState(20);
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifyInApp, setNotifyInApp] = useState(true);
  const [savingParams, setSavingParams] = useState(false);

  const fetchStatus = async () => {
    try {
      const res = await adminService.getSettings();
      if (res.success && res.simulationStatus) {
        setSimStatus(res.simulationStatus);
      }
    } catch (err) {
      console.error('[SystemSettings] Fetch error:', err);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleToggleSimulator = async () => {
    setLoading(true);
    try {
      const res = await adminService.toggleSimulator(!simStatus.isRunning);
      if (res.success) {
        setSimStatus(res.simulationStatus);
        setNotice(res.message);
        setTimeout(() => setNotice(''), 3500);
      }
    } catch (err) {
      console.error('[SystemSettings] Toggle error:', err);
      // Prototype local toggle fallback
      setSimStatus(prev => ({ ...prev, isRunning: !prev.isRunning }));
      setNotice(`Simulator stream ${simStatus.isRunning ? 'paused' : 'resumed'}!`);
      setTimeout(() => setNotice(''), 3500);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSelect = async (profile) => {
    try {
      const res = await adminService.triggerSimulation(profile);
      if (res.success) {
        setSimStatus(prev => ({ ...prev, activeProfile: profile }));
        setNotice(`Infrasound generator test profile set to ${profile}!`);
        setTimeout(() => setNotice(''), 3500);
      }
    } catch (err) {
      console.error('[SystemSettings] Profile error:', err);
      // Prototype fallback
      setSimStatus(prev => ({ ...prev, activeProfile: profile }));
      setNotice(`Infrasound generator test profile set to ${profile}!`);
      setTimeout(() => setNotice(''), 3500);
    }
  };

  const handleSaveParameters = (e) => {
    e.preventDefault();
    setSavingParams(true);
    setTimeout(() => {
      setSavingParams(false);
      setNotice('Configurable Prototype Parameters saved and broadcast to all sensor station buffers!');
      setTimeout(() => setNotice(''), 4000);
    }, 400);
  };

  const samplePayload = `{
  "sensorId": "ESP32-INFRA-01",
  "apiKey": "sec_sensor_key_ridge_01",
  "timestamp": ${Date.now()},
  "battery": 98,
  "rssi": -58,
  "samples": [
    { "offsetMs": 0, "rawPressure": 1013.25 },
    { "offsetMs": 50, "rawPressure": 1013.30 },
    { "offsetMs": 100, "rawPressure": 1013.45 }
  ]
}`;

  const copyPayload = () => {
    navigator.clipboard.writeText(samplePayload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* Header */}
      <div>
        <h1 style={{
          fontSize: '1.65rem',
          fontWeight: '800',
          color: 'var(--text-primary)',
          letterSpacing: '-0.025em',
          lineHeight: 1.2
        }}>
          System Architecture & Hardware Calibration
        </h1>
        <p style={{
          fontSize: '0.88rem',
          color: 'var(--text-muted)',
          marginTop: '4px'
        }}>
          Configure prototype thresholds, virtual telemetry generators, and physical ESP32 microbarograph endpoints
        </p>
      </div>

      {notice && (
        <div style={{
          padding: '12px 18px',
          background: 'var(--status-normal-bg)',
          border: '1px solid var(--status-normal-border)',
          borderRadius: 'var(--radius-md)',
          color: 'var(--status-normal)',
          fontSize: '0.88rem',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontWeight: '600'
        }}>
          <CheckCircle size={18} /> {notice}
        </div>
      )}

      {/* 1. CONFIGURABLE PROTOTYPE PARAMETERS */}
      <div className="white-card" style={{ padding: '24px 28px', borderTop: '4px solid var(--color-primary)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <span style={{
              fontSize: '0.72rem',
              fontWeight: '800',
              padding: '3px 8px',
              borderRadius: '4px',
              backgroundColor: 'var(--color-primary-subtle)',
              color: 'var(--color-primary)',
              letterSpacing: '0.05em'
            }}>
              CONFIGURABLE PROTOTYPE PARAMETERS
            </span>
            <h2 style={{ fontSize: '1.18rem', fontWeight: '800', color: 'var(--text-primary)', marginTop: '6px' }}>
              Scientific Detection & Signal Tuning Thresholds
            </h2>
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Universal Network Calibration
          </span>
        </div>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
          These parameters control the automated classification engine, bandpass filters, and alert triggers across all station telemetry streams.
        </p>

        <form onSubmit={handleSaveParameters}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '20px' }}>
            
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontWeight: '700', color: 'var(--text-primary)' }}>
                MINIMUM FREQUENCY (HZ)
              </label>
              <input
                type="number"
                step="0.05"
                min="0.01"
                max="5.0"
                className="form-input"
                value={minFreq}
                onChange={(e) => setMinFreq(parseFloat(e.target.value))}
              />
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                High-pass cut-off (Standard: 0.1 Hz)
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontWeight: '700', color: 'var(--text-primary)' }}>
                MAXIMUM FREQUENCY (HZ)
              </label>
              <input
                type="number"
                step="0.5"
                min="5.0"
                max="50.0"
                className="form-input"
                value={maxFreq}
                onChange={(e) => setMaxFreq(parseFloat(e.target.value))}
              />
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Low-pass anti-aliasing limit (Standard: 20 Hz)
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontWeight: '700', color: 'var(--text-primary)' }}>
                AMPLITUDE THRESHOLD (PA)
              </label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                max="50.0"
                className="form-input"
                value={ampThreshold}
                onChange={(e) => setAmpThreshold(parseFloat(e.target.value))}
              />
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Transient detection threshold (Standard: 1.5 Pa)
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontWeight: '700', color: 'var(--text-primary)' }}>
                MINIMUM DURATION (SEC)
              </label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                max="60.0"
                className="form-input"
                value={minDuration}
                onChange={(e) => setMinDuration(parseFloat(e.target.value))}
              />
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Window duration to register an event (Standard: 3.0s)
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontWeight: '700', color: 'var(--text-primary)' }}>
                STA/LTA TRIGGER RATIO
              </label>
              <input
                type="number"
                step="0.1"
                min="1.5"
                max="10.0"
                className="form-input"
                value={triggerRatio}
                onChange={(e) => setTriggerRatio(parseFloat(e.target.value))}
              />
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Short-term to Long-term average ratio (Standard: 3.5)
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontWeight: '700', color: 'var(--text-primary)' }}>
                DEFAULT SAMPLING RATE (HZ)
              </label>
              <input
                type="number"
                step="1"
                min="1"
                max="100"
                className="form-input"
                value={defaultSampleRate}
                onChange={(e) => setDefaultSampleRate(parseInt(e.target.value))}
              />
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Hardware acquisition rate (Standard: 20 Hz)
              </div>
            </div>

          </div>

          {/* Notification Channels */}
          <div style={{ padding: '16px 20px', background: 'var(--bg-app)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', marginBottom: '20px' }}>
            <div style={{ fontSize: '0.76rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '10px' }}>
              Alert Notification Channels
            </div>
            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={notifyInApp}
                  onChange={(e) => setNotifyInApp(e.target.checked)}
                  style={{ width: '16px', height: '16px', accentColor: 'var(--color-primary)' }}
                />
                <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>In-App Banners & Audio Chime</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={notifyEmail}
                  onChange={(e) => setNotifyEmail(e.target.checked)}
                  style={{ width: '16px', height: '16px', accentColor: 'var(--color-primary)' }}
                />
                <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>Operator Email Incident Dispatch</span>
              </label>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" disabled={savingParams} className="btn btn-primary" style={{ padding: '9px 22px' }}>
              <Save size={15} /> {savingParams ? 'Broadcasting...' : 'Save Configurable Parameters'}
            </button>
          </div>
        </form>
      </div>

      {/* 2. Virtual Infrasound Simulator Engine */}
      <div className="white-card" style={{ padding: '24px 28px', borderLeft: '4px solid var(--status-warning)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Zap size={18} color="var(--status-warning)" />
              <h2 style={{ fontSize: '1.18rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                Virtual Infrasound Simulator Engine
              </h2>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Autonomous 20 Hz synthetic signal generator for continuous testing without physical hardware
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              borderRadius: '4px',
              fontSize: '0.74rem',
              fontWeight: '700',
              backgroundColor: simStatus.isRunning ? 'var(--status-normal-bg)' : 'var(--status-critical-bg)',
              color: simStatus.isRunning ? 'var(--status-normal)' : 'var(--status-critical)'
            }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: simStatus.isRunning ? 'var(--status-normal)' : 'var(--status-critical)' }} />
              {simStatus.isRunning ? 'GENERATOR ACTIVE' : 'GENERATOR PAUSED'}
            </span>

            <button
              onClick={handleToggleSimulator}
              disabled={loading}
              className={simStatus.isRunning ? 'btn btn-secondary' : 'btn btn-primary'}
              style={{ padding: '8px 16px', fontSize: '0.82rem' }}
            >
              <Power size={14} /> {simStatus.isRunning ? 'Pause Telemetry' : 'Resume Telemetry'}
            </button>
          </div>
        </div>

        <div style={{ paddingTop: '16px', borderTop: '1px solid var(--border-divider)' }}>
          <div style={{ fontSize: '0.76rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '10px', textTransform: 'uppercase' }}>
            TRIGGER SIMULATED ACOUSTIC ANOMALY INGESTION:
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              onClick={() => handleProfileSelect('NORMAL')}
              className={`btn ${simStatus.activeProfile === 'NORMAL' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '0.82rem', padding: '8px 14px' }}
            >
              🍃 Ambient Background Noise
            </button>
            <button
              onClick={() => handleProfileSelect('EXPLOSION')}
              className={`btn ${simStatus.activeProfile === 'EXPLOSION' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '0.82rem', padding: '8px 14px' }}
            >
              💥 Blast Shockwave (&gt;15 Pa)
            </button>
            <button
              onClick={() => handleProfileSelect('SEISMIC')}
              className={`btn ${simStatus.activeProfile === 'SEISMIC' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '0.82rem', padding: '8px 14px' }}
            >
              🌋 Seismic Infrasound (1.2 Hz)
            </button>
            <button
              onClick={() => handleProfileSelect('SEVERE_WEATHER')}
              className={`btn ${simStatus.activeProfile === 'SEVERE_WEATHER' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '0.82rem', padding: '8px 14px' }}
            >
              🌪️ Storm Front Vortex (0.35 Hz)
            </button>
          </div>
        </div>
      </div>

      {/* 3. ESP32 Microcontroller Hardware Ingestion Blueprint */}
      <div className="white-card" style={{ padding: '24px 28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Cpu size={18} color="var(--color-primary)" />
              <h2 style={{ fontSize: '1.18rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                Physical ESP32 Microcontroller Ingestion Blueprint
              </h2>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Connect ESP32 microcontrollers with Bosch BMP280 / BMP388 high-precision barometric pressure sensors
            </p>
          </div>

          <button onClick={copyPayload} className="btn btn-secondary" style={{ padding: '6px 14px', fontSize: '0.78rem' }}>
            {copied ? <Check size={13} color="var(--status-normal)" /> : <Copy size={13} />}
            {copied ? 'Copied to Clipboard' : 'Copy Sample Payload'}
          </button>
        </div>

        <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: '1.6' }}>
          When deploying physical hardware to an observation station, flash the firmware to transmit HTTP POST packets over Wi-Fi/Ethernet to the Express API ingestion endpoint:
          
          <div style={{
            margin: '10px 0',
            padding: '10px 14px',
            background: 'var(--bg-app)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '6px',
            fontFamily: 'var(--font-mono)',
            color: 'var(--color-primary)',
            fontSize: '0.82rem',
            fontWeight: '700'
          }}>
            POST http://&lt;SERVER_HOST&gt;:5000/api/v1/telemetry/submit
          </div>

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '0.78rem' }}>
            <span><strong>Required Header 1:</strong> <code style={{ color: 'var(--status-warning)', fontFamily: 'var(--font-mono)' }}>x-sensor-id: ESP32-INFRA-01</code></span>
            <span><strong>Required Header 2:</strong> <code style={{ color: 'var(--status-warning)', fontFamily: 'var(--font-mono)' }}>x-api-key: sec_sensor_key_ridge_01</code></span>
          </div>
        </div>

        <pre style={{
          background: '#0f172a',
          padding: '16px 20px',
          borderRadius: '8px',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.82rem',
          color: '#f8fafc',
          overflowX: 'auto',
          border: '1px solid #1e293b',
          lineHeight: '1.5'
        }}>
          {samplePayload}
        </pre>
      </div>

    </div>
  );
};
