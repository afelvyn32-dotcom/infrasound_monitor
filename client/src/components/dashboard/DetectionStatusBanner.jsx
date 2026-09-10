import React from 'react';
import { ShieldCheck, AlertTriangle, AlertCircle, Zap } from 'lucide-react';

export const DetectionStatusBanner = ({
  status = 'NORMAL',
  message = 'No abnormal infrasound activity detected.',
  staLtaRatio = '1.18',
  threshold = '3.50',
  onSimulateAnomaly
}) => {
  const isCritical = status === 'CRITICAL' || status === 'INFRASOUND EVENT DETECTED';
  const isWarning = status === 'WARNING';
  const isNormal = status === 'NORMAL';

  const config = isCritical
    ? {
        badgeBg: 'var(--status-critical-bg)',
        badgeColor: 'var(--status-critical)',
        badgeBorder: 'var(--status-critical-border)',
        dotColor: 'var(--status-critical)',
        icon: AlertCircle,
        titleColor: 'var(--text-primary)',
        accentBorder: 'var(--status-critical)'
      }
    : isWarning
    ? {
        badgeBg: 'var(--status-warning-bg)',
        badgeColor: 'var(--status-warning)',
        badgeBorder: 'var(--status-warning-border)',
        dotColor: 'var(--status-warning)',
        icon: AlertTriangle,
        titleColor: 'var(--text-primary)',
        accentBorder: 'var(--status-warning)'
      }
    : {
        badgeBg: 'var(--status-normal-bg)',
        badgeColor: 'var(--status-normal)',
        badgeBorder: 'var(--status-normal-border)',
        dotColor: 'var(--status-normal)',
        icon: ShieldCheck,
        titleColor: 'var(--text-primary)',
        accentBorder: 'var(--status-normal)'
      };

  const Icon = config.icon;

  return (
    <div
      className="white-card"
      style={{
        padding: '24px 28px',
        borderLeft: `4px solid ${config.accentBorder}`,
        transition: 'border-color 300ms ease, background-color 300ms ease'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <span style={{
          fontSize: '0.75rem',
          fontWeight: '700',
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.06em'
        }}>
          Current Detection Status
        </span>

        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 10px',
          borderRadius: '9999px',
          backgroundColor: config.badgeBg,
          color: config.badgeColor,
          border: `1px solid ${config.badgeBorder}`,
          fontSize: '0.781rem',
          fontWeight: '700',
          letterSpacing: '0.04em'
        }}>
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: config.dotColor
          }} />
          <span>{status}</span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '6px' }}>
        <Icon size={22} color={config.badgeColor} strokeWidth={2.4} />
        <h3 style={{
          fontSize: '1.25rem',
          fontWeight: '800',
          color: config.titleColor,
          lineHeight: 1.2
        }}>
          {status === 'NORMAL' ? 'System Calibrated · Quiescent' : status}
        </h3>
      </div>

      <p style={{
        fontSize: '0.875rem',
        color: 'var(--text-secondary)',
        marginTop: '8px',
        lineHeight: '1.5'
      }}>
        {message}
      </p>

      {/* STA/LTA Ratio Diagnostic Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '18px',
        paddingTop: '14px',
        borderTop: '1px solid var(--border-divider)',
        fontSize: '0.813rem'
      }}>
        <div style={{ display: 'flex', gap: '16px' }}>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>STA/LTA Ratio: </span>
            <span style={{
              fontWeight: '700',
              fontFamily: 'var(--font-mono)',
              color: Number(staLtaRatio) >= Number(threshold) ? 'var(--status-critical)' : 'var(--text-primary)'
            }}>
              {staLtaRatio}
            </span>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Threshold: </span>
            <span style={{ fontWeight: '600', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
              {threshold}
            </span>
          </div>
        </div>

        {onSimulateAnomaly && (
          <button
            type="button"
            onClick={onSimulateAnomaly}
            className="btn btn-secondary"
            style={{ fontSize: '0.75rem', padding: '5px 10px', gap: '4px' }}
            title="Inject simulated atmospheric pressure anomaly"
          >
            <Zap size={13} color="var(--status-warning)" />
            <span>Test Anomaly</span>
          </button>
        )}
      </div>
    </div>
  );
};
