import React from 'react';

export const EventTimeline = ({ events }) => {
  return (
    <div className="tech-panel" style={{
      padding: '12px 14px',
      borderRadius: 'var(--radius-sm)',
      border: '1px solid #162032',
      background: '#090f19',
      fontFamily: 'var(--font-mono)'
    }}>
      {/* Timeline Section Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: '8px',
        borderBottom: '1px solid #141d2d',
        marginBottom: '10px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: '700', color: '#f8fafc', letterSpacing: '0.04em' }}>
            EVENT TIMELINE
          </span>
          <span style={{ fontSize: '0.66rem', color: 'var(--text-muted)' }}>
            [CHRONOLOGICAL LOG]
          </span>
        </div>
        <span style={{ fontSize: '0.64rem', color: 'var(--text-muted)' }}>
          AUTOMATIC DETECTOR ARMED
        </span>
      </div>

      {/* Chronological Event Stream */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '360px', overflowY: 'auto', paddingRight: '4px' }}>
        {events.map((evt) => {
          const isAnomaly = evt.severity === 'ANOMALY' || evt.type === 'ANOMALY';
          const isElevated = evt.severity === 'ELEVATED' || evt.type === 'ELEVATED';

          return (
            <div
              key={evt.id}
              style={{
                padding: '8px 10px',
                borderRadius: 'var(--radius-xs)',
                border: isAnomaly
                  ? '1px solid rgba(244, 63, 94, 0.4)'
                  : isElevated
                  ? '1px solid rgba(245, 158, 11, 0.35)'
                  : '1px solid #162032',
                backgroundColor: isAnomaly
                  ? '#18090b'
                  : isElevated
                  ? '#120f09'
                  : '#070b13',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '8px',
                fontSize: '0.72rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  fontWeight: '700',
                  color: isAnomaly ? '#fb7185' : isElevated ? '#fcd34d' : 'var(--text-muted)'
                }}>
                  {evt.timestamp}
                </span>

                <span style={{
                  fontSize: '0.62rem',
                  fontWeight: '700',
                  padding: '2px 6px',
                  borderRadius: '2px',
                  background: isAnomaly
                    ? 'rgba(244, 63, 94, 0.2)'
                    : isElevated
                    ? 'rgba(245, 158, 11, 0.2)'
                    : '#0e1726',
                  color: isAnomaly
                    ? '#fda4af'
                    : isElevated
                    ? '#fde68a'
                    : 'var(--text-dim)',
                  border: isAnomaly
                    ? '1px solid rgba(244, 63, 94, 0.5)'
                    : isElevated
                    ? '1px solid rgba(245, 158, 11, 0.4)'
                    : '1px solid #1e293b'
                }}>
                  {isAnomaly ? 'CONFIRMED ANOMALY' : isElevated ? 'POTENTIAL EVENT' : 'NOMINAL'}
                </span>

                <span style={{ color: isAnomaly ? '#ffe4e6' : '#e2e8f0' }}>
                  {evt.eventType || evt.title || 'Infrasound perturbation'}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-dim)', fontSize: '0.68rem' }}>
                {evt.dominantFrequency && (
                  <span>FREQ: <strong style={{ color: 'var(--accent-cyan)' }}>{evt.dominantFrequency}</strong></span>
                )}
                {evt.peakAmplitude && (
                  <span>AMP: <strong style={{ color: isAnomaly ? '#fb7185' : isElevated ? '#fbbf24' : '#e2e8f0' }}>{evt.peakAmplitude}</strong></span>
                )}
                {evt.staLtaRatio && (
                  <span style={{ color: isAnomaly ? '#f43f5e' : 'var(--text-muted)' }}>STA/LTA: {evt.staLtaRatio}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
