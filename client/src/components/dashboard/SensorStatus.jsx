import React from 'react';
import { StatusBadge } from '../common/StatusBadge';

export const SensorStatus = ({
  sensorId = 'INS-001',
  status = 'Online',
  dataQuality = 'Good 99.8%',
  lastUpdate = '2 sec ago',
  samplingRate = '20 Hz'
}) => {
  return (
    <div className="white-card" style={{ padding: '24px 28px', height: '100%' }}>
      <h3 style={{
        fontSize: '1.05rem',
        fontWeight: '700',
        color: 'var(--text-primary)',
        marginBottom: '16px',
        letterSpacing: '-0.01em'
      }}>
        Sensor Status
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.844rem' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingBottom: '10px',
          borderBottom: '1px solid var(--border-divider)'
        }}>
          <span style={{ color: 'var(--text-muted)' }}>Sensor ID</span>
          <span style={{ fontWeight: '700', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
            {sensorId}
          </span>
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingBottom: '10px',
          borderBottom: '1px solid var(--border-divider)'
        }}>
          <span style={{ color: 'var(--text-muted)' }}>Status</span>
          <StatusBadge status={status} />
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingBottom: '10px',
          borderBottom: '1px solid var(--border-divider)'
        }}>
          <span style={{ color: 'var(--text-muted)' }}>Data Quality</span>
          <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
            {dataQuality}
          </span>
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingBottom: '10px',
          borderBottom: '1px solid var(--border-divider)'
        }}>
          <span style={{ color: 'var(--text-muted)' }}>Last Update</span>
          <span style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
            {lastUpdate}
          </span>
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span style={{ color: 'var(--text-muted)' }}>Sampling Rate</span>
          <span style={{ fontWeight: '600', color: 'var(--color-primary)', fontFamily: 'var(--font-mono)' }}>
            {samplingRate}
          </span>
        </div>
      </div>
    </div>
  );
};
