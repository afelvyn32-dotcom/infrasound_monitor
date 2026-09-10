import React, { useState, useEffect, useRef } from 'react';
import { MOCK_SENSORS } from '../../data/mockSensors';
import { generateLiveWaveformWindow, MOCK_PRESSURE_TRENDS } from '../../data/mockReadings';
import { LiveWaveformChart } from '../../components/charts/LiveWaveformChart';
import { PressureChart } from '../../components/charts/PressureChart';
import { FrequencySpectrumChart } from '../../components/charts/FrequencySpectrumChart';
import { DetectionStatusBanner } from '../../components/dashboard/DetectionStatusBanner';
import { MetricCard } from '../../components/common/MetricCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Radio, Activity, Cpu, Wifi, Battery, RefreshCw } from 'lucide-react';

export const LiveMonitoring = () => {
  const [selectedSensorId, setSelectedSensorId] = useState(MOCK_SENSORS[0].sensorId);
  const [activeWindow, setActiveWindow] = useState('30s');
  const [isPaused, setIsPaused] = useState(false);

  // Live streaming points
  const [dataPoints, setDataPoints] = useState(() => generateLiveWaveformWindow(30));

  // Current measurements
  const [currentMetrics, setCurrentMetrics] = useState({
    pressure: '1012.4',
    temperature: '27.4',
    frequency: '2.8',
    amplitude: '0.07'
  });

  const tickRef = useRef(0);
  const selectedSensor = MOCK_SENSORS.find(s => s.sensorId === selectedSensorId) || MOCK_SENSORS[0];

  // Adjust point count based on window
  useEffect(() => {
    const count = activeWindow === '5m' ? 60 : activeWindow === '1m' ? 45 : activeWindow === '10s' ? 15 : 30;
    setDataPoints(generateLiveWaveformWindow(count));
  }, [activeWindow]);

  // Live streaming tick interval
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      tickRef.current += 0.2;
      const t = tickRef.current;
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0];

      // Realistic acoustic wave oscillation
      const carrier = Math.sin(t * 1.6) * 0.07;
      const harmonic = Math.cos(t * 0.9) * 0.03;
      const jitter = (Math.random() - 0.5) * 0.01;
      const newAmp = Number((carrier + harmonic + jitter).toFixed(3));

      setDataPoints(prev => {
        const next = {
          time: timeStr,
          timestamp: Date.now(),
          amplitude: newAmp,
          upperThreshold: 0.35,
          lowerThreshold: -0.35
        };
        return [...prev.slice(1), next];
      });

      setCurrentMetrics({
        pressure: (1012.4 + (Math.random() - 0.5) * 0.04).toFixed(1),
        temperature: (27.4 + (Math.random() - 0.5) * 0.02).toFixed(1),
        frequency: (2.8 + (Math.random() - 0.5) * 0.08).toFixed(1),
        amplitude: (0.07 + Math.abs(newAmp) * 0.1).toFixed(2)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPaused]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Radio size={28} color="var(--color-primary)" />
            Real-Time Live Monitoring Workstation
          </h1>
          <p className="page-subtitle">
            Continuous high-resolution telemetry streaming, instantaneous micro-pressure oscillations & STA/LTA energy detection
          </p>
        </div>

        {/* Station Selector Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '0.844rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
            Observation Station:
          </span>
          <select
            value={selectedSensorId}
            onChange={(e) => setSelectedSensorId(e.target.value)}
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              border: '1px solid var(--border-subtle)',
              backgroundColor: '#ffffff',
              fontSize: '0.875rem',
              fontWeight: '600',
              color: 'var(--text-primary)',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            {MOCK_SENSORS.map(s => (
              <option key={s.sensorId} value={s.sensorId}>
                {s.name} ({s.status})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Sensor Diagnostic Overview Bar */}
      <div className="white-card" style={{ padding: '18px 24px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div>
              <span style={{ fontSize: '0.719rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Station Node</span>
              <div style={{ fontSize: '0.938rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                {selectedSensor.station} &middot; {selectedSensor.sensorId}
              </div>
            </div>
            <div>
              <span style={{ fontSize: '0.719rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Sensor Model</span>
              <div style={{ fontSize: '0.938rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
                {selectedSensor.sensorModel}
              </div>
            </div>
            <div>
              <span style={{ fontSize: '0.719rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Sampling Rate</span>
              <div style={{ fontSize: '0.938rem', fontWeight: '700', color: 'var(--color-primary)', fontFamily: 'var(--font-mono)' }}>
                {selectedSensor.sampleRate}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.813rem' }}>
              <Battery size={16} color="var(--status-normal)" />
              <span style={{ fontWeight: '600' }}>{selectedSensor.battery}% Battery</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.813rem' }}>
              <Wifi size={16} color="var(--color-primary)" />
              <span style={{ fontWeight: '600' }}>Data Quality: {selectedSensor.dataQuality}%</span>
            </div>
            <StatusBadge status={selectedSensor.status} />
          </div>
        </div>
      </div>

      {/* 4 Live Telemetry Metrics */}
      <div className="grid-4" style={{ gap: '20px' }}>
        <MetricCard
          title="Pressure"
          value={currentMetrics.pressure}
          unit="hPa"
          trend="Baseline calibrated"
          badgeText="Live"
        />
        <MetricCard
          title="Temperature"
          value={currentMetrics.temperature}
          unit="°C"
          trend="Enclosure core"
          badgeText="Sensor Core"
        />
        <MetricCard
          title="Infrasound Frequency"
          value={currentMetrics.frequency}
          unit="Hz"
          trend="Dominant sub-band"
          badgeText="0.1–20 Hz"
          isPrimary={true}
        />
        <MetricCard
          title="Amplitude"
          value={currentMetrics.amplitude}
          unit="Pa"
          trend="Acoustic pressure"
          badgeText="Oscillation"
          isPrimary={true}
        />
      </div>

      {/* MAIN HERO WAVEFORM */}
      <div className="white-card" style={{ padding: '28px 32px' }}>
        <LiveWaveformChart
          data={dataPoints}
          upperThreshold={0.35}
          lowerThreshold={-0.35}
          height={440}
          activeWindow={activeWindow}
          onWindowChange={setActiveWindow}
          isPaused={isPaused}
          onTogglePause={() => setIsPaused(!isPaused)}
        />
      </div>

      {/* Secondary Row: Pressure Trend, Frequency Spectrum & Detection Status */}
      <div className="grid-3" style={{ gap: '24px' }}>
        {/* Pressure Variation */}
        <div className="white-card" style={{ padding: '24px 28px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>
            Pressure Variation
          </h3>
          <p style={{ fontSize: '0.781rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
            Barometric drift progression (hPa)
          </p>
          <PressureChart data={MOCK_PRESSURE_TRENDS} height={190} />
        </div>

        {/* Frequency Spectrum */}
        <div className="white-card" style={{ padding: '24px 28px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>
            Frequency Spectrum
          </h3>
          <p style={{ fontSize: '0.781rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
            0.1–20.0 Hz acoustic spectral density
          </p>
          <FrequencySpectrumChart height={190} />
        </div>

        {/* Detection Status */}
        <DetectionStatusBanner
          status={selectedSensor.status === 'ONLINE' ? 'NORMAL' : 'WARNING'}
          message={selectedSensor.status === 'ONLINE' ? 'Acoustic micro-pressure variations are within nominal ambient baseline.' : 'Station link degraded. Sensor requires inspection.'}
          staLtaRatio="1.18"
          threshold="3.50"
        />
      </div>

    </div>
  );
};
