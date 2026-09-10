import React from 'react';

export const MetricCard = ({
  title,
  value,
  unit,
  trend,
  nominal,
  badgeText,
  isPrimary = false
}) => {
  return (
    <div
      className="white-card"
      style={{
        padding: '24px 28px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <span style={{
          fontSize: '0.75rem',
          fontWeight: '700',
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.06em'
        }}>
          {title}
        </span>
        {badgeText && (
          <span style={{
            fontSize: '0.719rem',
            padding: '2px 8px',
            borderRadius: '4px',
            backgroundColor: 'var(--color-primary-subtle)',
            color: 'var(--color-primary)',
            fontWeight: '600'
          }}>
            {badgeText}
          </span>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', margin: '6px 0 10px' }}>
        <span style={{
          fontSize: '2.15rem',
          fontWeight: '800',
          color: isPrimary ? 'var(--color-primary)' : 'var(--text-primary)',
          fontFamily: 'var(--font-mono)',
          fontVariantNumeric: 'tabular-nums',
          letterSpacing: '-0.025em',
          lineHeight: '1.1'
        }}>
          {value}
        </span>
        {unit && (
          <span style={{
            fontSize: '0.938rem',
            fontWeight: '600',
            color: isPrimary ? 'var(--color-primary)' : 'var(--text-muted)'
          }}>
            {unit}
          </span>
        )}
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: '0.781rem',
        color: 'var(--text-muted)',
        paddingTop: '8px',
        borderTop: '1px solid var(--border-divider)'
      }}>
        {trend && (
          <span style={{ fontWeight: '500', color: isPrimary ? 'var(--color-primary)' : 'var(--text-secondary)' }}>
            {trend}
          </span>
        )}
        {nominal && (
          <>
            <span style={{ color: 'var(--border-focus)' }}>·</span>
            <span>{nominal}</span>
          </>
        )}
      </div>
    </div>
  );
};
