import React, { useState, useEffect, useRef } from 'react';
import {
  CURRENT_STATION,
  USER_MEASUREMENTS,
  CURRENT_STATUS,
  SENSOR_STATUS_DATA,
  RECENT_READINGS,
  RECENT_EVENTS,
  MOCK_PRESSURE_TRENDS
} from '../../data/mockDashboardData';
import { generateLiveWaveformWindow } from '../../data/mockReadings';
import { MetricCard } from '../../components/common/MetricCard';
import { LiveWaveformChart } from '../../components/charts/LiveWaveformChart';
import { PressureChart } from '../../components/charts/PressureChart';
import { FrequencySpectrumChart } from '../../components/charts/FrequencySpectrumChart';
import { DetectionStatusBanner } from '../../components/dashboard/DetectionStatusBanner';
import { SensorStatus } from '../../components/dashboard/SensorStatus';
import { StatusBadge } from '../../components/common/StatusBadge';
import { DataTable } from '../../components/common/DataTable';
import { Drawer } from '../../components/common/Drawer';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Activity, Calendar, Clock, MapPin, Radio, Shield, Waves, FileText } from 'lucide-react';

export const UserDashboard = () => {
  // Time-window state (30s, 1m, 5m)
  const [activeWindow, setActiveWindow] = useState('30s');
  const [isPaused, setIsPaused] = useState(false);

  // Live streaming waveform points
  const [waveformPoints, setWaveformPoints] = useState(() => generateLiveWaveformWindow(30));

  // Dynamic live metric fluctuations around baseline values
  const [measurements, setMeasurements] = useState(USER_MEASUREMENTS);

  // Detection status state (NORMAL, WARNING, INFRASOUND EVENT DETECTED, CRITICAL)
  const [detectionStatus, setDetectionStatus] = useState(CURRENT_STATUS.state);
  const [detectionMessage, setDetectionMessage] = useState(CURRENT_STATUS.message);
  const [staLtaRatio, setStaLtaRatio] = useState(CURRENT_STATUS.staLtaRatio);

  // Event Inspector Drawer state
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Tick counter for live simulation
  const tickRef = useRef(0);

  // Adjust window size
  useEffect(() => {
    const seconds = activeWindow === '5m' ? 60 : activeWindow === '1m' ? 45 : 30;
    setWaveformPoints(generateLiveWaveformWindow(seconds));
  }, [activeWindow]);

  // Live tick update interval (simulating 20 Hz live sampling buffer)
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      tickRef.current += 0.2;
      const t = tickRef.current;
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0];

      // Infrasonic micro-pressure formula
      const carrier = Math.sin(t * 1.6) * 0.06;
      const harmonic = Math.cos(t * 0.8) * 0.025;
      const microbarom = Math.sin(t * 2.8 * Math.PI) * 0.015;
      const jitter = (Math.random() - 0.5) * 0.01;
      const newAmp = Number((carrier + harmonic + microbarom + jitter).toFixed(3));

      // Append new point and maintain sliding window
      setWaveformPoints(prev => {
        const nextPoint = {
          time: timeStr,
          timestamp: Date.now(),
          amplitude: newAmp,
          upperThreshold: 0.35,
          lowerThreshold: -0.35
        };
        return [...prev.slice(1), nextPoint];
      });

      // Subtle fluctuation on measurement cards
      setMeasurements(prev => ({
        pressure: {
          ...prev.pressure,
          value: (1012.4 + (Math.random() - 0.5) * 0.04).toFixed(1)
        },
        temperature: {
          ...prev.temperature,
          value: (27.4 + (Math.random() - 0.5) * 0.02).toFixed(1)
        },
        frequency: {
          ...prev.frequency,
          value: (2.8 + (Math.random() - 0.5) * 0.06).toFixed(1)
        },
        amplitude: {
          ...prev.amplitude,
          value: (0.07 + Math.abs(newAmp) * 0.1).toFixed(2)
        }
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, [isPaused]);

  // Handle anomaly injection simulation
  const handleSimulateAnomaly = () => {
    setDetectionStatus('INFRASOUND EVENT DETECTED');
    setDetectionMessage('High-amplitude microbaric transient wave detected! Automated STA/LTA acoustic ratio peaked at 6.85.');
    setStaLtaRatio('6.85');

    // Inject shock spike into waveform
    setWaveformPoints(prev => {
      const copy = [...prev];
      if (copy.length > 5) {
        copy[copy.length - 1].amplitude = 0.62;
        copy[copy.length - 2].amplitude = 0.48;
        copy[copy.length - 3].amplitude = 0.35;
      }
      return copy;
    });

    // Reset after 8 seconds
    setTimeout(() => {
      setDetectionStatus('NORMAL');
      setDetectionMessage('No abnormal infrasound activity detected.');
      setStaLtaRatio('1.18');
    }, 8000);
  };

  // Table columns definition for Recent Readings
  const readingsColumns = [
    {
      header: 'Time',
      accessor: 'time',
      render: (row) => <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{row.time}</span>
    },
    {
      header: 'Pressure',
      accessor: 'pressure',
      render: (row) => <span style={{ fontWeight: '600', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{row.pressure}</span>
    },
    {
      header: 'Temperature',
      accessor: 'temp',
      render: (row) => <span style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>{row.temp}</span>
    },
    {
      header: 'Frequency',
      accessor: 'frequency',
      render: (row) => <span style={{ color: 'var(--color-primary)', fontWeight: '600', fontFamily: 'var(--font-mono)' }}>{row.frequency}</span>
    },
    {
      header: 'Amplitude',
      accessor: 'amplitude',
      render: (row) => <span style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{row.amplitude}</span>
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => <StatusBadge status={row.status} />
    }
  ];

  // Table columns definition for Recent Infrasound Events
  const eventsColumns = [
    {
      header: 'Event ID',
      accessor: 'eventId',
      render: (row) => (
        <button
          onClick={() => setSelectedEvent(row)}
          style={{
            fontWeight: '700',
            color: 'var(--color-primary)',
            fontFamily: 'var(--font-mono)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            textDecoration: 'underline'
          }}
        >
          {row.eventId}
        </button>
      )
    },
    {
      header: 'Time',
      accessor: 'startTime',
      render: (row) => (
        <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.781rem' }}>
          {row.startTime ? row.startTime.split(' ')[1] : '11:32:08'}
        </span>
      )
    },
    {
      header: 'Frequency',
      accessor: 'dominantFrequency',
      render: (row) => (
        <span style={{ fontWeight: '600', color: 'var(--color-primary)', fontFamily: 'var(--font-mono)' }}>
          {row.dominantFrequency} Hz
        </span>
      )
    },
    {
      header: 'Amplitude',
      accessor: 'peakAmplitude',
      render: (row) => (
        <span style={{ fontWeight: '600', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
          {row.peakAmplitude} Pa
        </span>
      )
    },
    {
      header: 'Duration',
      accessor: 'duration',
      render: (row) => <span style={{ color: 'var(--text-secondary)' }}>{row.duration}</span>
    },
    {
      header: 'Severity',
      accessor: 'severity',
      render: (row) => <StatusBadge status={row.severity} />
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => (
        <span style={{
          fontSize: '0.719rem',
          fontWeight: '700',
          color: row.status === 'VERIFIED' ? 'var(--status-normal)' : 'var(--status-warning)',
          backgroundColor: row.status === 'VERIFIED' ? 'var(--status-normal-bg)' : 'var(--status-warning-bg)',
          border: `1px solid ${row.status === 'VERIFIED' ? 'var(--status-normal-border)' : 'var(--status-warning-border)'}`,
          padding: '2px 8px',
          borderRadius: '4px'
        }}>
          {row.status}
        </span>
      )
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* 1. Page Header with Clean Hierarchy */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Activity size={28} color="var(--color-primary)" />
            Infrasound Dashboard
          </h1>
          <p className="page-subtitle">
            Real-time atmospheric pressure and infrasound monitoring
          </p>
        </div>

        {/* Current Active Station Context Card */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '10px 18px',
          backgroundColor: '#ffffff',
          borderRadius: '10px',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-xs)'
        }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            backgroundColor: 'var(--color-primary-subtle)',
            color: 'var(--color-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Radio size={18} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontWeight: '700', fontSize: '0.938rem', color: 'var(--text-primary)' }}>
                {CURRENT_STATION.name}
              </span>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.75rem',
                color: 'var(--status-normal)',
                fontWeight: '700'
              }}>
                <span className="pulse-dot-green" /> Online
              </span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {CURRENT_STATION.location} &middot; Last update: {CURRENT_STATION.lastUpdate}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Top 4 Spacious Measurement Cards */}
      <div className="grid-4" style={{ gap: '20px' }}>
        <MetricCard
          title="Pressure"
          value={measurements.pressure.value}
          unit="hPa"
          trend={measurements.pressure.trend}
          nominal="Nominal 1013.25 hPa"
          badgeText="Normal"
        />
        <MetricCard
          title="Temperature"
          value={measurements.temperature.value}
          unit="°C"
          trend={measurements.temperature.trend}
          nominal="Core Sensor 27.4 °C"
          badgeText="Stable"
        />
        <MetricCard
          title="Infrasound Frequency"
          value={measurements.frequency.value}
          unit="Hz"
          trend={measurements.frequency.trend}
          nominal="Band 0.1–20 Hz"
          badgeText="Microbarom"
          isPrimary={true}
        />
        <MetricCard
          title="Amplitude"
          value={measurements.amplitude.value}
          unit="Pa"
          trend={measurements.amplitude.trend}
          nominal="Threshold: 0.35 Pa"
          badgeText="Quiet"
          isPrimary={true}
        />
      </div>

      {/* 3. HERO ELEMENT: Live Infrasound Waveform Card (450px) */}
      <div className="white-card" style={{ padding: '28px 32px' }}>
        <LiveWaveformChart
          data={waveformPoints}
          upperThreshold={0.35}
          lowerThreshold={-0.35}
          height={420}
          activeWindow={activeWindow}
          onWindowChange={setActiveWindow}
          isPaused={isPaused}
          onTogglePause={() => setIsPaused(!isPaused)}
        />
      </div>

      {/* 4. Secondary Analytical Row: Pressure Variation & Frequency Spectrum */}
      <div className="grid-2" style={{ gap: '24px' }}>
        {/* Pressure Variation Graph */}
        <div className="white-card" style={{ padding: '24px 28px' }}>
          <div style={{ marginBottom: '14px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-primary)' }}>
              Pressure Variation Trend
            </h3>
            <p style={{ fontSize: '0.781rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Interpolated barometric pressure progression (hPa) over 24-hour cycle
            </p>
          </div>
          <PressureChart data={MOCK_PRESSURE_TRENDS} height={210} />
        </div>

        {/* Frequency Spectrum Card */}
        <div className="white-card" style={{ padding: '24px 28px' }}>
          <div style={{ marginBottom: '14px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-primary)' }}>
              Sub-Audible Frequency Spectrum
            </h3>
            <p style={{ fontSize: '0.781rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Continuous 20-band Power Spectral Density (0.1 to 20.0 Hz)
            </p>
          </div>
          <FrequencySpectrumChart height={210} />
        </div>
      </div>

      {/* 5. Tertiary Status Row: Current Detection Status & Sensor Status */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        <DetectionStatusBanner
          status={detectionStatus}
          message={detectionMessage}
          staLtaRatio={staLtaRatio}
          threshold="3.50"
          onSimulateAnomaly={handleSimulateAnomaly}
        />
        <SensorStatus
          sensorId={CURRENT_STATION.id}
          status={CURRENT_STATION.status}
          dataQuality={CURRENT_STATION.dataQuality}
          lastUpdate={CURRENT_STATION.lastUpdate}
          samplingRate={CURRENT_STATION.sampleRate}
        />
      </div>

      {/* 6. Operational Data Tables: Recent Readings & Recent Events */}
      <div className="grid-2" style={{ gap: '24px' }}>
        
        {/* Recent Readings Table */}
        <div className="white-card" style={{ padding: '24px 28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                Recent Readings
              </h3>
              <p style={{ fontSize: '0.781rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Consecutive high-frequency telemetry packets
              </p>
            </div>
            <Link
              to="/user/live"
              style={{
                fontSize: '0.813rem',
                color: 'var(--color-primary)',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              Full Stream <ArrowUpRight size={14} />
            </Link>
          </div>

          <DataTable
            columns={readingsColumns}
            data={RECENT_READINGS}
            pageSize={6}
          />
        </div>

        {/* Recent Events Table */}
        <div className="white-card" style={{ padding: '24px 28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                Recent Infrasound Events
              </h3>
              <p style={{ fontSize: '0.781rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Algorithmic STA/LTA transient triggers (Click to inspect)
              </p>
            </div>
            <Link
              to="/user/events"
              style={{
                fontSize: '0.813rem',
                color: 'var(--color-primary)',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              View Catalog <ArrowUpRight size={14} />
            </Link>
          </div>

          <DataTable
            columns={eventsColumns}
            data={RECENT_EVENTS}
            pageSize={5}
          />
        </div>
      </div>

      {/* 7. Slide-In Event Detail Drawer */}
      {selectedEvent && (
        <Drawer
          isOpen={!!selectedEvent}
          onClose={() => setSelectedEvent(null)}
          title={`Event Inspection: ${selectedEvent.eventId}`}
          subtitle={`${selectedEvent.station} · ${selectedEvent.sensorName}`}
          footer={
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setSelectedEvent(null)}
                className="btn btn-secondary"
              >
                Close
              </button>
              <Link
                to="/user/events"
                className="btn btn-primary"
              >
                Open in Full Catalog
              </Link>
            </div>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Header KPI cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              <div style={{ padding: '12px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.719rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Peak Amplitude</div>
                <div style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-primary)', marginTop: '2px' }}>
                  {selectedEvent.peakAmplitude} Pa
                </div>
              </div>
              <div style={{ padding: '12px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.719rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Dominant Freq</div>
                <div style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--color-primary)', marginTop: '2px' }}>
                  {selectedEvent.dominantFrequency} Hz
                </div>
              </div>
              <div style={{ padding: '12px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.719rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Duration</div>
                <div style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-primary)', marginTop: '2px' }}>
                  {selectedEvent.duration}
                </div>
              </div>
            </div>

            {/* Event Waveform Snapshot */}
            <div>
              <h4 style={{ fontSize: '0.875rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px' }}>
                Waveform Transient Signature
              </h4>
              <div style={{ padding: '12px', backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '8px' }}>
                <LiveWaveformChart
                  data={selectedEvent.waveformSnapshot || []}
                  height={180}
                  upperThreshold={0.35}
                  lowerThreshold={-0.35}
                />
              </div>
            </div>

            {/* Event Metadata List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.844rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--border-divider)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Trigger Timestamp</span>
                <span style={{ fontWeight: '600', fontFamily: 'var(--font-mono)' }}>{selectedEvent.startTime}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--border-divider)' }}>
                <span style={{ color: 'var(--text-muted)' }}>STA/LTA Energy Ratio</span>
                <span style={{ fontWeight: '700', color: 'var(--status-critical)', fontFamily: 'var(--font-mono)' }}>
                  {selectedEvent.staLtaRatio} (Trigger &gt; {selectedEvent.thresholdRatio})
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--border-divider)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Classification</span>
                <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{selectedEvent.classification}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--border-divider)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Scientific Status</span>
                <StatusBadge status={selectedEvent.status} />
              </div>
            </div>

            {/* Analyst Notes */}
            <div style={{ padding: '14px', backgroundColor: '#eff6ff', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#1e40af', textTransform: 'uppercase' }}>
                Scientific Observation Notes
              </div>
              <p style={{ fontSize: '0.813rem', color: '#1e3a8a', marginTop: '4px', lineHeight: 1.5 }}>
                {selectedEvent.analystNotes || 'Event signal verified against regional baseline sensors.'}
              </p>
            </div>
          </div>
        </Drawer>
      )}

    </div>
  );
};
