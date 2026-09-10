import React from 'react';
import { Database, Clock } from 'lucide-react';

export const RecentReadingsTable = ({ readings }) => {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'ANOMALY':
        return <span className="badge badge-rose">ANOMALY</span>;
      case 'ELEVATED':
        return <span className="badge badge-amber">ELEVATED</span>;
      default:
        return <span className="badge badge-emerald">NORMAL</span>;
    }
  };

  return (
    <div className="glass-card" style={{ padding: '20px' }}>
      {/* Table Section Header */}
      <div className="card-header" style={{ marginBottom: '14px' }}>
        <div className="card-title">
          <Database size={17} color="var(--color-primary)" />
          <span>Recent Sensor Telemetry Readings</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="badge badge-cyan" style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)' }}>
            <Clock size={11} /> LIVE STREAM (1s)
          </span>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            {readings.length} SAMPLES
          </span>
        </div>
      </div>

      {/* Responsive Table Wrapper */}
      <div style={{ overflowX: 'auto' }}>
        <table>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '10px 14px' }}>Time</th>
              <th style={{ textAlign: 'left', padding: '10px 14px' }}>Pressure</th>
              <th style={{ textAlign: 'left', padding: '10px 14px' }}>Temperature</th>
              <th style={{ textAlign: 'left', padding: '10px 14px' }}>Frequency</th>
              <th style={{ textAlign: 'left', padding: '10px 14px' }}>Amplitude</th>
              <th style={{ textAlign: 'left', padding: '10px 14px' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {readings.map((reading) => (
              <tr key={reading.id}>
                <td style={{
                  padding: '10px 14px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8rem',
                  color: 'var(--text-secondary)'
                }}>
                  {reading.time}
                </td>
                <td style={{
                  padding: '10px 14px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.82rem',
                  fontWeight: '600',
                  color: 'var(--text-primary)'
                }}>
                  {reading.pressure}
                </td>
                <td style={{
                  padding: '10px 14px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.82rem',
                  color: 'var(--text-secondary)'
                }}>
                  {reading.temperature}
                </td>
                <td style={{
                  padding: '10px 14px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.82rem',
                  color: 'var(--color-trace-cyan)',
                  fontWeight: '500'
                }}>
                  {reading.frequency}
                </td>
                <td style={{
                  padding: '10px 14px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.82rem',
                  fontWeight: '600',
                  color: parseFloat(reading.amplitude) > 1.0 ? 'var(--state-warning-text)' : 'var(--text-primary)'
                }}>
                  {reading.amplitude}
                </td>
                <td style={{ padding: '10px 14px' }}>
                  {getStatusBadge(reading.status)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
