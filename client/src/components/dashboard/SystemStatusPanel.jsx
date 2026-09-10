import React from 'react';

export const SystemStatusPanel = ({
  sensorId = 'INS-001',
  status = 'ONLINE',
  lastUpdate = '2 sec ago',
  dataQuality = 'GOOD'
}) => {
  return (
    <div className="tech-panel" style={{
      padding: '10px 12px',
      borderRadius: 'var(--radius-sm)',
      background: '#090f19',
      border: '1px solid #162032',
      fontFamily: 'var(--font-mono)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.64rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
        <span style={{ textTransform: 'uppercase', letterSpacing: '0.04em' }}>SYSTEM STATUS</span>
        <span style={{ color: 'var(--text-dim)' }}>TELEMETRY LINK</span>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '6px',
        fontSize: '0.72rem'
      }}>
        <div style={{ backgroundColor: '#070b13', padding: '6px 8px', borderRadius: '2px', border: '1px solid #162032' }}>
          <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>SENSOR</div>
          <div style={{ fontWeight: '700', color: '#f8fafc' }}>{sensorId}</div>
        </div>

        <div style={{ backgroundColor: '#070b13', padding: '6px 8px', borderRadius: '2px', border: '1px solid #162032' }}>
          <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>STATUS</div>
          <div style={{ fontWeight: '700', color: '#34d399', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#34d399' }} />
            {status}
          </div>
        </div>

        <div style={{ backgroundColor: '#070b13', padding: '6px 8px', borderRadius: '2px', border: '1px solid #162032' }}>
          <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>LAST UPDATE</div>
          <div style={{ fontWeight: '700', color: 'var(--text-secondary)' }}>{lastUpdate}</div>
        </div>

        <div style={{ backgroundColor: '#070b13', padding: '6px 8px', borderRadius: '2px', border: '1px solid #162032' }}>
          <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>DATA QUALITY</div>
          <div style={{ fontWeight: '700', color: 'var(--accent-cyan)' }}>{dataQuality} (99.8%)</div>
        </div>
      </div>
    </div>
  );
};
