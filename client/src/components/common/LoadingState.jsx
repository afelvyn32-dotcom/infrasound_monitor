import React from 'react';
import { Activity } from 'lucide-react';

export const LoadingState = ({ message = 'Loading atmospheric telemetry...' }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px 24px',
      textAlign: 'center',
      minHeight: '240px'
    }}>
      <div style={{
        width: '44px',
        height: '44px',
        borderRadius: '50%',
        backgroundColor: 'var(--color-primary-subtle)',
        border: '1px solid var(--color-primary-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--color-primary)',
        marginBottom: '16px'
      }}>
        <Activity size={22} className="spin" />
      </div>
      <div style={{ fontSize: '0.938rem', fontWeight: '600', color: 'var(--text-primary)' }}>
        {message}
      </div>
      <div style={{ fontSize: '0.781rem', color: 'var(--text-muted)', marginTop: '4px' }}>
        Synchronizing with network observation nodes
      </div>
    </div>
  );
};
