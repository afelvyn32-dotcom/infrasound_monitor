import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export const ErrorState = ({
  title = 'Unable to Load Telemetry',
  message = 'An unexpected error occurred while communicating with the observatory network.',
  onRetry
}) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 24px',
      textAlign: 'center',
      backgroundColor: 'var(--status-critical-bg)',
      border: '1px solid var(--status-critical-border)',
      borderRadius: 'var(--radius-lg)',
      margin: '16px 0'
    }}>
      <div style={{
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        backgroundColor: '#fee2e2',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--status-critical)',
        marginBottom: '12px'
      }}>
        <AlertCircle size={20} />
      </div>
      <h4 style={{ fontSize: '0.98rem', fontWeight: '700', color: 'var(--status-critical)' }}>
        {title}
      </h4>
      <p style={{ fontSize: '0.813rem', color: '#991b1b', marginTop: '4px', maxWidth: '400px', lineHeight: 1.45 }}>
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="btn btn-secondary"
          style={{ marginTop: '14px', fontSize: '0.8rem', padding: '6px 14px' }}
        >
          <RefreshCw size={14} /> Reconnect
        </button>
      )}
    </div>
  );
};
