import React from 'react';
import { AlertTriangle, ChevronRight, Activity, Clock, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';

export const RecentEventsSection = ({ events }) => {
  const getSeverityBadge = (severity) => {
    switch (severity) {
      case 'ANOMALY':
        return <span className="badge badge-rose">CRITICAL ANOMALY</span>;
      case 'ELEVATED':
        return <span className="badge badge-amber">ELEVATED EVENT</span>;
      default:
        return <span className="badge badge-emerald">RECORDED EVENT</span>;
    }
  };

  const getClassificationBadge = (cls) => {
    switch (cls) {
      case 'ANTHROPOGENIC':
        return <span className="badge badge-purple">ANTHROPOGENIC</span>;
      case 'METEOROLOGICAL':
        return <span className="badge badge-cyan">METEOROLOGICAL</span>;
      case 'GEOPHYSICAL':
        return <span className="badge badge-amber">GEOPHYSICAL</span>;
      default:
        return <span className="badge badge-emerald">ATMOSPHERIC</span>;
    }
  };

  return (
    <div className="glass-card" style={{ padding: '20px' }}>
      {/* Section Header */}
      <div className="card-header" style={{ marginBottom: '16px' }}>
        <div className="card-title">
          <AlertTriangle size={17} color="var(--state-warning-text)" />
          <span>Recent Infrasound Events</span>
        </div>
        <Link
          to="/user/events"
          style={{
            fontSize: '0.78rem',
            color: 'var(--color-primary)',
            fontWeight: '600',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <span>Full Events Catalog</span>
          <ChevronRight size={14} />
        </Link>
      </div>

      {/* Events List / Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {events.map((evt) => (
          <div
            key={evt.id}
            style={{
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--card-border)',
              background: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              flexWrap: 'wrap',
              transition: 'all var(--transition-fast)'
            }}
          >
            {/* Event Title & Metadata */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', minWidth: '240px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '6px',
                background: evt.severity === 'ANOMALY' ? 'var(--state-critical-bg)' : 'var(--state-info-bg)',
                color: evt.severity === 'ANOMALY' ? 'var(--state-critical-text)' : 'var(--state-info-text)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Activity size={16} strokeWidth={2.2} />
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{
                    fontSize: '0.74rem',
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--text-muted)',
                    fontWeight: '600'
                  }}>
                    {evt.id}
                  </span>
                  <span style={{ fontSize: '0.86rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                    {evt.eventType}
                  </span>
                  {getClassificationBadge(evt.classification)}
                </div>

                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '3px', lineHeight: '1.4' }}>
                  {evt.notes}
                </p>
              </div>
            </div>

            {/* Event Quantitative Metrics */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              fontSize: '0.78rem',
              fontFamily: 'var(--font-mono)',
              flexShrink: 0
            }}>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.68rem', textTransform: 'uppercase' }}>
                  Peak Amplitude
                </span>
                <strong style={{ color: 'var(--text-primary)', fontSize: '0.84rem' }}>{evt.peakAmplitude}</strong>
              </div>

              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.68rem', textTransform: 'uppercase' }}>
                  Frequency
                </span>
                <span style={{ color: 'var(--color-trace-cyan)', fontWeight: '600' }}>{evt.dominantFrequency}</span>
              </div>

              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.68rem', textTransform: 'uppercase' }}>
                  Duration
                </span>
                <span style={{ color: 'var(--text-secondary)' }}>{evt.duration}</span>
              </div>

              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.68rem', textTransform: 'uppercase' }}>
                  Timestamp
                </span>
                <span style={{ color: 'var(--text-secondary)' }}>{evt.timestamp}</span>
              </div>

              <div>
                {getSeverityBadge(evt.severity)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
