import React from 'react';

export const InstrumentMetric = ({
  label,
  value,
  unit,
  headerTag,
  footerLeft,
  footerRight,
  statusColor = 'cyan',
  badgeText
}) => {
  return (
    <div className="tech-panel" style={{
      padding: '10px 12px',
      borderRadius: 'var(--radius-sm)',
      border: '1px solid #162032',
      background: '#090f19',
      fontFamily: 'var(--font-mono)'
    }}>
      {/* Metric Label & Header Annotation */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '0.64rem',
        color: 'var(--text-muted)',
        letterSpacing: '0.06em',
        textTransform: 'uppercase'
      }}>
        <span>{label}</span>
        {badgeText ? (
          <span className={statusColor === 'rose' ? 'badge badge-rose' : statusColor === 'amber' ? 'badge badge-amber' : 'badge badge-emerald'}>
            {badgeText}
          </span>
        ) : (
          <span style={{ color: 'var(--text-dim)' }}>{headerTag}</span>
        )}
      </div>

      {/* Main Tabular Metric Display */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', margin: '4px 0' }}>
        <span style={{
          fontSize: '1.65rem',
          fontWeight: '700',
          color: statusColor === 'rose' ? '#fb7185' : statusColor === 'cyan' ? 'var(--accent-cyan)' : '#f8fafc',
          letterSpacing: '-0.02em',
          lineHeight: '1.1'
        }}>
          {value}
        </span>
        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          {unit}
        </span>
      </div>

      {/* Footer Diagnostic Context */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '0.64rem',
        color: 'var(--text-muted)',
        marginTop: '3px'
      }}>
        <span>{footerLeft}</span>
        <span style={{ color: statusColor === 'rose' ? '#f43f5e' : statusColor === 'emerald' ? '#34d399' : 'var(--accent-cyan)' }}>
          {footerRight}
        </span>
      </div>
    </div>
  );
};
