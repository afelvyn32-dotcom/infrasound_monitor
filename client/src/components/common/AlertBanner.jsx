import React from 'react';
import { useAlerts } from '../../context/AlertContext';
import { AlertTriangle, X, Check } from 'lucide-react';

export const AlertBanner = () => {
  const { latestPopup, dismissPopup, acknowledgeAlert } = useAlerts();

  if (!latestPopup) return null;

  const isCritical = latestPopup.severity === 'CRITICAL';

  return (
    <div className="white-card" style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      width: '380px',
      backgroundColor: '#ffffff',
      border: `1px solid ${isCritical ? 'var(--state-critical-border)' : 'var(--state-warning-border)'}`,
      borderLeft: `4px solid ${isCritical ? 'var(--status-red)' : 'var(--status-amber)'}`,
      borderRadius: '8px',
      padding: '16px',
      boxShadow: '0 10px 30px -5px rgba(15, 23, 42, 0.12)',
      zIndex: 100
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '4px',
            background: isCritical ? 'var(--state-critical-bg)' : 'var(--state-warning-bg)',
            color: isCritical ? 'var(--state-critical-text)' : 'var(--state-warning-text)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <AlertTriangle size={18} strokeWidth={2.2} />
          </div>
          <div>
            <div style={{ fontSize: '0.86rem', fontWeight: '700', color: 'var(--text-primary)' }}>
              {latestPopup.title}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--color-primary)', fontFamily: 'var(--font-mono)', marginTop: '2px', fontWeight: '600' }}>
              Station: {latestPopup.sensorId} | Peak: {latestPopup.peakAmplitudePa} Pa
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '3px' }}>
              {latestPopup.message}
            </div>
          </div>
        </div>
        <button onClick={dismissPopup} style={{ color: 'var(--text-muted)' }} title="Dismiss">
          <X size={15} />
        </button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px', paddingTop: '8px', borderTop: '1px solid var(--card-divider)' }}>
        <button
          onClick={() => {
            acknowledgeAlert(latestPopup.alertId);
            dismissPopup();
          }}
          className="btn btn-primary"
          style={{ padding: '4px 12px', fontSize: '0.75rem' }}
        >
          <Check size={12} /> Acknowledge Alert
        </button>
      </div>
    </div>
  );
};
