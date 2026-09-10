import React from 'react';

export const MonitoringCard = ({
  title,
  value,
  unit,
  subtitle,
  nominalRange,
  delta,
  icon: Icon,
  color = 'cyan',
  badge
}) => {
  const colorStyles = {
    cyan: {
      accent: 'var(--color-trace-cyan)',
      iconBg: 'var(--state-info-bg)',
      iconColor: 'var(--state-info-text)',
      badgeClass: 'badge-cyan'
    },
    emerald: {
      accent: 'var(--state-normal-text)',
      iconBg: 'var(--state-normal-bg)',
      iconColor: 'var(--state-normal-text)',
      badgeClass: 'badge-emerald'
    },
    amber: {
      accent: 'var(--state-warning-text)',
      iconBg: 'var(--state-warning-bg)',
      iconColor: 'var(--state-warning-text)',
      badgeClass: 'badge-amber'
    },
    rose: {
      accent: 'var(--state-critical-text)',
      iconBg: 'var(--state-critical-bg)',
      iconColor: 'var(--state-critical-text)',
      badgeClass: 'badge-rose'
    },
    purple: {
      accent: '#7e22ce',
      iconBg: '#faf5ff',
      iconColor: '#7e22ce',
      badgeClass: 'badge-purple'
    }
  };

  const scheme = colorStyles[color] || colorStyles.cyan;

  return (
    <div
      className="glass-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderLeft: `4px solid ${scheme.accent}`,
        padding: '18px 20px',
        position: 'relative',
        transition: 'transform var(--transition-fast), box-shadow var(--transition-fast)'
      }}
    >
      {/* Card Header: Label & Scientific Icon */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <div>
          <span style={{
            fontSize: '0.72rem',
            color: 'var(--text-muted)',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '0.06em'
          }}>
            {title}
          </span>
          {subtitle && (
            <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)', marginTop: '2px' }}>
              {subtitle}
            </div>
          )}
        </div>
        
        {Icon && (
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '6px',
            background: scheme.iconBg,
            color: scheme.iconColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Icon size={17} strokeWidth={2.2} />
          </div>
        )}
      </div>

      {/* Main Metric Value */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', margin: '8px 0' }}>
        <span style={{
          fontSize: '1.9rem',
          fontWeight: '700',
          color: 'var(--text-primary)',
          fontFamily: 'var(--font-mono)',
          fontVariantNumeric: 'tabular-nums',
          letterSpacing: '-0.02em',
          lineHeight: '1.1'
        }}>
          {value}
        </span>
        {unit && (
          <span style={{
            fontSize: '0.9rem',
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-mono)',
            fontWeight: '600'
          }}>
            {unit}
          </span>
        )}
      </div>

      {/* Metric Footer: Range & Nominal Status Badge */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: '8px',
        paddingTop: '8px',
        borderTop: '1px solid var(--card-divider)',
        fontSize: '0.74rem'
      }}>
        <div style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.7rem' }}>
          {nominalRange ? `Nominal: ${nominalRange}` : delta}
        </div>
        {badge && (
          <span className={`badge ${scheme.badgeClass}`}>
            {badge}
          </span>
        )}
      </div>
    </div>
  );
};
